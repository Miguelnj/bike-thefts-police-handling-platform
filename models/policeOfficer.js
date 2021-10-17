const {Schema, model} = require('mongoose');

const officerSchema = Schema({
    officerCode: {
        type: String,
        required: [true, 'Police officer id is required']
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    assignedCase: {
        type: Schema.Types.ObjectId,
        ref: "BikeCase"
    },
    departmentId: {
        type: Schema.Types.ObjectId,
        ref: "Department"
    },
});

officerSchema.methods.toJSON = function () {
    const {__v, _id, password, ...object} = this.toObject();
    object.uid = _id;
    return object;
};

module.exports = model('Officer', officerSchema);