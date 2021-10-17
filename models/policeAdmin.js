const {Schema, model} = require('mongoose');

const policeAdminSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
});

policeAdminSchema.methods.toJSON = function () {
    const {__v, _id, password, ...object} = this.toObject();
    object.uid = _id;
    return object;
};

module.exports = model('Officer', policeAdminSchema);