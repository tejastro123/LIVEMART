const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BrowsingHistorySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
}, {
  timestamps: true // Automatically adds createdAt/updatedAt
});

// To prevent duplicate entries, a user can only have one entry per product
BrowsingHistorySchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('BrowsingHistory', BrowsingHistorySchema);