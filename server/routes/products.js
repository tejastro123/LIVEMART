// server/routes/products.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { protect, isManager, isRetailer, isCustomer } = require('../middleware/auth');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const BrowsingHistory = require('../models/BrowsingHistory');

// @route   POST api/products
// @desc    Create a new product
// @access  Private (Retailer only)
router.post('/', [protect, isManager], async (req, res) => {
    const { name, description, category, price, stock } = req.body;
    try {
        const newProduct = new Product({
            name,
            description,
            category,
            price,
            stock,
            retailer: req.user.id, // Assign the logged-in retailer
        });

        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, inStock, retailerId, sort } = req.query;
        let query = {};
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 12; // 12 products per page
        const skip = (page - 1) * limit;

        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };
        if (retailerId) query.retailer = retailerId;
        if (inStock === 'true') query.stock = { $gt: 0 };

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let sortOption = {};
        if (sort === 'price-asc') sortOption = { price: 1 };
        else if (sort === 'price-desc') sortOption = { price: -1 };
        else if (sort === 'rating') sortOption = { rating: -1 };
        else if (sort === 'newest') sortOption = { createdAt: -1 };
        else sortOption = { createdAt: -1 }; // Default to newest

        // const products = await Product.find(query).populate('retailer', 'name');
        const products = await Product.find(query).sort(sortOption).limit(limit).skip(skip);
        const totalProducts = await Product.countDocuments(query);

        res.json({ products, page, pages: Math.ceil(totalProducts / limit) });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/products/categories
// @desc    Get all unique product categories
// @access  Public
router.get('/categories', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json(categories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/products/deals
// @desc    Get all products that are currently on sale
// @access  Public
router.get('/deals', async (req, res) => {
    try {
        const deals = await Product.find({ isOnSale: true }).limit(10); // Limit to 10 for the homepage carousel
        res.json(deals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/products/flash-sale
// @desc    Get all products currently in a flash sale
// @access  Public
router.get('/flash-sale', async (req, res) => {
    try {
        const now = new Date();
        // Find products where the flash sale expiration is in the future
        const flashSaleProducts = await Product.find({
            flashSaleExpires: { $gt: now },
        }).limit(5); // Limit to 5 for the homepage
        res.json(flashSaleProducts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   GET /api/products/compare
 * @desc    Get structured data for product comparison with enhanced details
 * @access  Public
 */
router.get('/compare', async (req, res) => {
    try {
        if (!req.query.ids) {
            return res.status(400).json({ msg: 'Product IDs are required.' });
        }
        const ids = req.query.ids.split(',');
        const products = await Product.find({ '_id': { $in: ids } }).populate('retailer', 'name');

        if (products.length === 0) {
            return res.status(404).json({ msg: 'No products found with the provided IDs.' });
        }

        // --- ENHANCED LOGIC ---
        // Collect all possible attributes from all products
        const allAttributes = new Set([
            'Name',
            'Price',
            'Rating',
            'Stock',
            'Category',
            'Description',
            'Retailer',
            'Reviews'
        ]);

        // Add any additional custom attributes that might exist
        products.forEach(p => {
            // You can add more dynamic attributes here if products have custom fields
            if (p.brand) allAttributes.add('Brand');
            if (p.weight) allAttributes.add('Weight');
            if (p.dimensions) allAttributes.add('Dimensions');
        });

        const comparisonRows = Array.from(allAttributes).map(attr => {
            const row = {
                feature: attr,
                values: {},
            };

            products.forEach(p => {
                let value = 'N/A';
                const lowerAttr = attr.toLowerCase();

                if (lowerAttr === 'name') {
                    value = p.name || 'N/A';
                } else if (lowerAttr === 'price') {
                    value = `$${p.price?.toFixed(2) || 'N/A'}`;
                } else if (lowerAttr === 'rating') {
                    value = p.rating ? `${p.rating.toFixed(1)} / 5` : 'No ratings';
                } else if (lowerAttr === 'stock') {
                    value = p.stock > 0 ? 'In Stock' : 'Out of Stock';
                } else if (lowerAttr === 'category') {
                    value = p.category || 'Uncategorized';
                } else if (lowerAttr === 'description') {
                    value = p.description ? (p.description.substring(0, 100) + '...') : 'No description';
                } else if (lowerAttr === 'retailer') {
                    value = p.retailer?.name || 'Unknown';
                } else if (lowerAttr === 'reviews') {
                    value = `${p.numReviews || 0} reviews`;
                } else if (p[lowerAttr]) {
                    value = p[lowerAttr];
                }

                row.values[p._id.toString()] = value;
            });

            // Determine if values are different across products
            const allValues = Object.values(row.values);
            row.isDifferent = new Set(allValues).size > 1;

            return row;
        });

        // Return enhanced product data with image URLs
        const enhancedProducts = products.map(p => ({
            _id: p._id,
            name: p.name,
            price: p.price,
            rating: p.rating,
            stock: p.stock,
            category: p.category,
            imageUrl: p.imageUrl,
            retailer: p.retailer,
            numReviews: p.numReviews || 0,
        }));

        // Return the correct object structure
        res.json({
            products: enhancedProducts,
            rows: comparisonRows
        });

    } catch (err) {
        console.error('Comparison API error:', err.message);
        res.status(500).json({ msg: 'Server error while fetching comparison data.' });
    }
});

// @route   GET api/products/myproducts
// @desc    Get all products for the logged-in retailer/wholesaler
// @access  Private (Manager role)
router.get('/myproducts', [protect, isManager], async (req, res) => {
    try {
        // req.user.id comes from the 'protect' middleware
        const products = await Product.find({ retailer: req.user.id });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// server/routes/products.js
// @route   GET /api/products/wholesale
// @desc    Get all products from wholesalers
// @access  Private (Retailer only)
router.get('/wholesale', [protect, isManager], async (req, res) => {
    try {
        // Step 1: Find all users with the 'wholesaler' role to get their IDs.
        const wholesalers = await User.find({ role: 'wholesaler' }).select('_id');
        const wholesalerIds = wholesalers.map(w => w._id);

        // Step 2: Find all products where the 'retailer' field (the owner) is in our list of wholesaler IDs.
        const products = await Product.find({ retailer: { $in: wholesalerIds } })
            .populate('retailer', 'name'); // We still populate to get the wholesaler's name.

        res.json(products);
    } catch (err) {
        console.error(err.message); // Log the actual error to the server console
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/products/nearby
// @desc    Get products from retailers near the logged-in customer or provided location
// @access  Public
router.get('/nearby', async (req, res) => {
    try {
        let customerLocation = req.user?.location;

        // If no user location, try query params
        if (!customerLocation && req.query.lat && req.query.lng) {
            customerLocation = {
                type: 'Point',
                coordinates: [Number(req.query.lng), Number(req.query.lat)]
            };
        }

        if (!customerLocation || !customerLocation.coordinates) {
            // Fallback for demo purposes if no location provided
            // return res.status(400).json({ msg: 'Location required. Please login or provide lat/lng.' });
            customerLocation = { type: 'Point', coordinates: [-74.006, 40.7128] }; // Default to NYC for demo
        }

        const maxDistanceKm = Number(req.query.distance) || 10;
        const maxDistanceMeters = maxDistanceKm * 1000;

        // Use an aggregation pipeline to find nearby retailers and then their products
        const products = await User.aggregate([
            // Stage 1: Find retailers near the customer
            {
                $geoNear: {
                    near: customerLocation,
                    distanceField: "distance",
                    maxDistance: maxDistanceMeters,
                    query: { role: 'retailer' },
                    spherical: true,
                }
            },
            // Stage 2: Join with the products collection
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: 'retailer',
                    as: 'items'
                }
            },
            // Stage 3: De-structure the items array
            { $unwind: '$items' },
            // Stage 4: Shape the final output
            {
                $project: {
                    _id: '$items._id',
                    name: '$items.name',
                    imageUrl: '$items.imageUrl',
                    price: '$items.price',
                    stock: '$items.stock',
                    category: '$items.category',
                    retailer: {
                        _id: '$_id',
                        name: '$name',
                        distance: '$distance'
                    }
                }
            }
        ]);

        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   GET /api/products/search-suggestions
 * @desc    Get product name suggestions based on a query string
 * @access  Public
 */
router.get('/search-suggestions', async (req, res) => {
    try {
        const query = req.query.q || ''; // Get the search query from 'q' parameter

        if (!query) {
            return res.json([]); // Return empty array if no query
        }

        // Use $regex for partial, case-insensitive matching
        const suggestions = await Product.find({
            name: { $regex: query, $options: 'i' } // 'i' for case-insensitive
        })
            .limit(5) // Limit to 5 suggestions
            .select('name'); // Only return the product names

        res.json(suggestions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/products/:id
// @desc    Get a single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('retailer', 'name');
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/products/:id/recommendations
// @desc    Get product recommendations based on purchase history
// @access  Public
router.get('/:id/recommendations', async (req, res) => {
    try {
        const productId = req.params.id;

        // Add a check to ensure the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ msg: 'Invalid Product ID format' });
        }

        // Find orders that contain the product
        const ordersWithProduct = await Order.find({ 'items.product': new mongoose.Types.ObjectId(productId) }).select('_id');
        const orderIds = ordersWithProduct.map(o => o._id);

        // Find all products that were purchased in those same orders, excluding the original product
        const recommendations = await Order.aggregate([
            { $match: { _id: { $in: orderIds } } },
            { $unwind: '$items' },
            { $match: { 'items.product': { $ne: new mongoose.Types.ObjectId(productId) } } },
            { $group: { _id: '$items.product', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 4 },
            { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'productDetails' } },
            { $unwind: '$productDetails' },
            { $replaceRoot: { newRoot: '$productDetails' } }
        ]);

        res.json(recommendations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/recommendations/for-you', protect, async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Get all data sources
        const wishlist = req.user.wishlist || []; // Assumes wishlist is populated on req.user or get it from User model
        const history = await BrowsingHistory.find({ user: userId }).select('product');
        const orders = await Order.find({ user: userId }).select('items.product');

        // 2. Aggregate all product IDs
        let allProductIds = wishlist.map(p => p.toString());
        allProductIds = allProductIds.concat(history.map(h => h.product.toString()));
        orders.forEach(order => {
            allProductIds = allProductIds.concat(order.items.map(item => item.product.toString()));
        });

        // 3. Find the most frequent categories from these products
        const productDetails = await Product.find({ _id: { $in: allProductIds } }).select('category');
        const categoryCounts = productDetails.reduce((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
        }, {});

        // Sort categories by frequency
        const sortedCategories = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a]);
        const topCategory = sortedCategories[0];

        // 4. Fetch top 10 products from the user's favorite category
        //    that they haven't already interacted with (purchased, wishlisted, etc.)
        if (!topCategory) {
            return res.json([]); // Return empty if no history
        }

        const recommendations = await Product.find({
            category: topCategory,
            _id: { $nin: allProductIds } // Exclude products the user already knows about
        }).limit(10);

        res.json(recommendations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private (Retailer/Wholesaler)
router.put('/:id', [protect, isManager], async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        // Ensure the user owns the product
        if (product.retailer.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        product = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private (Retailer/Wholesaler)
router.delete('/:id', [protect, isManager], async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        // Ensure the user owns the product
        if (product.retailer.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/products/:id/reviews
// @desc    Create a new product review
// @access  Private (Customer only)
router.post('/:id/reviews', [protect, isCustomer], async (req, res) => {
    const { rating, comment, imageUrl } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                r => r.user.toString() === req.user.id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ msg: 'You have already reviewed this product' });
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                imageUrl,
                user: req.user.id,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

            await product.save();
            res.status(201).json({ msg: 'Review added successfully' });
        } else {
            res.status(404).json({ msg: 'Product not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;