// server/models/Query.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    text: { type: String, required: true },
}, { timestamps: true });

const QuerySchema = new Schema({
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    retailer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    messages: [MessageSchema],
    status: {
        type: String,
        enum: ['Open', 'Answered', 'Closed'],
        default: 'Open'
    },
}, { timestamps: true });

module.exports = mongoose.model('Query', QuerySchema);