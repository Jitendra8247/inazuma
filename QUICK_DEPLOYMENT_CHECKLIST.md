# Quick Deployment Checklist ✅

Use this as a quick reference while deploying.

## 📋 Pre-Deployment

- [ ] Code pushed to GitHub
- [ ] `backend/package.json` has `"start": "node server.js"`
- [ ] `backend/server.js` exists

## 🍃 MongoDB Atlas Setup

- [ ] Account created at mongodb.com/cloud/atlas
- [ ] Free M0 cluster created
- [ ] Database user created (save password!)
- [ ] Network access: `0.0.0.0/0` added
- [ ] Connection string copied
- [ ] Database name added to connection string: `/inazuma-battle`

**Connection String Format:**
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/inazuma-battle?retryWrites=true&w=majority
```

## 🚀 Render Setup

- [ ] Account created at render.com
- [ ] Connected with GitHub
- [ ] New Web Service created
- [ ] Repository selected

**Service Configuration:**
- [ ] Name: `inazuma-backend`
- [ ] Region: (same as MongoDB)
- [ ] Branch: `main`
- [ ] Root Directory: `backend`
- [ ] Runtime: `Node`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Plan: `Free`

## 🔐 Environment Variables

Add these in Render → Environment tab:

- [ ] `NODE_ENV` = `production`
- [ ] `MONGODB_URI` = (your MongoDB connection string)
- [ ] `JWT_SECRET` = (generate with command below)
- [ ] `FRONTEND_URL` = (your frontend URL)
- [ ] `PORT` = `5000`

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## ✅ Verification

- [ ] Deployment status: "Live" (green)
- [ ] Logs show: "✅ MongoDB Connected"
- [ ] Logs show: "🚀 Server running on port 5000"
- [ ] Health endpoint works: `https://YOUR-APP.onrender.com/api/health`
- [ ] Test registration works
- [ ] User appears in MongoDB Atlas

## 👤 Create Admin Account

**Option 1: Via API (Recommended)**
```bash
curl -X POST https://YOUR-APP.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@inazuma.com",
    "password": "YourSecurePassword123!",
    "role": "organizer"
  }'
```

**Option 2: Via Frontend**
- Use registration form
- Set role to "organizer"

## 🔗 Update Frontend

- [ ] Update `.env` or `.env.production`:
  ```
  VITE_API_URL=https://YOUR-APP.onrender.com/api
  ```
- [ ] Commit and push
- [ ] Verify frontend connects to backend

## 🔄 Keep Service Awake (Optional)

- [ ] Sign up at uptimerobot.com
- [ ] Add monitor: `https://YOUR-APP.onrender.com/api/health`
- [ ] Set interval: 5 minutes

## 🐛 Troubleshooting

**If MongoDB won't connect:**
1. Check MONGODB_URI has `/inazuma-battle` database name
2. Verify password has no special characters (or URL-encode them)
3. Check MongoDB Atlas → Network Access → `0.0.0.0/0` is whitelisted
4. Check MongoDB Atlas → Database Access → User has read/write permissions

**If build fails:**
1. Check Root Directory is set to `backend`
2. Verify `package.json` exists in backend folder
3. Check Render logs for specific error

**If admin credentials don't work:**
1. Create admin via API (see above)
2. Check MongoDB to verify user exists
3. Try logging in with exact credentials used during registration

## 📞 Quick Commands

**Test health:**
```bash
curl https://YOUR-APP.onrender.com/api/health
```

**Test registration:**
```bash
curl -X POST https://YOUR-APP.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'
```

**Test login:**
```bash
curl -X POST https://YOUR-APP.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

**Run verification script:**
```bash
cd backend
MONGODB_URI="your-connection-string" node verify-deployment.js
```

## 🎯 Success Criteria

✅ All checkboxes above are checked
✅ Health endpoint returns 200 OK
✅ Can register new users
✅ Users appear in MongoDB
✅ Can login with credentials
✅ Admin account works
✅ Frontend connects successfully

---

**Estimated Time:** 15 minutes
**Cost:** $0 (completely free)

**Your URLs:**
- Backend: `https://YOUR-APP.onrender.com`
- MongoDB: `https://cloud.mongodb.com`
- Render Dashboard: `https://dashboard.render.com`
