const {Router} = require('express');
const {getUsers, createUser} = require('../../controllers/users/bikeOwners');
const {deleteUser, updateUser} = require("../../controllers/users/users");

const router = Router();

router.get('/', getUsers);

router.post('/', createUser);

router.delete('/:id', deleteUser);

router.put('/:id', updateUser);

module.exports = router;

