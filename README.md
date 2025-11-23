
# 🛒 Live MART – Online Delivery & Supply Chain Marketplace

**Live MART** is a full-stack MERN-based e-commerce ecosystem built to streamline the supply chain by connecting **Customers**, **Retailers**, and **Wholesalers** into a unified platform. The platform focuses on a personalized shopping experience while enabling sellers to efficiently manage inventory, sales, and customer orders.

This project was developed as part of the **CS F213 / MAC F212 – Object-Oriented Programming** course.

---

## 🚀 Live Demo

| Service | Link |
|--------|------|
| **Frontend** (Vercel) | *Deploy following [DEPLOYMENT.md](DEPLOYMENT.md)* |
| **Backend** (Render) | *Deploy following [DEPLOYMENT.md](DEPLOYMENT.md)* |

> **Ready to deploy?** Follow the comprehensive step-by-step guide in **[DEPLOYMENT.md](DEPLOYMENT.md)**

---

## ✨ Key Features

### 1. **Authentication & User Management**

- Multi-role Signup (**Customer / Retailer / Wholesaler**).
- **JWT-based** secure authentication.
- Social Login support (**Google OAuth**).
- **Two-Factor Authentication** using Twilio SMS OTP.
- Secure **Password Reset** via email (Nodemailer).
- **Google Maps API** integration for location-based onboarding.

---

### 2. **Customer Shopping Experience**

- Personalized dynamic homepage featuring:
  - **Deals**, **Flash Sales**, **Recommendations**, **Local Specialties**.
- **Advanced Search & Filtering** (range filters, category filters, distance filters).
- **Location-based product visibility** (nearby retailers).
- **Product Comparison Tool**.
- **Wishlist** support.
- **Loyalty Rewards System** with redeemable points.

---

### 3. **Cart, Orders & Payments**

- Persistent global cart using **Zustand**.
- Dual Payment Methods:
  - **Stripe Online Payments**
  - **Cash on Delivery**
- Automatic **Inventory Stock Updates**.
- **Google Calendar Auto-Reminders** for expected delivery dates.
- **Real-Time Order Tracking** via Socket.IO.

---

### 4. **Retailer & Wholesaler Business Dashboard**

- Full **Inventory & Product Management** (CRUD).
- **Cloudinary** image hosting and optimization.
- **Sales & Flash Sale Pricing** tools.
- Order Management with status updates.
- **Analytics Dashboard** (Chart.js visual insights).
- **Seller Ratings & public profiles**.

---

### 5. **Support, AI Chat & Customer Engagement**

- **AI Chat Support** powered by Google **Gemini AI (RAG)**.
- Real-time **Customer–Retailer Chat** system.
- Product reviews with image upload.
- **Email + SMS Notifications** using SendGrid & Twilio.
- Social product sharing on **Facebook, WhatsApp, Twitter**.

---

## 🛠 Tech Stack

| Layer | Technologies |
|------|-------------|
| **Frontend** | React.js, Zustand, Axios, Framer Motion, Socket.IO Client, Chart.js, Stripe.js, Google Maps |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, Passport.js, Socket.IO, Stripe API, Twilio, SendGrid, Cloudinary |
| **AI / RAG** | Google Gemini API |
| **Deployment** | Vercel (client), Render (server), MongoDB Atlas |
| **Testing** | Jest, Supertest |

---

## 📦 Repository Structure

``
live-mart-project/
├── client/               # React Frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── store/
│       ├── App.js
│       └── index.js
│
└── server/               # Express Backend
├── config/
├── middleware/
├── models/
├── routes/
├── utils/
├── index.js
└── package.json

``

---

## 🧑‍💻 Getting Started (Local Setup)

### **Prerequisites**

- Node.js `v18+`
- MongoDB Atlas account
- `nodemon` installed globally
- API keys for:
  - Stripe
  - Twilio
  - SendGrid
  - Google OAuth, Maps, Gemini
  - Cloudinary

---

### 1️⃣ Backend Setup

```bash
cd server
npm install
````

Create a `.env` file:

``
MONGO_URI=
JWT_SECRET=

STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_MAPS_API_KEY=
GEMINI_API_KEY=

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
SENDGRID_API_KEY=
FROM_EMAIL=

EMAIL_USER=
EMAIL_PASS=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

SESSION_SECRET=
``

Start server:

```bash
npm run dev
```

Backend runs at: **[http://localhost:5000](http://localhost:5000)**

---

### 2️⃣ Frontend Setup

```bash
cd client
npm install
```

Create `.env.local`:

``
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=
REACT_APP_GOOGLE_MAPS_API_KEY=
``

Start app:

```bash
npm start
```

Frontend opens at: **[http://localhost:3000](http://localhost:3000)**

---

## 🤝 Contributors

- **Team Members:** *(Add Names Here)*
- **Course:** CS F213 / MAC F212 – OOP Lab

---
