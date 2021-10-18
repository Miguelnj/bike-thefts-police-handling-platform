const {Schema, model} = require('mongoose');

const ROLES = {
    BIKE_OWNER: "BIKE_OWNER_ROLE",
    POLICE_OFFICER: "POLICE_OFFICER_ROLE",
    POLICE_ADMIN: "POLICE_ADMIN_ROLE"
}

const RoleSchema = Schema({
    rol: {
        type: "String",
        required: [true, "Role is required"]
    }
});

module.exports = {model: model('Role', RoleSchema), roles: ROLES};