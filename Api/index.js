require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const userRoutes = require('./routes/user');
const verificationRoutes = require('./routes/verify')
const linkedinRoutes = require('./routes/linkedinAuth')

//Load env variables
const mongo_URI = process.env.MONGO_URI;
const origin = process.env.REQ_ORIGIN || 'http://localhost:3000';

//DB Connection
mongoose.connect(mongo_URI)
    .then(() => {
        console.log("DB CONNECTED");
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();

//Middleware
app.use(cors({ credentials: true, origin: origin }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

//Routes
app.use('/users', userRoutes);

app.use('/verify', verificationRoutes);

app.use('/linkedin', linkedinRoutes);

app.use('/', (req, res) => {
    res.send('User Auth system');
})

const port = process.env.port || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})