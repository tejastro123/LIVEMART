// server/routes/retailers.js
const express = require('express');
const router = express.Router();
const { protect, isCustomer } = require('../middleware/auth');
const User = require('../models/User');
const RetailerReview = require('../models/RetailerReview');
const Order = require('../models/Order');


// @route   GET /api/retailers/:id
// @desc    Get a retailer's public profile
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const retailer = await User.findById(req.params.id).select('name rating numReviews role');
        if (!retailer || retailer.role.trim().toLowerCase() !== 'retailer') {
            return res.status(404).json({ msg: 'Retailer not found' });
        }
        res.json(retailer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/retailers/:id/reviews
// @desc    Get all reviews for a specific retailer
// @access  Public
router.get('/:id/reviews', async (req, res) => {
    try {
        const reviews = await RetailerReview.find({ retailer: req.params.id })
        .populate('customer', 'name')
        .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/retailers/reviews/my-reviewed-orders
// @desc    Get a list of order IDs that the customer has already reviewed
// @access  Private (Customer only)
router.get('/reviews/my-reviewed-orders', [protect, isCustomer], async (req, res) => {
    try {
        // Find all reviews by this customer
        const reviews = await RetailerReview.find({ customer: req.user.id }).select('order');
        // Return just an array of the order IDs
        const reviewedOrderIds = reviews.map(review => review.order.toString());
        res.json(reviewedOrderIds);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/retailers/nearby
// @desc    Get retailers near the logged-in customer
router.get('/nearby', [protect, isCustomer], async (req, res) => {
    try {
        const customerLocation = req.user.location;
        if (!customerLocation || !customerLocation.coordinates) {
            return res.status(400).json({ msg: 'Your location is not set.' });
        }

        // Get distance from query string (in kilometers), default to 10km
        const maxDistanceKm = Number(req.query.distance) || 10;
        const maxDistanceMeters = maxDistanceKm * 1000; // Convert to meters for MongoDB

        const retailers = await User.aggregate([
        {
            $geoNear: {
            near: customerLocation, // The customer's location
            distanceField: "dist.calculated", // Output field with calculated distance in meters
            maxDistance: maxDistanceMeters, // Max distance in meters
            query: { role: 'retailer' }, // Find only documents with role: 'retailer'
            spherical: true // Use spherical geometry for accurate calculations
            }
        },
        {
            $project: { // Only send back the fields we need
            _id: 1,
            name: 1,
            dist: 1
            }
        }
        ]);
        
        res.json(retailers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST /api/retailers/:id/reviews
// @desc    Customer leaves a review for a retailer
// @access  Private (Customer only)
router.post('/:id/reviews', [protect, isCustomer], async (req, res) => {
    const { rating, comment, orderId } = req.body;
    const retailerId = req.params.id;

    try {
        // 1. Check if the customer has a completed order with this retailer
        const order = await Order.findOne({
            _id: orderId,
            user: req.user.id,
            status: 'Delivered', // Only allow reviews for delivered orders
        });
        if (!order) {
            return res.status(400).json({ msg: 'You can only review a retailer after a completed order.' });
        }

        // 2. Check if this order has already been reviewed
        const existingReview = await RetailerReview.findOne({ order: orderId });
        if (existingReview) {
            return res.status(400).json({ msg: 'You have already reviewed this retailer for this order.' });
        }

        // 3. Create the new review
        const review = new RetailerReview({
            customer: req.user.id,
            retailer: retailerId,
            order: orderId,
            rating: Number(rating),
            comment,
        });
        await review.save();

        // 4. Update the retailer's average rating
        const retailer = await User.findById(retailerId);
        const reviews = await RetailerReview.find({ retailer: retailerId });

        retailer.numReviews = reviews.length;
        retailer.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        
        await retailer.save();

        res.status(201).json({ msg: 'Review added successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;