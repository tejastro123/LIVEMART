// server/index.js
require('dotenv').config();

const cors = require('cors');
const express = require('express');
const http = require('http'); // 1. Import http
const { Server } = require('socket.io'); // 2. Import Server from socket.io
const connectDB = require('./config/db');
const session = require('express-session');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const MongoStore = require('connect-mongo');

require('./config/passport')(passport);

// Initialize Express app
const app = express();
app.use(express.json());
app.set('trust proxy', 1);

app.use(helmet()); // Add security headers

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3000, // Limit each IP to 3000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Dynamic CORS configuration for development and production
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
const server = http.createServer(app); // 3. Create an http server with the express app

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // The origin of your React app
    methods: ['GET', 'POST'],
  },
});

// 1. Connect to Database
connectDB();

// Session Middleware
// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Set to true in production (HTTPS)
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// IMPORTANT: Link our JWT-based user to the session for Passport to use
app.use((req, res, next) => {
  req.io = io;
  if (req.headers && req.headers['x-auth-token']) {
    jwt.verify(
      req.headers['x-auth-token'],
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) return next();
        User.findById(decoded.user.id).then((user) => {
          req.user = user;
          next();
        });
      }
    );
  } else {
    next();
  }
});

// This allows your app to accept JSON data in the request body
app.use(express.json());
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/wholesale-orders', require('./routes/WholesaleOrders'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/queries', require('./routes/queries'));
app.use('/api/retailers', require('./routes/retailers'));
// ... (no need to add fileupload middleware here, it's in the route itself)
app.use('/api/upload', require('./routes/upload'));
// Health check endpoint
app.get('/', (req, res) => res.json({
  status: 'ok',
  message: 'Live MART API is running!',
  environment: process.env.NODE_ENV || 'development',
  timestamp: new Date().toISOString()
}));
app.use('/api/bundles', require('./routes/bundles'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/history', require('./routes/history'));

// Socket.IO connection logic
io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  // Event for a user to join a specific chat room
  socket.on('joinChat', (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined chat room ${conversationId}`);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

app.use(require('./middleware/error'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

