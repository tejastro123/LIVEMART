// server/models/WholesaleOrder.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WholesaleOrderSchema = new Schema({
    retailer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    wholesaler: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Fulfilled', 'Cancelled'],
        default: 'Pending'
    },
}, { timestamps: true });

module.exports = mongoose.model('WholesaleOrder', WholesaleOrderSchema);