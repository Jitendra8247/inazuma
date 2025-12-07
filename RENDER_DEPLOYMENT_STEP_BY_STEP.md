# Complete Render Deployment Guide - Step by Step 🚀

## Prerequisites Checklist
- [ ] GitHub account
- [ ] MongoDB Atlas account (free)
- [ ] Your code pushed to GitHub
- [ ] 15 minutes of time

---

## PART 1: Setup MongoDB Atlas (5 minutes)

### Step 1.1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Try Free"**
3. Sign up with Google/GitHub or email
4. Complete registration

### Step 1.2: Create a Free Cluster
1. After login, click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select **Cloud Provider**: AWS
4. Select **Region**: Choose closest to you (e.g., Singapore, Oregon)
5. Cluster Name: Leave default or name it `inazuma-cluster`
6. Click **"Create"** (takes 1-3 minutes)

### Step 1.3: Create Database User
1. You'll see a security quickstart screen
2. Under **"How would you like to authenticate your connection?"**
3. Choose **"Username and Password"**
4. Create credentials:
   - **Username**: `inazuma_admin` (or your choice)
   - **Password**: Click **"Autogenerate Secure Password"** 
   - **IMPORTANT**: Copy and save this password somewhere safe!
5. Click **"Create User"**

### Step 1.4: Setup Network Access
1. Scroll down to **"Where would you like to connect from?"**
2. Click **"Add My Current IP Address"** (this adds your current IP)
3. **IMPORTANT**: Also click **"Add a Different IP Address"**
4. Enter: `0.0.0.0/0` (this allows Render to connect)
5. Description: `Allow all (for Render)`
6. Click **"Add Entry"**
7. Click **"Finish and Close"**

### Step 1.5: Get Connection String
1. Click **"Go to Databases"**
2. Wait for cluster to finish creating (green status)
3. Click **"Connect"** button
4. Choose **"Connect your application"**
5. Driver: **Node.js**
6. Version: **5.5 or later**
7. Copy the connection string (looks like):
   ```
   mongodb+srv://inazuma_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
8. **IMPORTANT**: Replace `<password>` with your actual password
9. **IMPORTANT**: Add database name before the `?`:
   ```
   mongodb+srv://inazuma_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/inazuma-battle?retryWrites=true&w=majority
   ```
10. Save this complete connection string - you'll need it for Render!

**Example of correct connection string:**
```
mongodb+srv://inazuma_admin:MySecurePass123@cluster0.abc123.mongodb.net/inazuma-battle?retryWrites=true&w=majority
```

---

## PART 2: Prepare Your Code (2 minutes)

### Step 2.1: Verify Your Backend Structure
Your backend folder should have:
```
backend/
├── server.js
├── package.json
├── models/
├── routes/
├── middleware/
└── utils/
```

### Step 2.2: Check package.json
Make sure your `backend/package.json` has:
```json
{
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Step 2.3: Push to GitHub (if not already done)
```bash
# In your project root
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

---

## PART 3: Deploy on Render (5 minutes)

### Step 3.1: Create Render Account
1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with **GitHub** (recommended)
4. Authorize Render to access your repositories

### Step 3.2: Create New Web Service
1. Click **"New +"** (top right)
2. Select **"Web Service"**
3. Connect your repository:
   - If you don't see your repo, click **"Configure account"**
   - Grant access to your repository
   - Click back and refresh
4. Select your repository from the list

### Step 3.3: Configure Web Service

Fill in these settings:

**Basic Settings:**
- **Name**: `inazuma-backend` (or your choice)
- **Region**: Choose same as MongoDB (e.g., Singapore, Oregon)
- **Branch**: `main`
- **Root Directory**: `backend` (IMPORTANT if backend is in subfolder)
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Plan:**
- Select **"Free"** plan

### Step 3.4: Add Environment Variables

Scroll down to **"Environment Variables"** section.

Click **"Add Environment Variable"** for each of these:

**Variable 1:**
- **Key**: `NODE_ENV`
- **Value**: `production`

**Variable 2:**
- **Key**: `MONGODB_URI`
- **Value**: Paste your complete MongoDB connection string from Step 1.5
  ```
  mongodb+srv://inazuma_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/inazuma-battle?retryWrites=true&w=majority
  ```

**Variable 3:**
- **Key**: `JWT_SECRET`
- **Value**: Generate a secure secret (see below)

**Variable 4:**
- **Key**: `FRONTEND_URL`
- **Value**: Your frontend URL (e.g., `https://your-app.vercel.app`)
  - If you don't have frontend deployed yet, use: `http://localhost:5173`

**Variable 5:**
- **Key**: `PORT`
- **Value**: `5000`

### Step 3.5: Generate JWT Secret

Open a terminal and run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output (looks like: `a1b2c3d4e5f6...`) and use it as your `JWT_SECRET` value.

### Step 3.6: Deploy!
1. Scroll to bottom
2. Click **"Create Web Service"**
3. Wait for deployment (2-5 minutes)
4. Watch the logs for:
   - ✅ "Build successful"
   - ✅ "Server running on port 5000"
   - ✅ "MongoDB Connected"

---

## PART 4: Verify Deployment (2 minutes)

### Step 4.1: Check Deployment Status
1. Wait for **"Live"** status (green)
2. Your service URL will be: `https://inazuma-backend.onrender.com`

### Step 4.2: Check Logs
1. Click **"Logs"** tab
2. Look for these success messages:
   ```
   🚀 Server running on port 5000
   📍 Environment: production
   🌐 Listening on 0.0.0.0:5000
   ✅ MongoDB Connected
   ✅ Tournament scheduler started
   ```

3. **If you see errors**, check:
   - ❌ "MongoDB Connection Error" → Check your MONGODB_URI
   - ❌ "Cannot find module" → Check your build command
   - ❌ "Port already in use" → This shouldn't happen on Render

### Step 4.3: Test Health Endpoint
1. Copy your service URL (e.g., `https://inazuma-backend.onrender.com`)
2. Open in browser: `https://inazuma-backend.onrender.com/api/health`
3. You should see:
   ```json
   {
     "status": "OK",
     "message": "Inazuma Battle API is running",
     "timestamp": "2024-12-07T..."
   }
   ```

### Step 4.4: Test Registration
Use a tool like Postman or curl:

```bash
curl -X POST https://inazuma-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123",
    "role": "player"
  }'
```

You should get a success response with a token.

### Step 4.5: Verify Data in MongoDB
1. Go back to MongoDB Atlas
2. Click **"Browse Collections"**
3. You should see:
   - Database: `inazuma-battle`
   - Collections: `users`, `wallets`
   - Your test user should be there!

---

## PART 5: Test Your Admin Credentials

### Step 5.1: Add Admin User to MongoDB
1. In MongoDB Atlas, click **"Browse Collections"**
2. Select `inazuma-battle` database
3. Select `users` collection
4. Click **"Insert Document"**
5. Paste this (modify as needed):
   ```json
   {
     "username": "admin",
     "email": "admin@inazuma.com",
     "password": "$2a$10$YourHashedPasswordHere",
     "role": "organizer",
     "avatar": "/placeholder.svg",
     "stats": {
       "tournamentsPlayed": 0,
       "tournamentsWon": 0,
       "totalEarnings": 0,
       "rank": "Bronze"
     },
     "isActive": true,
     "createdAt": {"$date": "2024-12-07T00:00:00.000Z"}
   }
   ```

**WAIT!** The password needs to be hashed. Let's create the admin properly:

### Step 5.2: Create Admin via API (Better Method)
```bash
curl -X POST https://inazuma-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@inazuma.com",
    "password": "Admin@123",
    "role": "organizer"
  }'
```

Save the response - it contains your admin token!

### Step 5.3: Test Admin Login
```bash
curl -X POST https://inazuma-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@inazuma.com",
    "password": "Admin@123"
  }'
```

You should get a token back!

---

## PART 6: Update Frontend (1 minute)

### Step 6.1: Update Frontend Environment Variable
In your frontend project, update `.env` or `.env.production`:

```env
VITE_API_URL=https://inazuma-backend.onrender.com/api
```

### Step 6.2: Redeploy Frontend
If using Vercel:
```bash
git add .
git commit -m "Update API URL"
git push
```

Vercel will auto-deploy.

---

## PART 7: Keep Service Awake (Optional)

Render free tier sleeps after 15 minutes of inactivity.

### Option 1: UptimeRobot (Recommended)
1. Go to https://uptimerobot.com
2. Sign up (free)
3. Click **"Add New Monitor"**
4. Settings:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: Inazuma Backend
   - **URL**: `https://inazuma-backend.onrender.com/api/health`
   - **Monitoring Interval**: 5 minutes
5. Click **"Create Monitor"**

Your service will now stay awake 24/7!

---

## Troubleshooting Common Issues

### Issue 1: "MongoDB Connection Error"

**Check these:**
1. Is MONGODB_URI set correctly in Render?
2. Did you replace `<password>` with actual password?
3. Did you add `/inazuma-battle` database name?
4. Did you whitelist `0.0.0.0/0` in MongoDB Atlas?

**Fix:**
- Go to Render → Environment → Edit MONGODB_URI
- Go to MongoDB Atlas → Network Access → Add `0.0.0.0/0`

### Issue 2: "Build Failed"

**Check these:**
1. Is `backend` folder set as Root Directory?
2. Is `npm install` the build command?
3. Does package.json exist in backend folder?

**Fix:**
- Go to Render → Settings → Root Directory → Set to `backend`

### Issue 3: "Cannot find module"

**Fix:**
- Check your imports in server.js
- Make sure all files are pushed to GitHub
- Redeploy

### Issue 4: "CORS Error"

**Fix:**
- Add your frontend URL to FRONTEND_URL env var
- Make sure it includes `https://`

### Issue 5: Admin Credentials Don't Work

**This happens because:**
- MongoDB wasn't connected when you created them
- Password wasn't hashed correctly

**Fix:**
- Create admin via API (Step 5.2)
- Or use the registration endpoint with role: "organizer"

---

## Final Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password saved
- [ ] Network access allows 0.0.0.0/0
- [ ] Connection string copied with database name
- [ ] Code pushed to GitHub
- [ ] Render web service created
- [ ] Root directory set to `backend`
- [ ] All 5 environment variables added
- [ ] Deployment shows "Live" status
- [ ] Logs show "MongoDB Connected"
- [ ] Health endpoint returns OK
- [ ] Test registration works
- [ ] User appears in MongoDB
- [ ] Admin account created
- [ ] Admin login works
- [ ] Frontend updated with new API URL
- [ ] UptimeRobot configured (optional)

---

## Quick Reference

**Your URLs:**
- Backend: `https://inazuma-backend.onrender.com`
- Health Check: `https://inazuma-backend.onrender.com/api/health`
- MongoDB Atlas: https://cloud.mongodb.com

**Environment Variables:**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/inazuma-battle?retryWrites=true&w=majority
JWT_SECRET=<generated-secret>
FRONTEND_URL=https://your-frontend.vercel.app
PORT=5000
```

**Important Commands:**
```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test health
curl https://inazuma-backend.onrender.com/api/health

# Test registration
curl -X POST https://inazuma-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'
```

---

## Success! 🎉

Your backend is now live and connected to MongoDB!

**What's working:**
✅ Backend deployed on Render
✅ MongoDB Atlas connected
✅ User registration saves to database
✅ Admin credentials work
✅ Frontend can connect
✅ Auto-deploy enabled

**Next steps:**
1. Test all features
2. Create your admin account
3. Set up UptimeRobot
4. Share your app!

---

**Need help?** Check Render logs first, then MongoDB Atlas metrics.

**Deployment Time**: ~15 minutes
**Cost**: $0 (completely free)
**Status**: Production Ready ✅
