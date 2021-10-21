const jwt = require('jsonwebtoken');
const User = require("../models/users/user");
const bcrypt = require("bcryptjs");

const generateJWT = (uid = '') => {
    return new Promise( (resolve, reject) => {
        const payload = {uid}
        jwt.sign(payload, process.env.SECRET_KEY,{expiresIn: '4h'}, (err, token) => {
            if(err) {
                console.log(err);
                reject('Token could not be generated')
            } else resolve(token);
        });
    });
}

const performLogin = async(email, password) => {
    const user = await User.findOne({email});
    if(!user || !user.status) return false;

    const validPassword = bcrypt.compareSync(password, user.password);
    if(!validPassword) return false;
    return await generateJWT(user.id);
}

module.exports = {generateJWT, performLogin};