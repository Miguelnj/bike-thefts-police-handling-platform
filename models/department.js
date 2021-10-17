const {Schema, model} = require('mongoose');

const departmentSchema = Schema({
    officersCapacity: {
        type: Number,
        required: [true, 'Officers Capacity id is required']
    },
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
});

departmentSchema.methods.toJSON = function () {
    const {__v, _id, password, ...object} = this.toObject();
    object.uid = _id;
    return object;
};

module.exports = model('Department', departmentSchema);