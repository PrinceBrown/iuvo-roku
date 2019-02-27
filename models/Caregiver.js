const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CaregiverSchema = Schema({
    username: {
        type: String,
        trim: true,
        minlength: 2
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
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 2
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },
    address: {
        type: String,
        trim: true
    },
    userType: {
        type: String,
        trim: true
    },
    ExperienceYears: {
        type: Number
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
    AmountEarned: {
        type: Number,
        trim: true
    },
    hourRate: {
        type: Number,
        trim: true
    },
    availability: {
        type: String,
        trim: true
    },
    service: {
        type: String,
        trim: true
    },
    dailyHours: {
        type: Number,
        trim: true
    }
});

const Caregiver = mongoose.model('Caregiver', CaregiverSchema);
module.exports = Caregiver;