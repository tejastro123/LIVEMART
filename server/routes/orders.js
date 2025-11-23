// server/routes/orders.js
const express = require('express');
const router = express.Router();
// const { protect } = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, isRetailer } = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

const { createCalendarEvent } = require('../utils/calendarService');

const {
  sendCustomerOrderConfirmation,
  sendRetailerNewOrderAlert,
  sendOrderStatusUpdate
} = require('../utils/smsService');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', protect, async (req, res) => {
  const { orderItems, shippingAddress, totalAmount, paymentMethod, pointsToRedeem } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ msg: 'No order items' });
    }

    // Update stock for each product
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ msg: `Product not found: ${item.name}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ msg: `Not enough stock for ${product.name}. Only ${product.stock} available.` });
      }
    }

    console.log(`--- Points Calculation for ${user.email} ---`);
    console.log('Points before purchase:', user.loyaltyPoints);
    console.log('Points to redeem from request:', pointsToRedeem);

    let finalAmount = totalAmount;
    let redeemedPointsValue = 0;
    if (pointsToRedeem && pointsToRedeem > 0) {
      if (user.loyaltyPoints < pointsToRedeem) {
        return res.status(400).json({ msg: 'Not enough loyalty points.' });
      }
      // Calculate the discount value (e.g., 10 points = $1)
      redeemedPointsValue = pointsToRedeem / 10;
      finalAmount = totalAmount - redeemedPointsValue;
      if (finalAmount < 0) finalAmount = 0; // Ensure total doesn't go below zero
      user.loyaltyPoints -= pointsToRedeem;
    }

    // Award points based on the final amount paid (e.g., 1 point per $10)
    const pointsEarned = Math.floor(finalAmount / 10);
    user.loyaltyPoints += pointsEarned;

    console.log('Points earned this purchase:', pointsEarned);
    console.log('Points after purchase:', user.loyaltyPoints);
    console.log('------------------------------------------');

    await user.save();
    // Create the order
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      totalAmount: finalAmount,
      paymentMethod,
      pointsRedeemed: pointsToRedeem || 0,
      status: paymentMethod === 'Online' ? 'Processing' : 'Pending',
    });

    // If validation passes, then update the stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const createdOrder = await order.save();
    const fullOrder = await Order.findById(createdOrder._id)
      .populate('user', 'name phone')
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'retailer' // We only need the retailer field from the product
      });

    if (fullOrder.user.phone) {
      sendCustomerOrderConfirmation(fullOrder.user.phone, fullOrder);
    }

    // If the user has connected Google, create a calendar event
    if (fullOrder.user.googleRefreshToken) {
      createCalendarEvent(fullOrder.user, fullOrder);
    }

    const retailerIds = [...new Set(fullOrder.items.map(item => item.product.retailer.toString()))];
    const retailers = await User.find({ '_id': { $in: retailerIds } }).select('phone');

    retailers.forEach(retailer => {
      if (retailer.phone) {
        sendRetailerNewOrderAlert(retailer.phone, fullOrder);
      }
    });

    res.status(201).json(createdOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get orders for logged-in user
// @access  Private
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/orders/sales
// @desc    Get all order items sold by the logged-in retailer
// @access  Private (Retailer only)
router.get('/sales', [protect, isRetailer], async (req, res) => {
  try {
    // Step 1: Get an array of product IDs that belong to the logged-in retailer.
    const retailerProductIds = (await Product.find({ retailer: req.user.id }).select('_id')).map(p => p._id);

    // Step 2: Find all orders that contain at least one product from this retailer.
    const orders = await Order.find({ 'items.product': { $in: retailerProductIds } })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    if (!orders) {
      return res.json([]);
    }

    // Step 3: For each order, filter its items list to only include this retailer's products.
    const sales = orders.map(order => {
      const retailerItems = order.items.filter(item =>
        retailerProductIds.some(pId => pId.equals(item.product))
      );

      return {
        _id: order._id,
        user: order.user,
        shippingAddress: order.shippingAddress,
        status: order.status,
        createdAt: order.createdAt,
        items: retailerItems, // Return the filtered list of items
        // Calculate a subtotal for just the items in this order sold by this retailer
        subTotal: retailerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
      };
    }).filter(order => order.items.length > 0); // Ensure we don't return orders with no relevant items

    res.json(sales);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Retailer only)
router.put('/:id/status', [protect, isRetailer], async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'email phone');
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    // A check to ensure the retailer has a product in this order could be added here for extra security

    order.status = req.body.status;
    const updatedOrder = await order.save();

    // --- EMIT REAL-TIME EVENT ---
    // The 'io' instance is available via req.io from our middleware
    const customerId = order.user._id.toString();
    req.io.to(customerId).emit('orderStatusUpdate', updatedOrder);
    // ----------------------------

    sendOrderStatusUpdate(updatedOrder.user.phone, updatedOrder);
    res.json(updatedOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/orders/create-payment-intent
// @desc    Create a stripe payment intent
// @access  Private
router.post('/create-payment-intent', protect, async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Amount in cents
      currency: 'usd', // Change to your currency
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;