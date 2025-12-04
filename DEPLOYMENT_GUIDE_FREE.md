# 🚀 Free Deployment Guide - Vercel + Render.com

## Total Cost: $0/month Forever! 🎉

This guide will help you deploy your Inazuma Battle platform completely free using:
- **Vercel** for Frontend (Free forever)
- **Render.com** for Backend (Free tier with cold starts)
- **MongoDB Atlas** for Database (Already free)

---

## 📋 Prerequisites

Before starting, make sure you have:
- [ ] GitHub account
- [ ] Your code pushed to GitHub repository
- [ ] MongoDB Atlas connection string (you already have this)
- [ ] 30 minutes of time

---

## 🎯 Deployment Strategy

We'll deploy in this order:
1. **Backend first** (Render.com) → Get backend URL
2. **Frontend second** (Vercel) → Use backend URL
3. **Update CORS** → Connect them together
4. **Test everything** → Make sure it works!

---

## Part 1: Deploy Backend to Render.com (15 minutes)

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

### Step 2: Create New Web Service

1. Click "New +" button (top right)
2. Select "Web Service"
3. Connect your GitHub repository
4. Select your repository from the list

### Step 3: Configure Backend Service

Fill in these settings:

**Basic Settings:**
```
Name: inazuma-backend
Region: Singapore (or closest to you)
Branch: main (or your default branch)
Root Directory: backend
Runtime: Node
```

**Build & Deploy:**
```
Build Command: npm install
Start Command: npm start
```

**Plan:**
```
Select: Free
```

### Step 4: Add Environment Variables

Click "Advanced" → "Add Environment Variable"

Add these variables one by one:

```
NODE_ENV = production
```

```
MONGODB_URI = your_mongodb_atlas_connection_string
```
(Get this from your MongoDB Atlas dashboard)

```
JWT_SECRET = your_super_secret_key_here_make_it_long_and_random
```
(Use a random string, at least 32 characters)

```
FRONTEND_URL = https://inazuma-battle.vercel.app
```
(We'll update this later with your actual Vercel URL)

### Step 5: Deploy Backend

1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Watch the logs - should see:
   ```
   🚀 Server running on port 5000
   📍 Environment: production
   ✅ MongoDB Connected
   ```
4. Once deployed, copy your backend URL:
   ```
   https://inazuma-backend.onrender.com
   ```
   (Your URL will be different - copy it!)

### Step 6: Test Backend

Open in browser:
```
https://your-backend-url.onrender.com/api/health
```

Should see:
```json
{
  "status": "OK",
  "message": "Inazuma Battle API is running",
  "timestamp": "2025-12-04T..."
}
```

✅ Backend is live!

---

## Part 2: Deploy Frontend to Vercel (10 minutes)

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Sign up with GitHub (recommended)
4. Authorize Vercel to access your repositories

### Step 2: Import Project

1. Click "Add New..." → "Project"
2. Click "Import" next to your repository
3. Vercel will auto-detect it's a Vite project

### Step 3: Configure Frontend

**Project Settings:**
```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Environment Variables:**

Click "Environment Variables" and add:

```
Variable Name: VITE_API_URL
Value: https://your-backend-url.onrender.com/api
```
(Use YOUR backend URL from Step 1!)

### Step 4: Deploy Frontend

1. Click "Deploy"
2. Wait 2-3 minutes
3. Vercel will build and deploy
4. You'll get a URL like:
   ```
   https://inazuma-battle.vercel.app
   ```
   (Your URL will be different)

### Step 5: Test Frontend

1. Open your Vercel URL in browser
2. You should see the homepage
3. Try to login - it might not work yet (that's okay!)

---

## Part 3: Connect Frontend & Backend (5 minutes)

### Step 1: Update Backend CORS

1. Go back to your code editor
2. Open `backend/server.js`
3. Find the CORS section and update it:

```javascript
app.use(cors({
  origin: [
    'https://inazuma-battle.vercel.app',  // ← Add your Vercel URL
    'https://inazuma-battle-*.vercel.app', // ← For preview deployments
    process.env.FRONTEND_URL,
    'http://localhost:8080',
    'http://localhost:8081'
  ],
  credentials: true
}));
```

4. Save the file
5. Commit and push to GitHub:
   ```bash
   git add backend/server.js
   git commit -m "Update CORS for production"
   git push
   ```

### Step 2: Wait for Auto-Deploy

1. Go to Render.com dashboard
2. Your backend will auto-deploy (takes 2-3 minutes)
3. Wait for "Live" status

### Step 3: Update Render Environment Variable

1. In Render dashboard, go to your backend service
2. Click "Environment" tab
3. Find `FRONTEND_URL` variable
4. Update it to your actual Vercel URL:
   ```
   https://your-actual-vercel-url.vercel.app
   ```
5. Click "Save Changes"
6. Service will restart automatically

---

## Part 4: Test Everything! (5 minutes)

### Test 1: Backend Health Check

Open in browser:
```
https://your-backend.onrender.com/api/health
```

✅ Should return JSON with status "OK"

### Test 2: Frontend Loads

Open your Vercel URL:
```
https://your-frontend.vercel.app
```

✅ Should see the homepage with background image

### Test 3: Login Works

1. Go to Login page
2. Try organizer login:
   - Email: `admin@inazuma.com`
   - Password: `Admin@2024`
3. ✅ Should login successfully

### Test 4: Register New Player

1. Go to Register page
2. Create a new player account
3. ✅ Should register and login

### Test 5: Wallet Operations

1. Login as player
2. Go to Wallet page
3. Try to deposit money
4. ✅ Should work and show in transaction history

### Test 6: Tournament Registration

1. Browse tournaments
2. Register for a tournament
3. ✅ Should deduct fee and show in "My Tournaments"

### Test 7: Admin Features

1. Login as organizer
2. Go to "Manage Wallets"
3. ✅ Should see all player wallets
4. Try adding/deducting funds
5. ✅ Should work and update balances

---

## 🎉 Congratulations! Your App is Live!

Your URLs:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.onrender.com
- **Database:** MongoDB Atlas (cloud)

---

## ⚠️ Important Notes About Free Tier

### Render.com Free Tier Limitations:

**Cold Starts:**
- Backend sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Subsequent requests are fast

**How to Handle:**
1. **For Development:** Accept the cold starts
2. **For Production:** Use UptimeRobot (free) to ping every 14 minutes
3. **Best Solution:** Upgrade to $7/month when you get users

### Vercel Free Tier:
- ✅ No limitations for your use case
- ✅ Unlimited bandwidth
- ✅ Automatic SSL
- ✅ Fast CDN delivery

### MongoDB Atlas Free Tier:
- ✅ 512 MB storage (enough for thousands of users)
- ✅ Shared cluster (good performance)
- ✅ Automatic backups

---

## 🔧 Troubleshooting

### Issue: "Network Error" on Login

**Cause:** CORS not configured correctly

**Solution:**
1. Check backend CORS includes your Vercel URL
2. Make sure no typos in URLs
3. Check backend logs in Render dashboard

### Issue: "Invalid Credentials"

**Cause:** Backend not connected to MongoDB

**Solution:**
1. Check MongoDB Atlas → Network Access
2. Add IP: `0.0.0.0/0` (allow all)
3. Check `MONGODB_URI` in Render environment variables

### Issue: Backend Takes Forever to Load

**Cause:** Cold start (backend was sleeping)

**Solution:**
- Wait 30-60 seconds for first request
- Subsequent requests will be fast
- Or use UptimeRobot to keep it awake

### Issue: Frontend Shows Old Code

**Cause:** Browser cache

**Solution:**
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Or clear browser cache
3. Or open in Incognito mode

### Issue: Environment Variables Not Working

**Cause:** Not set correctly in platform

**Solution:**
1. **Vercel:** Must start with `VITE_`
2. **Render:** Check spelling and save changes
3. Redeploy after adding variables

---

## 🚀 Optional: Keep Backend Awake (Free)

To prevent cold starts, use UptimeRobot:

1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Sign up (free)
3. Add New Monitor:
   ```
   Monitor Type: HTTP(s)
   Friendly Name: Inazuma Backend
   URL: https://your-backend.onrender.com/api/health
   Monitoring Interval: 14 minutes
   ```
4. Save

Now your backend will be pinged every 14 minutes and stay awake!

---

## 📊 Monitoring Your App

### Render Dashboard:
- View logs
- Check CPU/Memory usage
- See deployment history
- Monitor uptime

### Vercel Dashboard:
- View deployments
- Check analytics
- See build logs
- Monitor performance

### MongoDB Atlas:
- Check database size
- Monitor connections
- View query performance
- Set up alerts

---

## 🔄 Updating Your App

### To Update Code:

1. Make changes locally
2. Test locally
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
4. **Render:** Auto-deploys in 2-3 minutes
5. **Vercel:** Auto-deploys in 1-2 minutes

Both platforms automatically deploy when you push to GitHub!

---

## 💡 Tips for Success

1. **Test Locally First:** Always test changes on localhost before deploying
2. **Check Logs:** If something breaks, check logs in Render/Vercel dashboard
3. **Monitor Database:** Keep an eye on MongoDB Atlas storage usage
4. **Backup Data:** MongoDB Atlas has automatic backups, but export important data
5. **Use Environment Variables:** Never commit secrets to GitHub

---

## 🎯 Next Steps

### When You Get Users:

1. **Upgrade Backend** ($7/month):
   - No cold starts
   - Better performance
   - More reliable

2. **Add Custom Domain** (Free):
   - Buy domain from Namecheap/GoDaddy
   - Add to Vercel (free SSL included)
   - Professional look

3. **Monitor Performance:**
   - Set up error tracking (Sentry - free tier)
   - Add analytics (Google Analytics - free)
   - Monitor uptime (UptimeRobot - free)

4. **Scale Database:**
   - When you hit 512 MB limit
   - Upgrade MongoDB Atlas to $9/month
   - Get 2 GB storage

---

## 📞 Need Help?

If you get stuck:

1. **Check Logs:**
   - Render: Dashboard → Your Service → Logs
   - Vercel: Dashboard → Your Project → Deployments → View Logs

2. **Common Issues:**
   - CORS errors → Check backend CORS configuration
   - Network errors → Check environment variables
   - Database errors → Check MongoDB Atlas IP whitelist

3. **Test Endpoints:**
   ```bash
   # Test backend health
   curl https://your-backend.onrender.com/api/health
   
   # Test login
   curl -X POST https://your-backend.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@inazuma.com","password":"Admin@2024"}'
   ```

---

## ✅ Deployment Checklist

Before going live:

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set correctly
- [ ] CORS updated with production URLs
- [ ] MongoDB Atlas IP whitelist updated (0.0.0.0/0)
- [ ] Login works
- [ ] Registration works
- [ ] Wallet operations work
- [ ] Tournament registration works
- [ ] Admin features work
- [ ] All pages load correctly
- [ ] No console errors in browser
- [ ] Backend logs show no errors

---

## 🎊 You're Done!

Your eSports tournament platform is now live and accessible to anyone in the world!

Share your URL and start getting users! 🚀

**Your Live URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`

**Test Credentials:**
- Organizer: `admin@inazuma.com` / `Admin@2024`
- Create player accounts through registration

Enjoy your free deployment! 🎉
