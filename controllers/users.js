const {response, request} = require('express');
const {getAllUsers, getUserById, createUser, updateUserById, deleteUserById} = require('../service/users');
const MissingParametersError = require('../exceptions/MissingParametersError');

const getUsers = async (req = request, res = response) => {
    const {limit = 5, from = 0, role} = req.query;
    try{
        let result;
        if(role) result = await getAllUsers(limit, from, role);
        else result = await getAllUsers(limit, from);
        res.status(200).json(result);
    }catch(error){
        res.status(500).json({message: 'Internal Server Error'});
    }
};

const getUser = async (req = request, res = response) => {
    const {id} = req.params;
    try{
        const user = await getUserById(id);
        res.status(200).json(user);
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
}

const postUser = async (req = request, res = response) => {
    const {role} = req.body;
    try{
        const user = await createUser(req.body, role);
        res.status(200).json(user);
    }catch(error){
        if(error instanceof MissingParametersError){
            res.status(400).json({message: 'Missing required parameters'});
        }
        res.status(500).json({message: 'Internal Server Error'});
    }
}

const putUser = async (req = request, res = response) => {
    const {id} = req.params;
    try{
        const updatedUser = await updateUserById(id, req.body)
        res.status(200).json({data: updatedUser})
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
};

const deleteUser = async (req = request, res = response) => {
    const {id} = req.params;
    try{
        const deletedUser = await deleteUserById(id);
        res.status(200).json({data: deletedUser});
    }catch(error){
        res.status(500).json({message: 'Internal Server Error'});
    }
};

module.exports = {
    getUsers, getUser, postUser, putUser, deleteUser
};