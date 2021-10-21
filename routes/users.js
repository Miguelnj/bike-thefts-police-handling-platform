const {Router} = require('express');
const {check} = require('express-validator');
const {roles} = require('../models/users/role');
const {getUsers, getUser, postUser, putUser, deleteUser} = require('../controllers/users');
const {validateJWT, validateFields, hasRole} = require('../middlewares/index');
const {isAdminRole, canManageUser} = require("../middlewares");
const {userExists, isRoleValid, emailExists} = require("../service/databaseValidation");

const router = Router();

router.get('/', [
    validateJWT,
    hasRole(roles.POLICE_ADMIN, roles.POLICE_OFFICER),
    validateFields
], getUsers);

router.get('/:id', [
    validateJWT,
    hasRole(roles.POLICE_ADMIN, roles.POLICE_OFFICER),
    check('id','ID not valid').isMongoId().custom(userExists),
    validateFields
],getUser);

router.post('/', [
    validateJWT,
    isAdminRole,
    check('email', 'email is required').isEmail().trim().escape().normalizeEmail().custom(emailExists),
    check('surname', 'surname is required').isString().trim().escape(),
    check('name', 'surname is required').isString().trim().escape(),
    check('password', 'Password should be combination of one uppercase , ' +
        'one lower case, one special char, one digit and min 8 , max 20 char long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i"),
    check('role', 'Not a valid role').custom(isRoleValid),
    check('officerCode', 'Officer Code not valid').optional().isString().trim().escape(),
    check('departmentId', 'DepartmentId not valid').optional().isMongoId(),
    validateFields
], postUser);

router.put('/:id', [
    check('id', 'Not a valid ID').isMongoId(),
    check('id').custom(userExists),
    validateJWT,
    isAdminRole,
    validateFields,
    canManageUser,
    check('email', 'email is required').optional().isEmail().trim().escape().normalizeEmail().custom(emailExists),
    check('surname', 'surname is required').isString().trim().escape(),
    check('name', 'surname is required').isString().trim().escape(),
    check('role', 'Not a valid role').custom(isRoleValid),
    check('officerCode', 'Officer Code not valid').optional().isString().trim().escape(),
    check('departmentId', 'DepartmentId not valid').optional().isMongoId(),
    validateFields
], putUser);

router.delete('/:id', [
    check('id', 'Not a valid ID').isMongoId(),
    check('id').custom(userExists),
    validateJWT,
    isAdminRole,
    validateFields,
    canManageUser
],deleteUser);

module.exports = router;

