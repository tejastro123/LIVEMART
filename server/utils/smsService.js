// server/utils/smsService.js
const twilio = require('twilio');

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

const sendMessage = async (to, body) => {
    try {
        await client.messages.create({ to, from: fromPhone, body });
        console.log(`SMS sent to ${to}`);
    } catch (error) {
        console.error(`Error sending SMS to ${to}:`, error.message);
    }
};

// --- Customer Order Notifications ---
exports.sendCustomerOrderConfirmation = (customerPhone, order) => {
    const message = `Live MART: Thanks for your order #${order._id.toString().slice(-6)}! Total: $${order.totalAmount.toFixed(2)}. We'll notify you when it ships.`;
    sendMessage(customerPhone, message);
};

exports.sendRetailerNewOrderAlert = (retailerPhone, order) => {
    const message = `Live MART: New order #${order._id.toString().slice(-6)} received from customer ${order.user.name}. Please review it in your dashboard.`;
    sendMessage(retailerPhone, message);
};

exports.sendOrderStatusUpdate = (customerPhone, order) => {
    const message = `Live MART Update: The status of your order #${order._id.toString().slice(-6)} is now: ${order.status}.`;
    sendMessage(customerPhone, message);
};

// --- Wholesale Order Notifications ---
exports.sendWholesaleOrderConfirmation = (retailerPhone, order) => {
    const message = `Live MART Wholesale: Your order #${order._id.toString().slice(-6)} has been placed successfully.`;
    sendMessage(retailerPhone, message);
};

exports.sendWholesaleOrderStatusUpdate = (retailerPhone, order) => {
    const message = `Live MART Wholesale Update: The status of your order #${order._id.toString().slice(-6)} is now: ${order.status}.`;
    sendMessage(retailerPhone, message);
};