// server/tests/order.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

describe('Order Model', () => {
    it('should create an order with default fields', async () => {
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            role: 'customer',
        });
        const product = await Product.create({
            retailer: new mongoose.Types.ObjectId(),
            name: 'Test Product',
            category: 'Electronics',
            price: 100,
            stock: 10,
        });
        const order = await Order.create({
            user: user._id,
            items: [{
                product: product._id,
                name: product.name,
                quantity: 2,
                price: product.price,
                imageUrl: product.imageUrl,
            }],
            totalAmount: 200,
            shippingAddress: {
                address: '123 Test St',
                city: 'Testville',
                postalCode: '12345',
                country: 'Testland',
            },
            paymentMethod: 'Online',
        });
        expect(order).toBeDefined();
        expect(order.status).toBe('Pending');
        expect(order.pointsRedeemed).toBe(0);
    });

    it('should enforce required fields', async () => {
        await expect(
            Order.create({
                // missing required fields
            })
        ).rejects.toThrow();
    });
});