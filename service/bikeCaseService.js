const BikeCase = require("../models/bikeCase");
require('../models/policeOfficer');
const {assignBikeCaseToOfficer} = require('../service/policeOfficers');
const EntityNotFoundError = require("../exceptions/EntityNotFoundError");


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
        return await BikeCase.findById(id);
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

module.exports = {getBikeCasesByParams, createBikeCase, updateBikeCase, deleteBikeCaseById, getBikeCaseById}