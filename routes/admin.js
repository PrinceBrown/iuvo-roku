const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

//Authentication Imports
const isUserAuthenticated = require('../config/ensureIsAuth')

//Model Imports
const Administrator = require('../models/Admin');
const Customer = require('../models/Customer');
const Caregiver = require('../models/Caregiver');

const authController = require('../controllers/auth')


//Routes
router.get('/register', authController.getAdminRegister);

router.post('/register', authController.postAdminRegister);

router.get('/login', authController.getAdminLogin);

router.post('/login', authController.postAdminLogin);


router.get('/', isUserAuthenticated, (req, res, next) => {
    res.render('admin/index', {
        user: req.user,
        pageTitle: 'IUVO Dashboard',
        path: '/admin/',

    });
})

router.get('/requests', isUserAuthenticated, (req, res, next) => {
    res.render('admin/requests', {
        user: req.user,
        pageTitle: 'Care Requests',
        path: '/requests/',

    });
})

//Customers Data Route
router.get('/customers', isUserAuthenticated, (req, res, next) => {
    Customer.find({}).then(customers => {
        res.render('admin/customers', {
            user: req.user,
            pageTitle: 'Customers',
            customers: customers,
            path: '/customers',

        })
    })

}); //End of route

router.get('/history', isUserAuthenticated, (req, res, next) => {
    Customer.find({}).then(customers => {
        res.render('admin/sales_history', {
            user: req.user,
            pageTitle: 'Sales History',
            customers: customers,
            path: '/customers',

        })
    })

}); //End of route

router.get('/admins', isUserAuthenticated, (req, res, next) => {
    Administrator.find({}).then(admins => {
        res.render('admin/admins', {
            user: req.user,
            pageTitle: 'Moderators',
            admins: admins,
            path: '/admin',


        })
    })

}); //End of route


//Fetch All Care Givers
router.get('/caregivers', isUserAuthenticated, (req, res, next) => {
    Caregiver.find({}).then(caregiver => {
        res.render('admin/caregivers', {
            user: req.user,
            pageTitle: 'Local Caregivers',
            caregivers: caregiver,
            path: '/caregivers',
            isAuthenticated: req.isLoggedIn
        });

    }).catch(err => {
        if (err) return err;
    });

}) //End of route


router.get('/createUser', isUserAuthenticated, (req, res, next) => {

    res.render('admin/createUser', {
        user: req.user,
        pageTitle: 'Create a user',
        path: '/createUser',
        isAuthenticated: req.isLoggedIn
    });
}) //End of route

router.post('/createUser', isUserAuthenticated, (req, res, next) => {
    let profileIMG = req.file;

    if (!profileIMG) {
        res.status(422).render('admin/createUser', {
            user: req.user,
            pageTitle: 'Create a user',
            path: '/createUser',

        })
    }

    const imageURL = profileIMG.path

    const {
        username,
        firstName,
        lastName,
        email,
        password,
        address,
        userType,
        ExperienceYears,
        hourRate,
        about,
        service,
        dailyShiftHours,
        availability
    } = req.body;

    if (userType == 'Admin') {

        const newAdmin = new Administrator({
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            address: address,
            userType: userType,
            profilePicture: imageURL,
            about: about
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                newAdmin.password = hash;
                newAdmin.save().then(registeredAdmin => {
                    res.redirect('/admin/admins');
                }).catch(err => {
                    if (err) throw err;
                });
            });
        });

    } else if (userType == 'Customer') {

        const newCustomer = new Customer({
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            address: address,
            userType: userType,
            profilePicture: imageURL,
            about: about,
            ExperienceYears: ExperienceYears
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newCustomer.password, salt, (err, hash) => {
                newCustomer.password = hash;
                newCustomer.save().then(registeredCustomer => {
                    const NewCustomer = registeredCustomer
                    res.redirect('/admin/customers');
                }).catch(err => {
                    if (err) throw err;
                });
            });
        });

    } else if (userType == 'Caregiver') {

        const newCaregiver = new Caregiver({
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            address: address,
            userType: userType,
            ExperienceYears: ExperienceYears,
            profilePicture: imageURL,
            about: about,
            service: service,
            availability: availability,
            hourRate: hourRate,
            dailyShiftHours: dailyShiftHours


        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newCaregiver.password, salt, (err, hash) => {
                newCaregiver.password = hash;
                newCaregiver.save().then(registeredCaregiver => {
                    res.redirect('/admin/caregivers');
                }).catch(err => {
                    if (err) throw err;
                });
            });
        });


    } else {
        //Handle Form Submission With No Database Collection
        const userTypeErrorMsg = 'Choose the type of user you\'d like to create';
        res.render('/admin/createUser', {
            isAuthenticated: req.isLoggedIn
        });
    }

}) //End of route


//Fetch my Account
router.get('/profile/', isUserAuthenticated, (req, res, next) => {

    Administrator.findOne({
        id: req.user._id
    }).then(admin => {
        res.render('admin/myAccount', {
            user: req.user,
            pageTitle: 'My Account',
            admin: req.user,
            path: '/profile',

        });

    }).catch(err => {
        if (err) throw err;
    });

});

//Single Admin Profile Route

router.get('/adminProfile/:adminID', isUserAuthenticated, (req, res, next) => {
    const adminID = req.params.adminID
    Administrator.findById(adminID).then(admin => {
        res.render('admin/adminProfile', {
            user: req.user,
            pageTitle: 'Admin Profile',
            admin: admin,
            path: '/adminProfile/:adminID',

        });

    }).catch(err => {
        if (err) throw err;
    });

});



//Fetch Single Caregiver
router.get('/caregiver/:caregiverId', isUserAuthenticated, (req, res, next) => {
    const caregiverId = req.params.caregiverId;

    Caregiver.findById(caregiverId).then(caregiver => {
        res.render('admin/nurseProfile', {
            user: req.user,
            pageTitle: 'Caregiver Profile',
            caregiver: caregiver,
            path: '/caregiver'
        });
    }).catch(err => {
        if (err) throw err;
    });


})

//Fetch Single Customer
router.get('/profile/:customerID', isUserAuthenticated, (req, res, next) => {
    const customerID = req.params.customerID
    Customer.findById(customerID).then(customer => {
        res.render('admin/profile', {
            user: req.user,
            pageTitle: 'Customer Profile',
            customer: customer,
            path: '/profile/:customerI',

        });

    }).catch(err => {
        if (err) throw err;
    });

});



module.exports = router;