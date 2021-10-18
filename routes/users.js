const {Router} = require('express');
const {getUsers, getUser, postUser, putUser, deleteUser} = require('../controllers/users');

const router = Router();

router.get('/', getUsers);

router.get('/:id', getUser);

router.post('/', postUser);

router.put('/:id', putUser);

router.delete('/:id', deleteUser);

module.exports = router;

