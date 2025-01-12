const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8000/api/auth/google/callback",
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        await user.save();
                    }
                    return done(null, user);
                }

                // If user doesn't exist, create new user
                user = await User.create({
                    // googleId: profile.id,
                    email: profile.emails[0].value,
                    firstname: profile.name.givenName || '',
                    lastname: profile.name.familyName || '',
                    // isEmailVerified: true // Since Google has verified the email
                });

                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

module.exports = passport;