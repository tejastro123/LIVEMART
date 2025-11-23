// server/models/User.js
const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    addressLabel: { type: String, default: 'Address' }, // e.g., "Home", "Work"
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google OAuth users
    role: {
        type: String,
        enum: ['customer', 'retailer', 'wholesaler'],
        required: true,
    }, // For multi-role registration [cite: 36]
    phone: {
        type: String,
        // Phone is optional for Google OAuth users, will be prompted later if needed
    },
    phoneOtp: String,
    phoneOtpExpires: Date,
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
        },
    },
    googleId: String,
    googleAccessToken: String,
    googleRefreshToken: String,
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    // In UserSchema
    loyaltyPoints: {
        type: Number,
        default: 0,
    },
    addresses: [AddressSchema],
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);