const {getAllUsers, createUser} = require('../../service/users/users');
const role = "BIKE_OWNER_ROLE";

const getBikeOwnerUsers = async (limit, from) => {
    return await getAllUsers(limit, from, role);
};

const createBikeOwnerUser = async (requestBody) => {
    const {name, surname, email, password} = requestBody;
    return await createUser({name, surname, email, password, role});
};

module.exports = {getBikeOwnerUsers, createBikeOwnerUser}