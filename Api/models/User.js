const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    firstname: {
        type: String,
        default: '',
        maxlength: 50
    },
    lastname: {
        type: String,
        default: '',
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    number: {
        type: String,
        default: '',
        match: [/^\d{10}$/, 'Please use a valid phone number.']
    },
    dob: {
        type: Date,
        required: true
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: 'Address'
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
    }
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;