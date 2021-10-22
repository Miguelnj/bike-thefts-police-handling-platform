const {Router} = require('express');
const {roles} = require('../models/users/role');
const {getBikeCases, postBikeCase, putBikeCase, deleteCase, getBikeCase, putResolveBikeCase, putAssignBikeCase} = require("../controllers/cases");
const {validateJWT, validateFields, hasRole, isAdminRole} = require('../middlewares/index');
const {licenseNumberDoesNotExist, bikeCaseExists, officerExists} = require("../service/databaseValidation");
const {check} = require("express-validator");

const router = Router();

router.get('/', [
    validateJWT,
    hasRole(roles.POLICE_OFFICER, roles.POLICE_ADMIN),
    validateFields,
], getBikeCases);

router.get('/:id', [
    validateJWT,
    check('id', 'Not a valid ID').isMongoId(),
    hasRole(roles.POLICE_OFFICER, roles.POLICE_ADMIN),
    validateFields,
], getBikeCase);

router.post('/', [
    validateJWT,
    check('stolenDate', 'Stolen Date is not valid').isISO8601().trim().escape(),
    check('address', 'Stolen Date is not valid').isString().trim().escape(),
    check('licenseNumber', 'Stolen Date is not valid').isString().trim().escape().custom(licenseNumberDoesNotExist),
    check('color', 'Stolen Date is not valid').isString().trim().escape(),
    check('model', 'Stolen Date is not valid').isString().trim().escape(),
    check('description', 'Stolen Date is not valid').isString().trim().escape(),
    validateFields,
], postBikeCase);

router.put('/:id', [
    check('id', 'Not a valid ID').isMongoId().custom(bikeCaseExists),
    validateJWT,
    check('stolenDate', 'Stolen Date is not valid').optional().isISO8601().trim().escape(),
    check('address', 'Stolen Date is not valid').optional().isString().trim().escape(),
    check('licenseNumber', 'Stolen Date is not valid').optional().isString().trim().escape().custom(licenseNumberDoesNotExist),
    check('color', 'Stolen Date is not valid').optional().isString().trim().escape(),
    check('model', 'Stolen Date is not valid').optional().isString().trim().escape(),
    check('description', 'Stolen Date is not valid').optional().isString().trim().escape(),
    validateFields,
], putBikeCase);

router.put('/:id/resolve', [
    check('id', 'Not a valid ID').isMongoId().custom(bikeCaseExists),
    validateJWT,
    hasRole(roles.POLICE_OFFICER, roles.POLICE_ADMIN),
    validateFields,
], putResolveBikeCase);

router.put('/:id/assign', [
    check('id', 'Not a valid ID').isMongoId().custom(bikeCaseExists),
    validateJWT,
    check('officerId', 'OfficerId not valid').isMongoId().custom(officerExists),
    hasRole(roles.POLICE_ADMIN),
    validateFields,
], putAssignBikeCase);

router.delete('/:id', [
    check('id', 'Not a valid ID').isMongoId().custom(bikeCaseExists),
    validateJWT,
    isAdminRole,
    validateFields,
], deleteCase);

module.exports = router;

