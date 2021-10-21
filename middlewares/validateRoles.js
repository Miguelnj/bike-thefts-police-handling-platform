const { response } = require("express");
const User = require('../models/users/user');
const {roles} = require('../models/users/role');

const isAdminRole = async (req, res = response, next) => {

    if(!req.user) return res.status(500).json({message: 'Internal Server Error'});

    try{
        const {role} = req.user;
        if(role !== roles.POLICE_ADMIN) return res.status(401).json({message: 'Unauthorized'});
        next();
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'});
    }

}

const hasRole = ( ...roles ) => {
    return async (req, res = response, next) => {
        if(!req.user) return res.status(401).json({message: 'Unauthorized'});
        if(!roles.includes(req.user.role)) return res.status(401).json({message: 'User do not accomplish the needed privileges'});
        next();
    }
}

const canUpdateRole = async (req, res = response, next) => {

    if(!req.user) return res.status(500).json({message: 'Internal Server Error'});
    const {id} = req.params;

    try{
        const userToBeUpdated = await User.findById(id);
        if(userToBeUpdated.role === roles.POLICE_OFFICER || userToBeUpdated.role === roles.BIKE_OWNER) next();
        else return res.status(400).json({message: 'Privileges conflict'});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'});
    }

}

module.exports = {isAdminRole, hasRole, canManageUser: canUpdateRole}