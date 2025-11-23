// server/routes/queries.js
const express = require('express');
const router = express.Router();
const { protect, isCustomer, isRetailer } = require('../middleware/auth');
const Query = require('../models/Query');
const User = require('../models/User');

// @route   POST /api/queries
// @desc    Customer creates a new query for a retailer
router.post('/', [protect, isCustomer], async (req, res) => {
    const { retailerId, subject, message } = req.body;
    const initialMessage = {
        sender: req.user.id,
        senderName: req.user.name,
        text: message,
    };
    const newQuery = new Query({
        customer: req.user.id,
        retailer: retailerId,
        subject,
        messages: [initialMessage],
    });
    try {
        const savedQuery = await newQuery.save();
        res.status(201).json(savedQuery);
    } catch (err) { res.status(500).send('Server Error'); }
});

// @route   GET /api/queries/my-queries
// @desc    Customer gets their own queries
router.get('/my-queries', [protect, isCustomer], async (req, res) => {
    try {
        const queries = await Query.find({ customer: req.user.id }).populate('retailer', 'name').sort({ createdAt: -1 });
        res.json(queries);
    } catch (err) { res.status(500).send('Server Error'); }
});

// @route   GET /api/queries/received-queries
// @desc    Retailer gets queries directed at them
router.get('/received-queries', [protect, isRetailer], async (req, res) => {
    try {
        const queries = await Query.find({ retailer: req.user.id }).populate('customer', 'name').sort({ createdAt: -1 });
        res.json(queries);
    } catch (err) { res.status(500).send('Server Error'); }
});

// @route   POST /api/queries/:id/reply
// @desc    User (customer or retailer) replies to a query
router.post('/:id/reply', protect, async (req, res) => {
    try {
        const query = await Query.findById(req.params.id);
        if (!query) return res.status(404).json({ msg: 'Query not found' });

        // Security check: ensure user is part of the query
        if (query.customer.toString() !== req.user.id && query.retailer.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const newMessage = {
            sender: req.user.id,
            senderName: req.user.name,
            text: req.body.message,
        };
        query.messages.push(newMessage);
    
        // If a retailer replies, mark it as 'Answered'
        if (req.user.role === 'retailer') {
            query.status = 'Answered';
        } else {
            query.status = 'Open';
        }

        await query.save();
        res.json(query);
    } catch (err) { res.status(500).send('Server Error'); }
});

// @route   GET /api/queries/retailers
// @desc    Get a list of all retailers for the contact form
router.get('/retailers', protect, async (req, res) => {
    try {
        const retailers = await User.find({ role: 'retailer' }).select('name _id');
        res.json(retailers);
    } catch (err) { res.status(500).send('Server Error'); }
});

// @route   PUT /api/queries/:id/status
// @desc    Update a query's status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
    try {
        const query = await Query.findById(req.params.id);
        if (!query) return res.status(404).json({ msg: 'Query not found' });

        // Security check: ensure user is part of the query
        if (query.customer.toString() !== req.user.id && query.retailer.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
        }
        
        query.status = req.body.status;
        await query.save();
        res.json(query);
    } catch (err) { res.status(500).send('Server Error'); }
});


module.exports = router;