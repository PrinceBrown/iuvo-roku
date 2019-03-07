const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth')
const usersController = require('../controllers/users')

const Caregiver = require('../models/Caregiver')
const CareRequest = require('../models/care_request')

//Authentication Imports
const isUserAuthenticated = require('../config/ensureIsAuth')



router.get('/register', authController.getRegister)

router.post('/customer/register', authController.postRegister)

router.get('/login', authController.getLogin)

router.post('/customer/login', authController.postLogin)


router.use(isUserAuthenticated, function (req, res, next) {
    if (req.user.userType === 'Admin' || req.user.userType === 'customer') {
        console.log('Customer here');
        return next();
    } else {
        return res.redirect('/');
    }
})

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
    const userId = req.user.id;
    console.log(userId)
    CareRequest.find({
            customer: userId
        }).select('caregiver workHours subTotal shift')
        .populate('caregiver')
        .populate('customer')
        .then(careRequestOrderList => {
            if (careRequestOrderList) {
                console.log(careRequestOrderList)
                //User was found and there was an order made
                res.status(200).render('customer/request', {
                    cart: careRequestOrderList
                })
            } else {
                //The user Id was invalid
                //Return to home

                res.status(302).redirect('/')
            }
        }).catch(err => {
            if (err) throw err;
        })

})

router.post('/request-care/:caregiverID', (req, res, next) => {
    const requestId = req.params.caregiverID;
    const {
        hoursOfCare
    } = req.body;

    Caregiver.findById(requestId).then(caregiver_exists => {

        if (caregiver_exists) {

            //Create new order
            const careRequest = new CareRequest({
                caregiver: requestId,
                customer: req.user,
                workHours: hoursOfCare,
                subTotal: caregiver_exists.hourRate * hoursOfCare
            })
            careRequest.save().then(careOrderSuccess => {
                console.log('Added to request cart')
                res.status(302).redirect('/request')
            }).catch(err => {
                if (err) throw err;
            })
        } else {
            //Caregiver doesn't exists
            //Go back to caregiver list page
            return res.redirect('/caregiver-list')
        }
    }).catch(err => {
        if (err) throw err;
    })

})

router.get('/aboutUs', (req, res, next) => {
    res.status(200).render('customer/about')
})


router.get('/', (req, res, next) => {

    Caregiver.find({}).then(showCaregivers => {
        CareRequest.find({
                customer: req.user.id
            })
            .select('caregiver, customer, workHours, subTotal')
            .populate('caregiver', 'firstName hourRate service profilePicture about')
            .populate('customer', 'firstName about')
            .then(orders => {
                console.log()
                res.status(200).render('customer/index', {
                    caregivers: showCaregivers,
                    pendingRequest: orders.length
                })
            }).catch(err => {
                if (err) throw err;
            })
    }).catch(err => {
        if (err) throw err;
    })
})



module.exports = router;