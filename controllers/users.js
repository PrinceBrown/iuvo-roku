const Customer = require('../models/Customer')
const Caregiver = require('../models/Caregiver')
const Administrator = require('../models/Admin')

exports.getCaregiverProfile = (req, res, next) => {
    const caregiverID = req.params.caregiverID;
    Caregiver.findById(caregiverID).then(caregiverProfile => {

        res.status(200).render('customer/caregiver-profile', {
            caregiver: caregiverProfile
        })
    }).catch(err => {
        if (err) throw err;
    })

}

exports.getEditCustomerProfile = (req, res, next) => {
    res.status(200).render('customer/update-profile')
}

exports.getCaregiverList = (req, res, next) => {
    Caregiver.find({}).then(allCaregivers => {

        res.status(200).render('customer/caregiver-list', {
            caregivers: allCaregivers
        })
    }).catch(err => {
        if (err) throw err
    });

}

exports.getCustomerProfile = (req, res, next) => {
    res.status(200).render('caregiver/caregiver-profile')
}
exports.getEditCaregiverProfile = (req, res, next) => {
    res.status(200).render('caregiver/update-profile')
}
exports.getCustomerList = (req, res, next) => {
    res.status(200).render('caregiver/customer-list')
}