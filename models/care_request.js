const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CareRequestSchema = Schema({
    caregiver: {
        type: Schema.Types.ObjectId,
        ref: 'Caregiver'
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    workHours: {
        type: Number
    },
    subTotal: {
        type: Number
    },
    shift: {
        type: String
    }
})

const Request = mongoose.model('Request', CareRequestSchema);
module.exports = Request;