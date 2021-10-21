const {model: Role, roles} = require('../models/users/role');
const User = require('../models/users/user');

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

const userExists = async(id) => {
    const user = await User.findById(id);
    if(!user) throw new Error('The user does not exist in DB');
};

module.exports = {isRoleValid, emailExists, userExists};