const express = require('express');
const cookieSession = require('cookie-session')

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const KEYS = require('../config/KEYS')

const Admin = require('../models/Admin')
const Customer = require('../models/Customer')


const router = express.Router();

router.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [KEYS.COOKIE_KEY]
}))



router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    Admin.findById(id).then(user => {
        done(null, user)
    }).catch(err => {
        if (err) throw err;
    })
})



//CUSTOMER GOOGLE AUTH

passport.use('google-alt', new GoogleStrategy({
    clientID: KEYS.GOOGLE_CLIENT_ID,
    clientSecret: KEYS.GOOGLE_CLIENT_SECRET,
    callbackURL: "/customer/auth/google/redirect"
}, (accessToken, refreshToken, profile, done) => {
    Customer.findOne({
        googleId: profile.id
    }).then(user => {
        if (user) {
            //User Exists
            done(null, user)
        } else {
            const user = new Customer({
                username: profile.displayName,
                googleId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value
            })
            user.save().then(user => {
                console.log('New Customer registerd succesfully');
                done(null, user)
            }).catch(err => {
                if (err) throw err;
            })
        }
    }).catch(err => {
        if (err) throw err;
    })
}));



router.get('/customer/auth/google', passport.authenticate('google-alt', {
    scope: ['profile', 'email']
}))


router.get('/customer/auth/google/redirect', passport.authenticate('google-alt'),
    (req, res, next) => {
        console.log(req.user)
        res.redirect('/')
    })


router.get('/customer/logout', (req, res, next) => {
    req.logOut();
    console.log('You logged out!')
    res.send('Logout Successful')
})



//ADMIN GOOGLE AUTH


passport.use('google', new GoogleStrategy({
    clientID: KEYS.GOOGLE_CLIENT_ID,
    clientSecret: KEYS.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    Admin.findOne({
        googleId: profile.id
    }).then(user => {
        if (user) {
            //User Exists
            done(null, user)
        } else {
            const user = new Admin({
                username: profile.displayName,
                googleId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value
            })
            user.save().then(user => {
                console.log('New Admin user registerd succesfully');
                done(null, user)
            }).catch(err => {
                if (err) throw err;
            })
        }
    }).catch(err => {
        if (err) throw err;
    })
}));




router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))


router.get('/auth/google/callback', passport.authenticate('google'),
    (req, res, next) => {
        console.log('Admin Route: ', req.user)
        res.redirect('/admin')
    })


router.get('/admin/logout', (req, res, next) => {
    req.logOut();
    console.log('You logged out!')
    res.send('Logout Successful')
})

router.get('/admin/user', (req, res, next) => {
    res.send(req.user)
})

router.get('/customer/user', (req, res, next) => {
    res.send(req.user)
})



module.exports = router;