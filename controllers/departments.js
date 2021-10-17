const {response, request} = require('express');
const Department = require('../models/department');

const getDepartments = async (req = request, res = response) => {

    const {limit = 5, from = 0} = req.query;
    const query = {status: true};

    const cases = Department.find().limit(Number(limit)).skip(Number(from));
    const casesCount = Department.countDocuments(query);

    const [resultCases, resultCasesCount] = await Promise.all([cases, casesCount]);

    res.status(200).json({data: resultCases, total: resultCasesCount});
};

const createDepartment = async (req = request, res = response) => {

    try {
        const department = new Department(req.body);
        await department.save();
        res.status(201).json({data: department})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const updateDepartment = async (req = request, res = response) => {
    const {id} = req.params;
    const {deletedAt, createdAt, ...department} = req.body;
    try {
        const updatedDepartment = await Department.findByIdAndUpdate(id, department, {"new": true})
        res.status(201).json({data: updatedDepartment})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const deleteDepartment = async (req = request, res = response) => {
    const {id} = req.params;
    //TODO Check is not already deleted
    try {
        const department = await Department.findByIdAndUpdate(id, {deletedAt: new Date().toISOString()}, {"new": true});
        res.status(200).json(department)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
};

module.exports = {
    getDepartments, createDepartment, updateDepartment, deleteDepartment
};