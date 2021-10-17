const {Router} = require('express');
const {getUsers, createUser} = require('../../controllers/users/policeOfficers');

const router = Router();

router.get('/',  getUsers);

router.post('/', createUser);

module.exports = router;

