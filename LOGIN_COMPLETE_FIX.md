# Complete Login Fix Guide

## Current Status: "Invalid Credentials" Error ✅

Good news! The login system is working correctly. The error message means:
- ✅ Frontend is communicating with backend
- ✅ Backend is responding properly
- ❌ The demo users don't exist in your database

## Immediate Solution

You have **3 options** to fix this:

---

### 🎯 Option 1: Create Demo Users (Recommended)

**Via Render Dashboard:**

1. Go to: https://dashboard.render.com
2. Click on your service: **inazuma-back**
3. Click the **Shell** tab
4. Copy and paste this command:
   ```bash
   node create-demo-users.js
   ```
5. Press Enter and wait for success message
6. Go back to your website and login with:
   - Email: `player@demo.com`
   - Password: `demo123`

**What this does:**
- Creates player@demo.com with password demo123
- Creates organizer@demo.com with password demo123
- Sets up wallets for both accounts
- Updates passwords if accounts already exist

---

### 🎯 Option 2: Register a New Account (Easiest)

1. On the login page, click **"Create one"**
2. Fill in the registration form:
   - Username: Choose any username
   - Email: Your email address
   - Password: At least 6 characters
3. Click **"Create Account"**
4. You'll be automatically logged in!

**Note:** This creates a player account. To get organizer access, you'll need to upgrade the account (see below).

---

### 🎯 Option 3: Check Existing Users

Maybe users already exist but with different passwords?

**Via Render Shell:**
```bash
node check-users.js
```

This shows all users in your database. If you see users listed, try their credentials.

---

## Verify Everything Works

### 1. Check Backend Health
Open this URL: https://inazuma-back.onrender.com/api/health

**Expected:**
```json
{
  "status": "OK",
  "message": "Inazuma Battle API is running",
  "timestamp": "..."
}
```

### 2. Check Browser Console
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Try to login
4. Look for these messages:
   ```
   🔐 Attempting login to: https://inazuma-back.onrender.com/api/auth/login
   ✅ Login response: { success: true, ... }
   ```

### 3. Test Login API Directly
Open browser console (F12) and run:
```javascript
fetch('https://inazuma-back.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'player@demo.com', 
    password: 'demo123' 
  })
})
.then(r => r.json())
.then(d => console.log('Result:', d))
```

---

## After Creating Demo Users

You'll have these accounts ready to use:

### 👤 Player Account
- **Email:** player@demo.com
- **Password:** demo123
- **Can do:**
  - Browse tournaments
  - Register for tournaments
  - View wallet and transactions
  - Update profile

### 👨‍💼 Organizer Account
- **Email:** organizer@demo.com
- **Password:** demo123
- **Can do:**
  - Everything a player can do
  - Create tournaments
  - Manage tournaments
  - View all players
  - Manage wallets (add/deduct funds)

---

## Upgrade Player to Organizer

If you registered as a player but need organizer access:

**Via Render Shell:**
```bash
node upgrade-to-admin.js
```
Then enter your email when prompted.

**Or via MongoDB Atlas:**
1. Login to MongoDB Atlas
2. Browse Collections
3. Find `users` collection
4. Find your user document
5. Edit the `role` field from "player" to "organizer"
6. Save
7. Logout and login again

---

## Troubleshooting

### "Backend is sleeping" (Takes 30+ seconds)
**Cause:** Render free tier puts inactive services to sleep
**Fix:** Wait 30-60 seconds for it to wake up, then try again

### "CORS Error"
**Cause:** Backend CORS not configured for your domain
**Fix:** Check `backend/server.js` CORS settings include your domain

### "Network Error"
**Cause:** Backend is down or unreachable
**Fix:** 
1. Check backend health endpoint
2. Check Render dashboard for service status
3. Check Render logs for errors

### "Token validation failed"
**Cause:** Old/invalid token in browser
**Fix:**
1. Press F12
2. Go to Application > Local Storage
3. Delete the `token` item
4. Refresh page and try again

---

## Files Created

- ✅ `backend/create-demo-users.js` - Script to create demo accounts
- ✅ `SETUP_DEMO_USERS.md` - Detailed setup guide
- ✅ `FIX_INVALID_CREDENTIALS.md` - Quick fix guide
- ✅ `LOGIN_DEBUG_GUIDE.md` - Debugging guide
- ✅ `LOGIN_ISSUE_FIX.md` - Technical details

---

## Summary

**What was wrong:**
1. ~~Login redirect loop~~ ✅ FIXED
2. ~~API interceptor issues~~ ✅ FIXED
3. Demo users don't exist ⚠️ **YOU NEED TO FIX THIS**

**What you need to do:**
1. Go to Render Dashboard
2. Open Shell for your backend service
3. Run: `node create-demo-users.js`
4. Login with: player@demo.com / demo123

That's it! 🎉
