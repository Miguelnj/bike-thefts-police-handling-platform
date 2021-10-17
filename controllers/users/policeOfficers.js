import {request, response} from "express";
const {getPoliceOfficerUsers,  createPoliceOfficerUser} = require('../../service/users/policeOfficers');

const getUsers = async (req = request, res = response) => {
    const {limit = 5, from = 0} = req.query;
    try{
        const result = await getPoliceOfficerUsers(limit, from);
        return res.status(200).json(result);
    }catch(error){
        return res.status(500).json({message: 'Internal Server Error'});
    }
};

const createUser = async (req = request, res = response) => {
    try{
        const createdUser = await createPoliceOfficerUser(req.body);
        res.status(201).json({data: createdUser})
    }catch(error){
        res.status(500).json({message: 'Internal Server Error'});
    }
};

module.exports = {getUsers, createUser}