const {Router} = require('express');
const {getUsers} = require('../../controllers/users/users');

const router = Router();

router.get('/all', getUsers);

module.exports = router;

