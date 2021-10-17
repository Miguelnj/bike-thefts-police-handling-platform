const {Schema,  model} = require('mongoose');

const userSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    surname: {
        type: String,
        required: [true, "At least one surname is required"]
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'The password is required']
    },
    role: {
        type: String,
        required: [true, 'Roles are required']
    },
    status: {
        type: Boolean,
        default: true
    },
    createAt: {
        type: Date,
    },
    updatedAt: {
        type: Date
    },
    deletedAt: {
        type: Date
    }
});

userSchema.methods.toJSON = function(){
    const {__v, _id,  password, ...object} = this.toObject();
    object.uid = _id;
    return object;
};

module.exports = model('User', userSchema);