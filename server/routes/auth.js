// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model
const rateLimit = require('express-rate-limit');
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const passport = require('passport');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const Joi = require('joi');
const logger = require('../utils/logger');

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('customer', 'retailer', 'wholesaler').default('customer'),
    phone: Joi.string().required(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // Limit each IP to 15 requests per `windowMs`
    message: 'Too many authentication attempts from this IP, please try again after 10 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// @route   GET /api/auth/google/login
// @desc    Initiate Google Login
router.get('/google/login', passport.authenticate('google-login', { scope: ['profile', 'email'] }));

// @route   GET /api/auth/google/login/callback
// @desc    Google login callback
router.get(
    '/google/login/callback',
    passport.authenticate('google-login', { failureRedirect: '/', session: false }),
    (req, res) => {
        // Successful authentication, create a JWT
        const payload = { user: { id: req.user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                // Redirect to a frontend page that saves the token
                res.redirect(`http://localhost:3000/auth/success?token=${token}`);
            }
        );
    }
);
// @route   GET api/auth
// @desc    Get logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        // req.user is attached by the 'protect' middleware
        // console.log(req.user);
        res.json({
            _id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            // The !! operator converts the presence of a token string into a boolean (true/false)
            isGoogleConnected: !!req.user.googleRefreshToken,
            loyaltyPoints: req.user.loyaltyPoints
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth flow
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.events'],
    accessType: 'offline', // Important to get a refresh token
    prompt: 'consent'
}));

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    // Successful authentication, redirect to a profile or settings page.
    res.redirect('http://localhost:3000/google/success');  // Redirect back to your frontend
});

// @route   POST api/auth/register
// @desc    Register a new user
router.post('/register', validate(registerSchema), async (req, res, next) => {
    // console.log('Received registration data:', req.body);
    const { name, email, password, role, phone, latitude, longitude } = req.body;

    try {
        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Check for existing phone number
        // user = await User.findOne({ phone });
        // if (user) {
        //     return res.status(400).json({ msg: 'This phone number is already registered' });
        // }

        // 2. Create a new user instance
        const newUser = { name, email, password, role, phone };
        if (latitude && longitude) {
            newUser.location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        }

        user = new User(newUser);

        // 3. Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 4. Save user to the database
        await user.save();

        // 5. Return a JSON Web Token (JWT)
        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' }, // Token expires in 5 hours
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );
    } catch (err) {
        logger.error(err.message);
        next(err);
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user with password. If customer, trigger 2FA.
router.post('/login', validate(loginSchema), async (req, res, next) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        if (!user.password) {
            return res.status(400).json({ msg: 'This account was created with a social login. Please use Google Login.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        if (user.role === 'retailer' || user.role === 'wholesaler') {
            const payload = { user: { id: user.id } };
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '5h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } else {
            // // --- DIRECT LOGIN FOR TESTING ---
            // const payload = { user: { id: user.id } };
            // jwt.sign(
            //     payload,
            //     process.env.JWT_SECRET,
            //     { expiresIn: '5h' },
            //     (err, token) => {
            //         if (err) throw err;
            //         res.json({ token });
            //     }
            // );

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.phoneOtp = otp;
            user.phoneOtpExpires = Date.now() + 10 * 60 * 1000;
            await user.save();

            try {
                await client.messages.create({
                    body: `Your Live MART verification code is: ${otp}`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: user.phone,
                });
                res.json({ msg: 'OTP has been sent to your registered phone number for verification.' });
            } catch (smsErr) {
                console.error("Twilio Error:", smsErr);
                return res.status(500).json({ msg: 'Failed to send OTP via SMS. Please check your phone number.' });
            }
        }
    } catch (err) {
        logger.error("Login Error: " + err.message);
        next(err);
    }
});

// @route   POST api/auth/verify-2fa
// @desc    Step 2 of 2FA: Verify OTP and return final JWT
router.post('/verify-2fa', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({
            email,
            phoneOtp: otp,
            phoneOtpExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid OTP or OTP has expired.' });
        }

        user.phoneOtp = undefined;
        user.phoneOtpExpires = undefined;
        await user.save();

        // If OTP is valid, create and return the final JWT
        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/generate-otp
// @desc    Generate and send an OTP to the user's phone
// @access  Public
router.post('/generate-otp', async (req, res) => {
    const { phone } = req.body;
    try {
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ msg: 'User with this phone number not found' });
        }

        // --- ROLE CHECK ---
        // Only allow customers to use this feature
        if (user.role !== 'customer') {
            return res.status(403).json({ msg: 'Login with OTP is only available for customers.' });
        }

        // Generate and send the OTP (existing logic)
        // Generate and send the OTP (existing logic)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.phoneOtp = otp;
        user.phoneOtpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        try {
            await client.messages.create({
                body: `Your Live MART login OTP is: ${otp}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phone,
            });
            res.json({ msg: 'OTP sent successfully' });
        } catch (smsErr) {
            console.error("Twilio Error:", smsErr);
            res.status(500).json({ msg: 'Failed to send OTP via SMS.' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and log the user in
// @access  Public
router.post('/verify-otp', async (req, res) => {
    const { phone, otp } = req.body;
    try {
        const user = await User.findOne({
            phone,
            phoneOtp: otp,
            phoneOtpExpires: { $gt: Date.now() } // Check if OTP is not expired
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid OTP or OTP has expired' });
        }

        // Clear the OTP after successful verification
        user.phoneOtp = undefined;
        user.phoneOtpExpires = undefined;
        await user.save();

        // Create and return JWT token
        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;