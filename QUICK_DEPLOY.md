# ⚡ Quick Deploy Reference

## 🎯 Deploy in 3 Steps (30 minutes total)

### Step 1: Deploy Backend (Render.com)
```
1. Go to render.com → Sign up with GitHub
2. New + → Web Service → Select your repo
3. Settings:
   - Root Directory: backend
   - Build: npm install
   - Start: npm start
   - Plan: Free
4. Environment Variables:
   - MONGODB_URI = your_connection_string
   - JWT_SECRET = random_secret_key
   - NODE_ENV = production
5. Deploy → Copy URL
```

### Step 2: Deploy Frontend (Vercel)
```
1. Go to vercel.com → Sign up with GitHub
2. New Project → Import your repo
3. Settings:
   - Framework: Vite
   - Build: npm run build
   - Output: dist
4. Environment Variable:
   - VITE_API_URL = https://your-backend.onrender.com/api
5. Deploy → Copy URL
```

### Step 3: Connect Them
```
1. Update backend/server.js CORS:
   origin: ['https://your-vercel-url.vercel.app']
2. Push to GitHub
3. Wait for auto-deploy
4. Test login!
```

## 🔗 Your URLs

After deployment:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.onrender.com/api
- **Health Check:** https://your-backend.onrender.com/api/health

## 🧪 Test Credentials

**Organizer:**
- Email: `admin@inazuma.com`
- Password: `Admin@2024`

**Create Players:**
- Use registration page

## ⚠️ Free Tier Notes

**Render Backend:**
- Sleeps after 15 min inactivity
- First request takes 30-60 seconds
- Then fast again

**Solution:** Use UptimeRobot (free) to ping every 14 minutes

## 🆘 Quick Fixes

**Login not working?**
→ Check CORS in backend/server.js includes your Vercel URL

**Network error?**
→ Check VITE_API_URL in Vercel environment variables

**Backend slow?**
→ Cold start - wait 60 seconds, then it's fast

**Database error?**
→ MongoDB Atlas → Network Access → Add 0.0.0.0/0

## 📱 Share Your App

Once deployed, share:
```
🎮 Inazuma Battle - eSports Tournament Platform
🌐 https://your-app.vercel.app

Try it out:
- Register as player
- Browse tournaments
- Manage your wallet
- Join competitions!
```

## 💰 Cost

**Total: $0/month**
- Vercel: Free forever
- Render: Free (with cold starts)
- MongoDB: Free (512 MB)

**Upgrade when needed:**
- Render Pro: $7/month (no cold starts)
- MongoDB Shared: $9/month (2 GB)

---

**Need detailed guide?** See `DEPLOYMENT_GUIDE_FREE.md`
