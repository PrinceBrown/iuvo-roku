const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = Schema({
    username: {
        type: String,
        trim: true,
        minlength: 2
    },
    googleId: {
        type: String,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    address: {
        type: String,
        trim: true
    },
    userType: {
        type: String,
        trim: true,
        default: 'customer'
    },
    profilePicture: {
        type: String,
        trim: true
    },
    about: {
        type: String,
        trim: true
    },
    registeredOn: {
        type: Date,
        default: Date.now
    },
    AmountSpent: {
        type: Number,
        trim: true
    }

});

const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;