// server/tests/user.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
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

describe('User Model', () => {
  it('should create a user with default fields', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      role: 'customer',
    });
    expect(user).toBeDefined();
    expect(user.loyaltyPoints).toBe(0);
    expect(user.rating).toBe(0);
    expect(user.numReviews).toBe(0);
    expect(user.addresses).toEqual([]);
  });

  it('should enforce required fields', async () => {
    await expect(
      User.create({
        // missing name, email, role
      })
    ).rejects.toThrow();
  });
});
