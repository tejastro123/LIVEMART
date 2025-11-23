const express = require('express');
const router = express.Router();
const { protect, isManager } = require('../middleware/auth');
const Bundle = require('../models/Bundle');

// GET all bundles
router.get('/', async (req, res) => {
    const bundles = await Bundle.find().populate('products');
    res.json(bundles);
});

// POST a new bundle (for retailers/wholesalers)
router.post('/', [protect, isManager], async (req, res) => {
    const { name, description, products, imageUrl } = req.body;
    const newBundle = new Bundle({
        name,
        description,
        products,
        imageUrl,
        creator: req.user.id,
    });
    const savedBundle = await newBundle.save();
    res.status(201).json(savedBundle);
});

module.exports = router;