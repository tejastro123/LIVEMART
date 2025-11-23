// server/routes/wholesaleOrders.js
const express = require('express');
const router = express.Router();
const { protect, isRetailer, isManager } = require('../middleware/auth');
const WholesaleOrder = require('../models/WholesaleOrder');
const Product = require('../models/Product');
const {
    sendWholesaleOrderConfirmation,
    sendWholesaleOrderStatusUpdate
} = require('../utils/smsService');

// @route   POST /api/wholesale-orders
// @desc    A retailer places a new order with a wholesaler
// @access  Private (Retailer only)
// @route   POST /api/wholesale-orders
// @desc    A retailer places a new order with a wholesaler (supports single or bulk)
// @access  Private (Retailer only)
router.post('/', [protect, isRetailer], async (req, res) => {
    // Support both single item (legacy) and bulk items
    let items = [];
    if (req.body.items && Array.isArray(req.body.items)) {
        items = req.body.items;
    } else {
        const { wholesalerId, productId, quantity } = req.body;
        if (wholesalerId && productId && quantity) {
            items = [{ wholesalerId, productId, quantity }];
        }
    }

    if (items.length === 0) {
        return res.status(400).json({ msg: 'No items provided' });
    }

    try {
        const createdOrders = [];

        // Process each item
        for (const item of items) {
            const { wholesalerId, productId, quantity } = item;

            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ msg: `Product not found: ${productId}` });
            }
            // Allow buying from any wholesaler, but validate the product belongs to them if passed
            if (wholesalerId && product.retailer.toString() !== wholesalerId) {
                return res.status(400).json({ msg: `Product ${product.name} does not belong to specified wholesaler` });
            }
            if (product.stock < quantity) {
                return res.status(400).json({ msg: `Not enough stock for ${product.name}` });
            }

            const newOrder = new WholesaleOrder({
                retailer: req.user.id,
                wholesaler: product.retailer, // Use the product's actual owner
                product: productId,
                quantity,
                totalPrice: product.price * quantity,
            });

            const order = await newOrder.save();
            createdOrders.push(order);

            // Optional: Send SMS for each order or a summary (keeping it simple for now)
            // sendWholesaleOrderConfirmation(req.user.phone, order);
        }

        res.status(201).json(createdOrders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/wholesale-orders/my-purchases
// @desc    Get orders placed by the logged-in retailer
// @access  Private (Retailer only)
router.get('/my-purchases', [protect, isRetailer], async (req, res) => {
    try {
        const orders = await WholesaleOrder.find({ retailer: req.user.id })
            .populate('wholesaler', 'name')
            .populate('product', 'name')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/wholesale-orders/my-sales
// @desc    Get orders received by the logged-in wholesaler
// @access  Private (Wholesaler/Manager role)
router.get('/my-sales', [protect, isManager], async (req, res) => {
    try {
        const orders = await WholesaleOrder.find({ wholesaler: req.user.id })
            .populate('retailer', 'name')
            .populate('product', 'name')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/wholesale-orders/:id/status
// @desc    Update a wholesale order's status
// @access  Private (Wholesaler/Manager role)
router.put('/:id/status', [protect, isManager], async (req, res) => {
    try {
        const order = await WholesaleOrder.findById(req.params.id).populate('retailer', 'phone');
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        // Ensure the logged-in user is the wholesaler for this order
        if (order.wholesaler.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        order.status = req.body.status;

        // If order is fulfilled, update the wholesaler's stock
        if (req.body.status === 'Fulfilled') {
            await Product.findByIdAndUpdate(order.product, {
                $inc: { stock: -order.quantity }
            });
        }

        await order.save();

        sendWholesaleOrderStatusUpdate(order.retailer.phone, order);

        res.json(order);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


module.exports = router;