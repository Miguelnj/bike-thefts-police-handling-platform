const BikeCase = require("../models/bikeCase");
const PoliceOfficer = require("../models/policeOfficer");
require('../models/policeOfficer');
const {assignBikeCaseToOfficer} = require('../service/policeOfficers');
const EntityNotFoundError = require("../exceptions/EntityNotFoundError");
const CannotResolveBikeCase = require("../exceptions/CannotResolveBikeCase");
const CannotAssignBikeCase = require("../exceptions/CannotAssignBikeCase");
const {getPoliceOfficerById} = require("./policeOfficers");


const buildQueryGivenParams = (params) => {
    if(params === undefined) return {status: true}
    const {licenseNumber, color, model, stolenDate, address} = params;
    return {status: true,
        ...(licenseNumber ? { licenseNumber } : {}),
        ...(color ? { color: {$regex: '.*' + color + '.*'} } : {}),
        ...(model ? { model } : {}),
        ...(stolenDate ? { stolenDate } : {}),
        ...(address ? { address } : {})};
}

const getUnAssignedCase = async () => {
    return BikeCase.findOne({officerId: null, isActive: true});
}

const getBikeCasesByParams = async(limit, from, params) => {

    try{
        const query = buildQueryGivenParams(params);
        const cases = BikeCase.find(query).limit(Number(limit)).skip(Number(from)).populate('officerId');
        const casesCount = BikeCase.countDocuments(query);

        const [resultCases, resultCasesCount] = await Promise.all([cases, casesCount]);

        return {data: resultCases, total: resultCasesCount};
    }catch(error){
        console.log(error);
        return {data: {}, total: {}};
    }
}

const getBikeCaseById = async (id) => {
    try{
        return await BikeCase.findById(id).populate('officerId');
    }catch(error){
        return null;
    }
}

const createBikeCase = async (body) => {
    const {stolenDate, address, licenseNumber, color, model, description} = body;
    const bikeData = {stolenDate, address, licenseNumber, color, model, description}

    try{
        let bikeCase = new BikeCase(bikeData);
        await bikeCase.save();
        //TODO Address to take latitude and longitude
        let officerId = await assignBikeCaseToOfficer(bikeCase.id)
        if(officerId) bikeCase = await updateBikeCase(bikeCase.id, {officerId});
        return bikeCase;
    }catch(error){
        throw error;
    }
}

const resolveBikeCase = async (id) => {
    //Set the item as inactive to consider it as resolved, but we could create a
    // isResolve and resolvedAt attributes for more understanding
    let bikeCase = await getBikeCaseById(id);
    if(!bikeCase.officerId || !bikeCase.isActive) throw new CannotResolveBikeCase('bikeCase cannot be resolved');

    try{
        let updatedBikeCase = await updateBikeCase(id, {isActive: false})
        const updatedOfficer = await PoliceOfficer.findByIdAndUpdate(updatedBikeCase.officerId, {assignedCase: null})

        const bikeCaseToBeAssigned = await getUnAssignedCase();
        if(bikeCaseToBeAssigned) {
            const officerId = await assignBikeCaseToOfficer(bikeCaseToBeAssigned.id, updatedOfficer.id);
            if(officerId) await updateBikeCase(bikeCaseToBeAssigned.id, {officerId: officerId});
        }

        return [updatedBikeCase, updatedOfficer];
    }catch(error){
        throw error;
    }
}

const assignBikeCase = async (id, officerId) => {
    //Set the item as inactive to consider it as resolved, but we could create a
    // isResolve and resolvedAt attributes for more understanding
    let bikeCase = await getBikeCaseById(id);
    if(!bikeCase.isActive) throw new CannotAssignBikeCase('bikeCase cannot be assigned to an officer');

    const policeOfficerToUpdate = await getPoliceOfficerById(officerId);
    if(!policeOfficerToUpdate) throw new EntityNotFoundError('Police Officer not found');

    try{
        if(policeOfficerToUpdate.assignedCase){
            //Police officer has an assigned case yet... we should updated the case to remove the officerId from it.
            await unAssignOfficerIdFromBikeCase(policeOfficerToUpdate.assignedCase);
        }
        let updatedBikeCase = await updateBikeCase(id, {officerId: officerId})
        const updatedOfficer = await PoliceOfficer.findByIdAndUpdate(officerId, {assignedCase: id}, {"new": true})
        return [updatedBikeCase, updatedOfficer];
    }catch(error){
        throw error;
    }
}

const unAssignOfficerIdFromBikeCase = async (bikeCaseId) => {
    try{
        let bikeCase = await getBikeCaseById(bikeCaseId);
        if(!bikeCase.isActive) return; //Everything is ok, bikeCase is resolved so officerId should not be removed from it.
        await updateBikeCase(bikeCaseId, {officerId: null});
    }catch(error){
        console.log(error);
        throw error;
    }
}

const updateBikeCase = async (id, body, isBikeOwnerUpdate = false) => {
    const {address, isActive, licenseNumber, description, model, officerId} = body;

    let bikeDataToUpdate;
    if(isBikeOwnerUpdate) bikeDataToUpdate = {address, licenseNumber, description, model}
    else bikeDataToUpdate = {address, isActive, licenseNumber, description, model, officerId}

    try{
        return await BikeCase.findByIdAndUpdate(id, bikeDataToUpdate, {"new": true});
    }catch(error){
        throw error;
    }
}

const deleteBikeCaseById = async(id) => {
    let bikeCase = await getBikeCaseById(id);
    if(!bikeCase) throw EntityNotFoundError('Item not found');
    try{
        if(bikeCase.deletedAt) return bikeCase;
         return await BikeCase.findByIdAndUpdate(id, {deletedAt: new Date().toISOString()}, {"new": true});
    }catch(error){
        throw error;
    }
}

module.exports = {getBikeCasesByParams, createBikeCase, updateBikeCase,
    deleteBikeCaseById, getBikeCaseById, resolveBikeCase, assignBikeCase}