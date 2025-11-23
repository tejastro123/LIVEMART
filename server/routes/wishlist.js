const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

/**
 * @route   GET /api/wishlist
 * @desc    Get the logged-in user's wishlist
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist');
        if (!user) {
        return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user.wishlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   POST /api/wishlist/:productId
 * @desc    Add a product to the user's wishlist
 * @access  Private
 */
router.post('/:productId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const productId = req.params.productId;

        // Check if the product is already in the wishlist
        if (user.wishlist.includes(productId)) {
        return res.status(400).json({ msg: 'Product already in wishlist' });
        }

        user.wishlist.push(productId);
        await user.save();
        res.json(user.wishlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   DELETE /api/wishlist/:productId
 * @desc    Remove a product from the user's wishlist
 * @access  Private
 */
router.delete('/:productId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const productId = req.params.productId;

        // Remove the product from the wishlist array
        user.wishlist.pull(productId);
        await user.save();
        res.json(user.wishlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;