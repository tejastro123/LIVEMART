// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes by verifying token
exports.protect = async (req, res, next) => {
    let token;
    if (req.header('x-auth-token')) {
        token = req.header('x-auth-token');
    }

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.user.id).select('-password');
        req.login(req.user, (err) => {
        if (err) return next(err);
            next();
        });
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

    // Middleware to check for retailer role
exports.isRetailer = (req, res, next) => {
    if (req.user && req.user.role === 'retailer') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Retailer role required.' });
    }
};

exports.isManager = (req, res, next) => {
    if (req.user && (req.user.role === 'retailer' || req.user.role === 'wholesaler')) {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Manager role required.' });
    }
};

exports.isCustomer = (req, res, next) => {
    if (req.user && req.user.role === 'customer') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Customer role required.' });
    }
};