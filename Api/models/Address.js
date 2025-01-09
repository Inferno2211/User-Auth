const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const AddressSchema = new Schema({
    addressInfo: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
});

const AddressModel = model('Address', AddressSchema);

module.exports = AddressModel