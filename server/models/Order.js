// server/models/Order.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            imageUrl: { type: String },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    paymentMethod: { // <-- ADD THIS
        type: String,
        required: true,
        default: 'Online',
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'In Transit', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    // In OrderSchema
    pointsRedeemed: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);