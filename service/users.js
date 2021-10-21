const User = require("../models/users/user");
const bCrypt = require("bcryptjs");
const {getPoliceOfficerData, updatePoliceOfficer, createPoliceOfficer} = require("./policeOfficers");
const {roles} = require('../models/users/role');

const getUserById = async(id) => {
    const user = await User.findById(id);
    if(user.role) {
        const roleSpecificData = await getSpecificUserDataGivenRole(user.id, user.role)
        return {data: user, additional: roleSpecificData}
    }
    return {data: user}
}

const getAllUsers = async (limit, from, role = '') => {
    const query = role === '' ? {status: true} : {status: true, role};
    const cases = User.find(query).limit(Number(limit)).skip(Number(from));
    const casesCount = User.countDocuments(query);
    const [resultCases, resultCasesCount] = await Promise.all([cases, casesCount]);

    return {data: resultCases, total: resultCasesCount};
};

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
            return await updatePoliceOfficer(userId, data);
        case roles.POLICE_ADMIN:
            return {}; //Not yet implemented
        default:
            return {};
    }
}

const createAdditionalUserEntityIfNecessary = async(body, role, user) => {
    try{
        switch(role) {
            case roles.BIKE_OWNER:
                return null; //There is not a specification for bike owner role.
            case roles.POLICE_OFFICER:
                return await createPoliceOfficer(body, user.id);
            case roles.POLICE_ADMIN:
                return null; //Not yet implemented
            default:
                return null;
        }
    }catch(error){
        throw error;
    }
}

const createUser = async (body, role) => {
    const {name, surname, email, password} = body;
    const user = new User({name, surname, email, password, role});

    const salt = bCrypt.genSaltSync();
    user.password = bCrypt.hashSync(user.password, salt);

    const createdUser = await user.save();
    let additionalEntity;
    try{
        additionalEntity = await createAdditionalUserEntityIfNecessary(body, role, createdUser);
    }catch(error){
        await user.delete(); //Delete the created user because we could not create its related entity
        throw error;
    }
    return additionalEntity ? {data: createdUser, additional: additionalEntity} : {data: createdUser};
};

const updateUserById = async (id, body) => {
    const {email, name, surname} = body;
    const updatedUser = await User.findByIdAndUpdate(id, {email, name, surname}, {"new": true});
    const updatedPoliceOfficer = await updateUserByRole(id, updatedUser.role, body)
    return {data: updatedUser, additional: updatedPoliceOfficer};
}

const deleteUserById = (id) => {
    return User.findByIdAndUpdate(id, {deletedAt: new Date().toISOString()}, {"new": true});
}

module.exports = {getAllUsers, getUserById, createUser, updateUserById, deleteUserById}

