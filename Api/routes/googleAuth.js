// routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
    }
));

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.CLIENT_URL}/login`,
        successRedirect: process.env.CLIENT_URL
    })
);

router.get('/auth/user', (req, res) => {
    res.json(req.user || null);
});

router.get('/auth/logout', (req, res) => {
    req.logout(() => {
        res.redirect(process.env.CLIENT_URL);
    });
});

module.exports = router;