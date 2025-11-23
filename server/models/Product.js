// server/models/Product.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    imageUrl: { type: String },
}, { timestamps: true });

const ProductSchema = new Schema({
    retailer: { // Link to the user who is the retailer
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    discountPrice: {
        type: Number,
    },
    isOnSale: {
        type: Boolean,
        default: false,
    },
    imageUrl: {
        type: String,
    },
    isProxy: {
        type: Boolean,
        default: false,
    },
    wholesalerSource: { // Optional: Link to the original wholesaler product
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    isLocalSpecialty: { // To highlight region-specific items
        type: Boolean,
        default: false,
    },
    reviews: [ReviewSchema], // <-- ADD THIS
    rating: { // <-- ADD THIS (average rating)
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: { // <-- ADD THIS (number of reviews)
        type: Number,
        required: true,
        default: 0,
    },
    // In ProductSchema
    flashSalePrice: {
        type: Number,
    },
    flashSaleExpires: {
        type: Date,
    },
}, { timestamps: true });

ProductSchema.index({ name: 'text', description: 'text', category: 'text' }); // Add text index
ProductSchema.index({ category: 1, price: 1 }); // Compound index for filtering
ProductSchema.index({ retailer: 1 }); // Index for fetching retailer products

module.exports = mongoose.model('Product', ProductSchema);