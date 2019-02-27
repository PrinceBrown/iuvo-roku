const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const authController = require('../controllers/auth')
const userController = require('../controllers/users')



router.get('/myAccount', (req, res, next) => {
    res.status(200).render('caregiver/profile')
})

router.get('/caregiver/register', authController.getCaregiverRegister)

router.post('/caregiver/register', authController.posCaregiverRegister)

router.get('/login', authController.getCaregiverLogin)

router.post('/caregiver/login', authController.postCaregiverLogin)

router.get('/customer-profile', userController.getCustomerProfile)

router.get('/caregiver/edit-profile', userController.getEditCaregiverProfile)

router.get('/customer-list', userController.getCustomerList)

router.get('/blog', (req, res, next) => {
    res.status(200).render('caregiver/blog')
})

router.get('/blog/blog-content', (req, res, next) => {
    res.status(200).render('caregiver/blog-content')
})

router.get('/request', (req, res, next) => {
    res.status(200).render('caregiver/request')
})

router.get('/aboutUs', (req, res, next) => {
    res.status(200).render('caregiver/about')
})

router.get('/', (req, res, next) => {
    res.status(200).render('caregiver/index')
})




module.exports = router;