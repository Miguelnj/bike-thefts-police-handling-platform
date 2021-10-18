const PoliceOfficer = require('../models/policeOfficer');

const getPoliceOfficerData = async(userId) => {
    return PoliceOfficer.findOne({userId});
}

const updatePoliceOfficer = async (id, body) => {
    const {assignedCase, departmentId, officerCode} = body;
    return PoliceOfficer.findByIdAndUpdate(id, {assignedCase, departmentId, officerCode}, {"new": true});
}

module.exports = {getPoliceOfficerData, updatePoliceOfficer}