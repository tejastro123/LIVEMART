const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RetailerReviewSchema = new Schema({
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    retailer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true } // Link to the order
}, { timestamps: true });

module.exports = mongoose.model('RetailerReview', RetailerReviewSchema);