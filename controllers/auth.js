const {performLogin} = require('../service/authService');
const {request, response} = require("express");
const {createUser} = require('../service/users');
const {roles} = require('../models/users/role');

const login = async (req = request, res = response) => {
    const {password, email} = req.body;
    try{
        const token = await performLogin(email, password);
        if(!token) return res.status(400).json({message: 'Incorrect user or password'});
        res.status(200).json({token});
    }catch(error){
        return res.status(500).json({message: 'Internal server error'});
    }
}

const register = async (req = request, res = response) => {
    try{
        const createdUser = await createUser(req.body, roles.BIKE_OWNER);
        return res.status(201).json(createdUser);
    }catch(error){
        return res.status(500).json({message: 'Internal server error'});
    }
}

module.exports = {login, register}