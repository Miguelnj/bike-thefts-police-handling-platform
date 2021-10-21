const {Router} = require('express');
const {check} = require('express-validator');
const {login, register} = require('../controllers/auth');
const {validateFields} = require('../middlewares/validateFields');
const {emailExists} = require('../service/databaseValidation');

const router = Router();

router.post('/login', [
    check('email', 'email is required').isEmail().escape(),
    check('password', 'password is required').not().isEmpty(),
    validateFields
],login);

router.post('/register', [
    check('email', 'email is required').isEmail().trim().escape().normalizeEmail().custom(emailExists),
    check('surname', 'surname is required').isString().trim().escape(),
    check('name', 'surname is required').isString().trim().escape(),
    check('password', 'Password should be combination of one uppercase , ' +
        'one lower case, one special char, one digit and min 8 , max 20 char long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i"),
    validateFields
], register);

module.exports = router;

