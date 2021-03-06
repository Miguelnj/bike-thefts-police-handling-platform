const {model: Role, roles} = require('../models/users/role');
const User = require('../models/users/user');
const PoliceOfficer = require('../models/policeOfficer');
const BikeCase = require('../models/bikeCase');

const isRoleValid = async(role = '') => {
    const roleExists = Object.values(roles).includes(role);
    if(!roleExists) throw new Error(`Role ${role} is not registered in database`);
    if(role === roles.POLICE_ADMIN) throw new Error(`Cannot create a user with the given role`);
};

const emailExists = async(email = '') => {
    if(!email) throw new Error('Email is required');
    const user = await User.findOne({email});
    if(user) throw new Error('Email is already registered');
};

const licenseNumberDoesNotExist = async(licenseNumber) => {
    if(!licenseNumber) throw new Error('License number is required');
    const bikeCase = await BikeCase.findOne({licenseNumber});
    if(bikeCase) throw new Error('License number is already registered');
};

const bikeCaseExists = async(id) => {
    const bikeCase = await BikeCase.findById(id);
    if(!bikeCase) throw new Error('The bikeCase does not exist in DB');
}

const officerExists = async(id) => {
    const officerExists = await PoliceOfficer.findById(id);
    if(!officerExists) throw new Error('The officer does not exist in DB');
}

const userExists = async(id) => {
    const user = await User.findById(id);
    if(!user) throw new Error('The user does not exist in DB');
};

module.exports = {isRoleValid, emailExists, userExists, licenseNumberDoesNotExist, bikeCaseExists, officerExists};