const {response, request} = require('express');
const {getAllUsers, deleteUserById, updateUserById} = require('../../service/users/users');

const getUsers = async (req = request, res = response) => {
    const {limit = 5, from = 0} = req.query;
    try{
        const result = await getAllUsers(limit, from);
        res.status(200).json(result);
    }catch(error){
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

const updateUser = async (req = request, res = response) => {
    const {id} = req.params;
    try{
        const updatedUser = await updateUserById(id, req.body)
        res.status(200).json({data: updatedUser})
    }catch(error){
        res.status(500).json({message: 'Internal Server Error'});
    }
};

module.exports = {
    getUsers, deleteUser, updateUser
};