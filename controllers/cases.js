const {response, request} = require('express');
const {getBikeCasesByParams, createBikeCase, updateBikeCase, getBikeCaseById, deleteBikeCaseById} = require('../service/bikeCaseService');
const EntityNotFoundError = require("../exceptions/EntityNotFoundError");

const getBikeCases = async (req = request, res = response) => {

    try{
        const {limit = 5, from = 0} = req.query;
        const result = await getBikeCasesByParams(limit, from, req.query);
        res.status(200).json(result);
    }catch(error){
        console.log(error);
        return res.status(500).json({message: 'Internal Server Error'});
    }
};

const getBikeCase = async (req = request, res = response) => {
    try{
        const {id} = req.params;
        const bikeCase = await getBikeCaseById(id);
        if(!bikeCase) return res.status(404).json({message: 'Item not found'});
        res.status(200).json({data: bikeCase});
    }catch(error){
        return res.status(500).json({message: 'Internal Server Error'});
    }
};

const postBikeCase = async (req = request, res = response) => {

    try{
        const createdBikeCase = await createBikeCase(req.body);
        res.status(201).json({data: createdBikeCase})
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const putBikeCase = async (req = request, res = response) => {
    const {id} = req.params;

    try{
        const updatedBikeCase = await updateBikeCase(id, req.body, true);
        res.status(200).json({data: updatedBikeCase})
    }catch(error){
        res.status(500).json({message: "Internal Server Error"});
    }
};

const deleteCase = async (request, res = response) => {
    const {id} = request.params;
    try{
        const bikeCase = await deleteBikeCaseById(id);
        res.status(200).json({message: 'Item deleted successfully', data: bikeCase});
    }catch(error){
        if(error instanceof EntityNotFoundError) return res.status(404).json({message: 'Item not found'});
        return res.status(500).json({message: 'Internal Server Error'});
    }
};

module.exports = {
    getBikeCases, postBikeCase, putBikeCase, deleteCase, getBikeCase
};