const PoliceOfficer = require('../models/policeOfficer');
const MissingParametersError = require('../exceptions/MissingParametersError');

const getPoliceOfficerData = async(userId) => {
    return PoliceOfficer.findOne({userId});
}

const getPoliceOfficerById = async(officerId) => {
    return PoliceOfficer.findById(officerId);
}

const updatePoliceOfficer = async (id, body) => {
    const {assignedCase, departmentId, officerCode} = body;
    return PoliceOfficer.findOneAndUpdate({userId: id}, {assignedCase, departmentId, officerCode}, {"new": true});
}

const createPoliceOfficer = async (body, userId) => {
    const {departmentId, officerCode} = body;
    if(!officerCode || !userId) throw new MissingParametersError('Is the message required?');

    return new Promise((resolve, reject) => {
        const policeOfficer = new PoliceOfficer({departmentId, officerCode, userId: userId});
        policeOfficer.save().then((policeOfficer) => resolve(policeOfficer))
            .catch((error) => reject(error));
    });
}

//TODO Assign the bike case to officers of a specific department depending of the location - latitude and longitude
const assignBikeCaseToOfficer = async (bikeCaseId) => {
    try{
        let officer = await PoliceOfficer.findOne({assignedCase: null });
        if(officer) {
            const updateCondition = {assignedCase: bikeCaseId};
            officer = await PoliceOfficer.findByIdAndUpdate(officer.id, updateCondition, {"new": true});
            return officer.id;
        }
    }catch(error){
        console.log(error);
        //Do nothing ... until we have a proper log :)
    }
}

module.exports = {getPoliceOfficerData, updatePoliceOfficer, createPoliceOfficer, assignBikeCaseToOfficer, getPoliceOfficerById}