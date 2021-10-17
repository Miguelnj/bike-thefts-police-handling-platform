const {getAllUsers, createUser} = require('../../service/users/users');
const PoliceOfficer = require('../../models/policeOfficer');
const role = "POLICE_OFFICER_ROLE";

const getPoliceOfficerUsers = async (limit, from) => {
    //TODO For each retrieved user, we must fill the police officer data
    return await getAllUsers(limit, from, role);
};

const createPoliceOfficerUser = async (requestBody) => {
    const {name, surname, email, password} = requestBody;
    let createdUser = await createUser({name, surname, email, password, role});

    const {departmentId, officerCode} = requestBody;
    const policeOfficer = await new PoliceOfficer({departmentId, officerCode, userId: createdUser.id}).save();

    createdUser.departmentId = departmentId;
    createdUser.officerCode = officerCode;
    return createdUser;
};

module.exports = {getPoliceOfficerUsers, createPoliceOfficerUser}