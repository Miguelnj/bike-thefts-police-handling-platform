const { response, request } = require('express');
const User = require('../models/users/user');
const jwt = require('jsonwebtoken');

const validateJWT = async (req = request, res = response, next) => {

    let token = req.header('Authorization');
    if(!token) return res.status(401).json({message: 'Unauthorized'});
    try{
        const {uid} = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);
        req.user = await User.findById(uid);
        next();
    }catch(error){
        console.log(error);
        res.status(401).json({message: 'Invalid token'});
    }
}

module.exports = {validateJWT};