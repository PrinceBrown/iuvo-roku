const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

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


router.get('/', (req, res, next) => {
    res.render('admin/index', {
        pageTitle: 'IUVO Dashboard',
        path: '/admin/',
        isAuthenticated: req.isLoggedIn
    });
})

router.get('/requests', (req, res, next) => {
    res.render('admin/requests', {
        pageTitle: 'Care Requests',
        path: '/requests/',
        isAuthenticated: req.isLoggedIn
    });
})

//Customers Data Route
router.get('/customers', (req, res, next) => {
    Customer.find({}).then(customers => {
        res.render('admin/customers', {
            pageTitle: 'Customers',
            customers: customers,
            path: '/customers',
            isAuthenticated: req.isLoggedIn
        })
    })

}); //End of route

router.get('/admins', (req, res, next) => {
    Administrator.find({}).then(admins => {
        res.render('admin/admins', {
            pageTitle: 'Moderators',
            admins: admins,
            path: '/admin',
            isAuthenticated: req.isLoggedIn

        })
    })

}); //End of route


//Fetch All Care Givers
router.get('/caregivers', (req, res, next) => {
    Caregiver.find({}).then(caregiver => {
        res.render('admin/caregivers', {
            pageTitle: 'Local Caregivers',
            caregivers: caregiver,
            path: '/caregivers',
            isAuthenticated: req.isLoggedIn
        });

    }).catch(err => {
        if (err) return err;
    });

}) //End of route


router.get('/createUser', (req, res, next) => {

    res.render('admin/createUser', {
        pageTitle: 'Create a user',
        path: '/createUser',
        isAuthenticated: req.isLoggedIn
    });
}) //End of route

router.post('/createUser', (req, res, next) => {
    let profileIMG = req.file;
    console.log(profileIMG);

    if (!profileIMG) {
        res.status(422).render('admin/createUser', {
            pageTitle: 'Create a user',
            path: '/createUser',
            isAuthenticated: req.isLoggedIn

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
        Speciality
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
            profilePicture: imageURL,
            about: about,
            Speciality: Speciality,
            hourRate: hourRate

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


//Single Admin Profile Route

router.get('/adminProfile/:adminID', (req, res, next) => {
    const adminID = req.params.adminID
    Administrator.findById(adminID).then(admin => {
        res.render('admin/adminProfile', {
            pageTitle: 'Admin Profile',
            admin: admin,
            path: '/adminProfile',
            isAuthenticated: req.isLoggedIn
        });

    }).catch(err => {
        if (err) throw err;
    });

});

//Fetch Single Customer
router.get('/profile/:customerID', (req, res, next) => {
    const customerID = req.params.customerID
    Customer.findById(customerID).then(customer => {
        res.render('admin/profile', {
            pageTitle: 'Customer Profile',
            customer: customer,
            path: '/profile',
            isAuthenticated: req.isLoggedIn
        });

    }).catch(err => {
        if (err) throw err;
    });

});

//Fetch Single Caregiver
router.get('/caregiver/:caregiverId', (req, res, next) => {
    const caregiverId = req.params.caregiverId;

    Caregiver.findById(caregiverId).then(caregiver => {
        res.render('admin/nurseProfile', {
            pageTitle: 'Caregiver Profile',
            caregiver: caregiver,
            path: '/caregiver'
        });
    }).catch(err => {
        if (err) throw err;
    });


})


module.exports = router;