const User = require("../models/users/user");
const bCrypt = require("bcryptjs");
const {getPoliceOfficerData, updatePoliceOfficer} = require("./policeOfficers");
const {roles} = require('../models/users/role');

const getSpecificUserDataGivenRole = async(userId, role) => {
    switch(role) {
        case roles.BIKE_OWNER:
            return []; //There is not a specification for bike owner role.
        case roles.POLICE_OFFICER:
            return await getPoliceOfficerData(userId);
        case roles.POLICE_ADMIN:
            return []; //Not yet implemented
        default:
            return [];
    }
}

const updateUserByRole = async (userId, role, data) => {
    switch(role) {
        case roles.BIKE_OWNER:
            return {}; //There is not a specification for bike owner role.
        case roles.POLICE_OFFICER:
            return await updatePoliceOfficer(data);
        case roles.POLICE_ADMIN:
            return {}; //Not yet implemented
        default:
            return {};
    }
}

const getAllUsers = async (limit, from, role = '') => {
    const query = role === '' ? {status: true} : {status: true, role};
    const cases = User.find(query).limit(Number(limit)).skip(Number(from));
    const casesCount = User.countDocuments(query);
    const [resultCases, resultCasesCount] = await Promise.all([cases, casesCount]);

    return {data: resultCases, total: resultCasesCount};
};

const getUserById = async(id) => {
    const user = await User.findById(id);
    if(user.role) {
        const roleSpecificData = await getSpecificUserDataGivenRole(user.id, user.role)
        return {data: user, additional: roleSpecificData}
    }
    return {data: user}
}

const createUser = async (body, role) => {
    const {name, surname, email, password} = body;
    const user = new User({name, surname, email, password, role});

    const salt = bCrypt.genSaltSync();
    user.password = bCrypt.hashSync(user.password, salt);

    return await user.save();
};

const updateUserById = async (id, body) => {
    const {email, name, surname} = body;
    const updatedUser = await User.findByIdAndUpdate(id, {email, name, surname}, {"new": true});
    const updatedSpecific = await updateUserByRole(id, updatedUser.role, body)
    return {data: updatedUser, additional: updatedSpecific};
}

const deleteUserById = (id) => {
    return User.findByIdAndUpdate(id, {deletedAt: new Date().toISOString()}, {"new": true});
}

module.exports = {getAllUsers, getUserById, createUser, updateUserById, deleteUserById}

