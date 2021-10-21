const validateFields = require('../middlewares/validateFields');
const validateJWT = require('./validateJWT');
const validateRoles = require('./validateRoles');

module.exports = {
    ...validateFields, 
    ...validateJWT, 
    ...validateRoles,
}