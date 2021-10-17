const {response, request} = require('express');

const getUser = (request = request, res = response) => {

    const {q} = request.query;

    res.status(200).json({message: 'GET API', query: q})
};

const postUser = (request, res = response) => {
    const {name, age} = request.body;
    res.status(201).json({
        message: 'POST API', name, age
    })
};

const putUser = (request, res = response) => {
    const {id} = request.params;
    res.status(200).json({message: 'PUT API', id})
};

const deleteUser = (request, res = response) => {
    res.status(200).json('DELETE API')
};

module.exports = {
    getUser, postUser, putUser, deleteUser
};