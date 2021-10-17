const User = require("../../models/users/user");
const bCrypt = require("bcryptjs");

const getAllUsers = async (limit, from, role = '') => {
    const query = role === '' ? {status: true} : {status: true, role};

    const cases = User.find().limit(Number(limit)).skip(Number(from));
    const casesCount = User.countDocuments(query);
    const [resultCases, resultCasesCount] = await Promise.all([cases, casesCount]);

    return {data: resultCases, total: resultCasesCount};
};

const createUser = async (userData) => {
    const user = new User(userData);

    const salt = bCrypt.genSaltSync();
    user.password = bCrypt.hashSync(user.password, salt);

    return await user.save();
};

const deleteUserById = (id) => {
    return User.findByIdAndUpdate(id, {deletedAt: new Date().toISOString()}, {"new": true});
}

const updateUserById = async (id, body) => {
    const {_id, email, name, surname, ...unwanted} = body;
    return User.findByIdAndUpdate(id, {email, name, surname});
}

module.exports = {getAllUsers, createUser, deleteUserById, updateUserById}

