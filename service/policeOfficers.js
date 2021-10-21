const PoliceOfficer = require('../models/policeOfficer');
const MissingParametersError = require('../exceptions/MissingParametersError');

const getPoliceOfficerData = async(userId) => {
    return PoliceOfficer.findOne({userId});
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

module.exports = {getPoliceOfficerData, updatePoliceOfficer, createPoliceOfficer}