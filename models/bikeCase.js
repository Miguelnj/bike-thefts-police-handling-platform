const {Schema,  model} = require('mongoose');

const bikeCaseSchema = Schema({
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    color: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Boolean,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
    stolenDate: {
        type: Date,
        required: true
    },
    deletedAt: {
        type: Date
    },
    officerId: {
        type: Schema.Types.ObjectId,
        ref: "PoliceOfficer"
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "BikeOwner"
    }
});

bikeCaseSchema.methods.toJSON = function(){
    const {__v, _id, ...object} = this.toObject();
    object.uid = _id;
    return object;
};

bikeCaseSchema.pre('save', function(next) {
    if (this.isNew) this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    next();
});

module.exports = model('BikeCase', bikeCaseSchema);