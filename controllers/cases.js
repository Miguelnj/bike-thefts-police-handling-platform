const {response, request} = require('express');
const BikeCase = require('../models/bikeCase');

const getBikeCases = async (req = request, res = response) => {

    const {limit = 5, from = 0} = req.query;
    const query = {status: true};

    const cases = BikeCase.find().limit(Number(limit)).skip(Number(from));
    const casesCount = BikeCase.countDocuments(query);

    const [resultCases, resultCasesCount] = await Promise.all([cases, casesCount]);

    res.status(200).json({data: resultCases, total: resultCasesCount});
};

const postBikeCase = async (req = request, res = response) => {

    const {stolenDate, address, licenseNumber, color, model, description} = req.body;

    const bikeData = {stolenDate, address, licenseNumber, color, model, description}

    try{
        const bikeCase = new BikeCase(bikeData);
        await bikeCase.save();
        //TODO Address to take latitude and longitude
        //TODO Any free police officer?
        res.status(201).json({data: bikeCase})
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const updateBikeCase = async (req = request, res = response) => {
    const {id} = req.params;
    const {address, isActive, licenseNumber,description, model, ...unWanted} = req.body;

    const bikeDataToUpdate = {address, isActive, licenseNumber, description, model}

    try{
        const bikeCase = await BikeCase.findByIdAndUpdate(id, bikeDataToUpdate, {"new": true});
        console.log(bikeCase);
        res.status(200).json({data: bikeCase})
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const deleteCase = async (request, res = response) => {
    const {id} = request.params;
    //TODO Check is not already deleted
    try{
        const bikeCase = await BikeCase.findByIdAndUpdate(id, {deletedAt: new Date().toISOString()}, {"new": true});
        res.status(200).json(bikeCase)
    }catch(error){
        console.log(error);
        return res.status(500).json({message: 'Internal Server Error'});
    }
};

module.exports = {
    getBikeCases, postBikeCase, updateBikeCase, deleteCase
};