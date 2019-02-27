const bcrypt = require('bcryptjs')
const Customer = require('../models/Customer')
const Caregiver = require('../models/Caregiver')
const Administrator = require('../models/Admin')

exports.getRegister = (req, res, next) => {
    res.status(200).render('customer/register_login/register')
}

exports.postRegister = (req, res, next) => {

    const {
        firstName,
        lastName,
        email,
        address,
        password,
        confirm_password
    } = req.body;

    if (password !== confirm_password) {
        res.render('/register');
    }

    Customer.findOne({
        email: email
    }).then(user => {
        if (user) {
            console.log('This email is already registered!')
            res.render('/register');
        } else {
            const customer = new Customer({
                firstName: firstName,
                lastName: lastName,
                email: email,
                address: address,
                password: password

            })
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(customer.password, salt, (err, hash) => {
                    customer.password = hash;
                    customer.save().then(newCustomerRegistered => {
                        console.log('Registering New User.....');
                        res.status(302).redirect('/login');
                    }).catch(err => {
                        if (err) throw err;
                    });
                })
            })


        }
    }).catch(err => {
        if (err) throw err
    });
}


exports.getLogin = (req, res, next) => {
    res.status(200).render('customer/register_login/login')
}

exports.postLogin = (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    Customer.findOne({
        email: email
    }).then(customer => {
        if (customer) {
            console.log('Email Exists...')


            bcrypt.compare(password, customer.password).then(user => {
                if (user) {
                    console.log('logging user in...')
                    res.redirect('/')
                } else {
                    console.log('logging Failed...')
                    res.status(302).redirect('/login')

                }

            }).catch(err => {
                if (err) throw err;
            });
        }
    }).catch(err => {
        if (err) throw err;
    });

}


exports.getCaregiverRegister = (req, res, next) => {
    res.status(200).render('caregiver/register_login/register')
}

exports.posCaregiverRegister = (req, res, next) => {

    const {
        firstName,
        lastName,
        email,
        address,
        password,
        confirm_password
    } = req.body;

    if (password !== confirm_password) {
        res.render('/register');
    }

    Caregiver.findOne({
        email: email
    }).then(user => {
        if (user) {
            console.log('This email is already registered!')
            res.render('/register');
        } else {
            const caregiver = new Caregiver({
                firstName: firstName,
                lastName: lastName,
                email: email,
                address: address,
                password: password

            })
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(caregiver.password, salt, (err, hash) => {
                    caregiver.password = hash;
                    caregiver.save().then(newCaregiverRegistered => {
                        console.log('Registering New User.....');
                        res.status(302).redirect('/login');
                    }).catch(err => {
                        if (err) throw err;
                    });
                })
            })


        }
    }).catch(err => {
        if (err) throw err
    });
}


exports.getCaregiverLogin = (req, res, next) => {
    res.status(200).render('caregiver/register_login/login')
}

exports.postCaregiverLogin = (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    Caregiver.findOne({
        email: email
    }).then(caregiver => {
        if (caregiver) {
            console.log('Email Exists...')


            bcrypt.compare(password, caregiver.password).then(user => {
                if (user) {
                    console.log('logging user in...')
                    res.redirect('/')
                } else {
                    console.log('logging Failed...')
                    res.status(302).redirect('/login')

                }

            }).catch(err => {
                if (err) throw err;
            });
        }
    }).catch(err => {
        if (err) throw err;
    });

}

exports.getAdminRegister = (req, res, next) => {
    res.render('Login_register/register', {
        pageTitle: 'Create Account',
        isAuthenticated: req.isLoggedIn
    })
}

exports.postAdminRegister = (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        password
    } = req.body;

    Administrator.findOne(email).then(SysAdmin => {
        if (SysAdmin) {
            //Fail Registration
            res.render('/admin/login')
        } else {
            const admin = new Administrator({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(admin.password, salt, (err, hash) => {
                    admin.password = hash
                    admin.save().then(registeredAdmin => {
                        res.redirect('/admin/login')
                    }).catch(err => {
                        if (err) throw err
                    })
                })
            })

        }

    }).catch(err => {
        if (err) throw err;
    });

}

exports.getAdminLogin = (req, res, next) => {
    res.render('Login_register/login', {
        pageTitle: 'Sign into your account',
        isAuthenticated: req.isLoggedIn
    })
}

exports.postAdminLogin = (req, res, next) => {
    Administrator.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, MatchedUser) => {
                if (MatchedUser) {
                    res.setHeader('Set-Cookie', 'loggedIn=true')
                    res.redirect('/admin');
                } else {
                    res.send('You have entered a wrong email or password');
                }
            });
        }
    }).catch(err => {
        if (err) throw err;
    });

}