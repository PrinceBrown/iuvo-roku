const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = Schema({
    username: {
        type: String,

    },
    googleId: {
        type: String

    },
    firstName: {
        type: String,


    },
    lastName: {
        type: String,

    },
    email: {
        type: String,
    },
    password: {
        type: String,

    },
    address: {
        type: String,
        trim: true
    },
    userType: {
        type: String,
        default: 'Admin'
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
    }

});

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;