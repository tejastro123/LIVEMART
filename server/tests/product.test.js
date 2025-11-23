// server/tests/product.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Product = require('../models/Product');

// Simple app to mount routes if needed (not used here, but kept for consistency)
const app = express();
app.use(express.json());

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
  // Clean up after each test
  await mongoose.connection.db.dropDatabase();
});

describe('Product Model', () => {
  it('should create a product with default fields', async () => {
    const product = await Product.create({
      retailer: new mongoose.Types.ObjectId(),
      name: 'Test Product',
      category: 'Electronics',
      price: 100,
      stock: 10,
    });

    expect(product).toBeDefined();
    expect(product.rating).toBe(0);
    expect(product.numReviews).toBe(0);
    expect(product.reviews).toEqual([]);
    expect(product.isOnSale).toBe(false);
    expect(product.isProxy).toBe(false);
  });

  it('should enforce required fields', async () => {
    await expect(
      Product.create({
        // missing required retailer, name, category, price, stock
      })
    ).rejects.toThrow();
  });
});
