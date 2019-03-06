const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const cookieSession = require('cookie-session')

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')

const KEYS = require('./config/KEYS')

const Admin = require('./models/Admin')


//PASPORT AUTH
const adminAuth = require('./Services/adminOAuth')



//Router Imports
const AdminRoute = require('./routes/admin')
const CustomerRoute = require('./routes/customers')
const CaregiverRoute = require('./routes/caregiver')

mongoose.Promise = global.Promise;

//Body Parser
app.use(express.urlencoded({
    extended: true
}))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

app.use(multer({
    storage: storage,
    fileFilter: fileFilter

}).single('profilePicture'))

//Static Paths
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public/login_register')))
app.use(express.static(path.join(__dirname, 'public/adminAssets')))
app.use(express.static(path.join(__dirname, 'public/customerAssets')))
app.use('/public/uploads/', express.static(path.join(__dirname, '/public/uploads/')))

//Database connection

mongoose.connect(KEYS.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', (err) => {
    if (err) throw err;
});

db.once('open', () => {
    console.log('Database is connected');
})

//EJS - Template Engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//PASSPORT OAUTH && ENDPOT PROTECTION
app.use(adminAuth);


app.get('/api/admin/', (req, res, next) => {
    res.send(req.user)
})


//Admin Routes
app.use('/admin', AdminRoute);

//Customer Routes
app.use(CustomerRoute);

//Caregiver Routes
app.use(CaregiverRoute);

//Default 404
app.use((req, res, next) => {
    res.send('404');
})



//Server
const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})