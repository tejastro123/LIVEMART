const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/auth/google/callback',
                passReqToCallback: true,
            },
            async (req, accessToken, refreshToken, profile, done) => {
                try {
                    const user = await User.findById(req.user.id);
                    if (user) {
                        user.googleId = profile.id;
                        user.googleAccessToken = accessToken;
                        user.googleRefreshToken = refreshToken;
                        await user.save();
                        done(null, user);
                    } else {
                        done(null, false, { message: 'No user logged in to link account.' });
                    }
                } catch (err) {
                    console.error(err);
                    done(err, false);
                }
            }
        )
    );

    passport.use(
        'google-login',
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/auth/google/login/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // 1. Check if user exists by Google ID
                    let user = await User.findOne({ googleId: profile.id });
                    if (user) {
                        return done(null, user);
                    }

                    // 2. Check if user exists by Email
                    user = await User.findOne({ email: profile.emails[0].value });
                    if (user) {
                        // Link Google Account to existing user
                        user.googleId = profile.id;
                        // user.googleAccessToken = accessToken; // Optional: Store tokens if needed
                        // user.googleRefreshToken = refreshToken;
                        await user.save();
                        return done(null, user);
                    }

                    // 3. Create new user
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        role: 'customer',
                        phone: 'N/A', // Placeholder for Google OAuth users, can be updated later
                        // Password is optional for social login users
                        password: require('crypto').randomBytes(16).toString('hex')
                    });
                    return done(null, user);
                } catch (err) {
                    return done(err, false);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
    // -------------------------
};