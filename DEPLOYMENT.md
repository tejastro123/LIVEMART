# 🚀 LiveMART Deployment Guide

This guide will walk you through deploying the LiveMART application to production using **Render** for the backend and **Vercel** for the frontend.

## 📋 Prerequisites

Before you begin, ensure you have:

1. **GitHub Repository** with your code
2. **MongoDB Atlas** account and cluster set up
3. **Render Account** - [Sign up at render.com](https://render.com)
4. **Vercel Account** - [Sign up at vercel.com](https://vercel.com)
5. **API Keys** for all third-party services:
   - Stripe (payment processing)
   - Google Cloud (OAuth, Maps, Gemini AI)
   - Twilio (SMS notifications)
   - SendGrid or Gmail (email notifications)
   - Cloudinary (image hosting)

---

## 🗄️ Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier works fine)
3. Click **"Connect"** → **"Connect your application"**
4. Copy the connection string (format: `mongodb+srv://<username>:<password>@cluster.mongodb.net/`)
5. Replace `<username>` and `<password>` with your credentials
6. Add `/livemart` after `.net/` to specify the database name
7. **Add your IP to whitelist**: Go to Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

**Example connection string:**

```bash
mongodb+srv://myuser:mypassword@cluster0.mongodb.net/livemart?retryWrites=true&w=majority
```

---

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Push Code to GitHub

```bash
cd c:/Users/tejas/OneDrive/Desktop/LIVEMART-DEMO
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/livemart.git
git push -u origin main
```

### 2.2 Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `livemart-api` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or upgrade for better performance)

### 2.3 Set Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add the following:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `PORT` | `5000` | Optional (Render sets this automatically) |
| `MONGO_URI` | Your MongoDB Atlas connection string | Required |
| `JWT_SECRET` | Random string (e.g., use password generator) | Required |
| `SESSION_SECRET` | Random string (different from JWT_SECRET) | Required |
| `CLIENT_URL` | `https://your-app-name.vercel.app` | Will update after frontend deployment |
| `STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key | Required |
| `STRIPE_SECRET_KEY` | Your Stripe secret key | Required |
| `GOOGLE_CLIENT_ID` | Your Google OAuth client ID | Required |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth client secret | Required |
| `GOOGLE_MAPS_API_KEY` | Your Google Maps API key | Required |
| `GEMINI_API_KEY` | Your Google Gemini API key | Required |
| `TWILIO_ACCOUNT_SID` | Your Twilio Account SID | Required |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token | Required |
| `TWILIO_PHONE_NUMBER` | Your Twilio phone number | Required |
| `SENDGRID_API_KEY` | Your SendGrid API key | Required |
| `FROM_EMAIL` | Sender email address | Required |
| `EMAIL_USER` | Gmail address (if using Gmail) | Optional |
| `EMAIL_PASS` | Gmail app password | Optional |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | Required |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | Required |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | Required |

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://livemart-api.onrender.com`
4. Visit the URL - you should see:

   ```json
   {
     "status": "ok",
     "message": "Live MART API is running!",
     "environment": "production",
     "timestamp": "2025-11-23T17:46:38.000Z"
   }
   ```

### 2.5 Update Google OAuth Callback URL

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, add:

 ```bash
<https://your-backend-url.onrender.com/api/auth/google/callback>

```

5.Click Save

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Create React App (should auto-detect)
   - **Root Directory**: `client`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)

### 3.2 Set Environment Variables

Click Environment Variables and add:

| Name | Value | Notes |
|------|-------|-------|
| `REACT_APP_API_URL` | `https://your-backend-url.onrender.com` | Use your actual Render URL |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key | Same as backend |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Your Google Maps API key | Same as backend |

### 3.3 Deploy

1. Click Deploy
2. Wait for build and deployment (3-5 minutes)
3. Once deployed, you'll get a URL like: `https://livemart.vercel.app` or `https://your-app-name.vercel.app`

### 3.4 Update Backend CLIENT_URL

1. Go back to Render Dashboard
2. Navigate to your backend service
3. Go to Environment tab
4. Update `CLIENT_URL` to your Vercel URL: `https://your-app-name.vercel.app`
5. Click Save Changes
6. Render will automatically redeploy with the new environment variable

---

## ✅ Step 4: Verify Deployment

### Backend Verification

1. Visit `https://your-backend-url.onrender.com`
   - Should show the health check JSON response
2. Test an API endpoint: `https://your-backend-url.onrender.com/api/products`
   - Should return products or an empty array
3. Check Render logs for any errors:
   - Go to Render Dashboard → Your Service → Logs

### Frontend Verification

1. Visit your Vercel URL: `https://your-app-name.vercel.app`
2. Check homepage loads correctly
3. Open browser console (F12) and check for errors
4. Test authentication:
   - Sign up for a new account
   - Verify you can log in
5. Test key features:
   - Browse products
   - Add items to cart
   - View product details
   - Test search functionality

### Integration Testing

**Complete User Journey:**

```bash

1. Register new account → Check email/SMS notification
2. Browse products → Verify products load from backend
3. Add to cart → Check cart persistence
4. Checkout with Stripe test mode → Use test card: 4242 4242 4242 4242
5. Verify order in user dashboard
6. Test retailer/wholesaler features
7. Try real-time chat (Socket.IO)
8. Test AI chat support

```

## Stripe Test Cards

- Success: `4242 4242 4242 4242`
- Requires authentication: `4000 0025 0000 3155`
- Declined: `4000 0000 0000 9995`

---

## 🐛 Troubleshooting

### Backend Issues

## Application failed to respond

- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure all required environment variables are set
- Check if IP is whitelisted in MongoDB Atlas

## CORS Errors

- Verify `CLIENT_URL` in backend environment matches your Vercel URL
- Ensure no trailing slash in URLs
- Check browser console for specific CORS error messages

## Socket.IO Not Connecting

- Render free tier may have connection limits
- Check frontend is using correct backend URL for Socket.IO
- Verify WebSocket connections aren't blocked

### Frontend Issues

## API Calls Failing

- Check `REACT_APP_API_URL` is set correctly
- Ensure backend is running and accessible
- Check network tab in browser dev tools

## Environment Variables Not Working

- Environment variables MUST start with `REACT_APP_`
- Redeploy after adding/changing environment variables
- Clear browser cache

## Build Errors

- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Common Fixes

1. **Redeploy Backend**: Render Dashboard → Manual Deploy
2. **Redeploy Frontend**: Vercel Dashboard → Deployments → Redeploy
3. **Clear Build Cache**: Vercel → Settings → Clear Build Cache
4. **Check Logs**: Always check logs first for specific error messages

---

## 🔄 Updating Your Deployment

### Backend Updates

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render will automatically redeploy when it detects changes in the repository.

### Frontend Updates

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

Vercel will automatically redeploy when it detects changes.

### Manual Deployment

- **Render**: Dashboard → Manual Deploy
- **Vercel**: Dashboard → Deployments → Redeploy

---

## 📊 Monitoring

### Render

- **Logs**: Real-time logs in dashboard
- **Metrics**: CPU, Memory usage
- **Health Checks**: Automatic monitoring

### Vercel

- **Analytics**: Page views, performance metrics
- **Logs**: Function logs and errors
- **Deployment History**: Track all deployments

---

## 💰 Cost Considerations

### Free Tier Limitations

**Render Free Tier:**

- 750 hours/month (enough for 1 service)
- Spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 512 MB RAM

**Vercel Free Tier:**

- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Edge network

### Upgrading

**When to upgrade:**

- Traffic exceeds free tier limits
- Need zero downtime (Render spins down on free tier)
- Require better performance
- Need custom domains

**Render Starter Plan**: $7/month (no spin-down, better resources)
**Vercel Pro Plan**: $20/month (more bandwidth, priority support)

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** to Git
2. **Use strong JWT secrets** (at least 32 random characters)
3. **Keep API keys secure** in environment variables
4. **Enable HTTPS** (automatic on Render & Vercel)
5. **Set up MongoDB IP whitelist** properly
6. **Regular security updates**: `npm audit fix`
7. **Use Stripe test mode** until ready for production payments

---

## 📝 Post-Deployment Checklist

- [ ] Backend health check shows "ok"
- [ ] Frontend loads without console errors
- [ ] User registration works
- [ ] User login works
- [ ] Products load from database
- [ ] Cart functionality works
- [ ] Stripe test payment succeeds
- [ ] Email notifications sent
- [ ] SMS notifications sent (if configured)
- [ ] Image uploads work (Cloudinary)
- [ ] Real-time chat works (Socket.IO)
- [ ] AI chat support works
- [ ] Google OAuth login works
- [ ] Update README.md with live URLs
- [ ] Test on mobile devices
- [ ] Monitor logs for first 24 hours

---

## 🎉 Success

Your LiveMART application is now live! Share your URLs:

- **Frontend**: `https://your-app-name.vercel.app`
- **Backend API**: `https://livemart-api.onrender.com`

Remember to update your README.md with these live links!

---

## 📞 Support Resources

- **Render Docs**: <https://render.com/docs>
- **Vercel Docs**: <https://vercel.com/docs>
- **MongoDB Atlas Docs**: <https://docs.atlas.mongodb.com/>
- **Stripe Docs**: <https://stripe.com/docs>
- **Community Help**: Stack Overflow, GitHub Issues

---

**Need help?** Check the troubleshooting section or review the logs in your hosting dashboards. Most issues can be resolved by verifying environment variables and checking error logs.
