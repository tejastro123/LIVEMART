const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BundleSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // The retailer/wholesaler
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    imageUrl: { type: String }, // An optional image for the "look"
}, { timestamps: true });

module.exports = mongoose.model('Bundle', BundleSchema);