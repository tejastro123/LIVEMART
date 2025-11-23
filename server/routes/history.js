const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const BrowsingHistory = require('../models/BrowsingHistory');

/**
 * @route   POST /api/history/viewed/:productId
 * @desc    Log that a user has viewed a product
 * @access  Private
 */
router.post('/viewed/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        // Use 'upsert' to either create a new history entry or update the timestamp of an existing one
        await BrowsingHistory.findOneAndUpdate(
        { user: userId, product: productId },
        { $set: { updatedAt: new Date() } }, // Update the timestamp
        { upsert: true, new: true } // 'upsert: true' creates it if it doesn't exist
        );

        res.status(200).json({ msg: 'View logged' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;