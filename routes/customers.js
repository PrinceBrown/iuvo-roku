const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth')
const usersController = require('../controllers/users')

const Caregiver = require('../models/Caregiver')

router.get('/register', authController.getRegister)

router.post('/customer/register', authController.postRegister)

router.get('/login', authController.getLogin)

router.post('/customer/login', authController.postLogin)

//This route must be removed or the page must be modified
//This route renders caregiver options to customer which shouldnot be there
router.get('/caregiver-profile/:caregiverID', usersController.getCaregiverProfile)

router.get('/user/edit-profile', usersController.getEditCustomerProfile)

router.get('/caregiver-list', usersController.getCaregiverList)

router.get('/blog', (req, res, next) => {
    res.status(200).render('customer/blog')
})

router.get('/blog/blog-content', (req, res, next) => {
    res.status(200).render('customer/blog-content')
})

router.get('/request', (req, res, next) => {
    res.status(200).render('customer/request')
})

router.get('/aboutUs', (req, res, next) => {
    res.status(200).render('customer/about')
})


router.get('/', (req, res, next) => {

    Caregiver.find({}).then(showCaregivers => {
        console.log('Show:', showCaregivers)
        res.status(200).render('customer/index', {
            caregivers: showCaregivers
        })
    }).catch(err => {
        if (err) throw err;
    })
})



module.exports = router;