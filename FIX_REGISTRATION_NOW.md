# Fix Registration Error - Quick Guide

## The Error You're Seeing
```
Registration Failed
Registration validation failed: inGameId: In-game ID is required
```

## Why It's Happening
- ✅ Your **local code** is updated (frontend + backend)
- ❌ Your **Render backend** still has old code
- The frontend sends new format → old backend rejects it

## Fix It in 3 Steps

### Step 1: Commit Your Code
```bash
git add .
git commit -m "Update registration forms for Solo/Duo/Squad"
git push
```

### Step 2: Redeploy Backend on Render
1. Go to: https://dashboard.render.com
2. Click on `inazuma-back` service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait 2-3 minutes ⏳

### Step 3: Test Registration
1. Go to: https://inazuma1.vercel.app
2. Login as player
3. Register for a tournament
4. Should work now! ✅

## Alternative: Test Locally First

If you want to test before deploying:

### Terminal 1 - Start Backend:
```bash
cd backend
npm start
```

### Terminal 2 - Start Frontend:
```bash
npm run dev
```

### Update Frontend to Use Local Backend:
Create `.env.local` file in root:
```
VITE_API_URL=http://localhost:5000/api
```

Then restart frontend (Ctrl+C and `npm run dev` again).

## Verify It's Working

### Check Backend Logs on Render:
- Go to Render dashboard
- Click your service
- Click "Logs" tab
- Look for "Registration request body:" - this shows what data is received

### Check Browser Console:
- Press F12
- Go to Console tab
- Look for any red errors

### Check Network Tab:
- Press F12
- Go to Network tab
- Find `/api/registrations` request
- Check Response for error details

## What the New Forms Look Like

### Solo Tournament:
- In-Game Name
- BGMI ID
- Email
- Phone

### Duo Tournament:
- Team Name
- Player 1: In-Game Name, BGMI ID
- Player 2: In-Game Name, BGMI ID
- Email
- Phone

### Squad Tournament:
- Team Name
- Player 1-4: In-Game Name, BGMI ID (for each)
- Email
- Phone

## Still Not Working?

Run this test script to check if backend code is correct:
```bash
cd backend
node test-registration.js
```

This will test the registration model and show any validation errors.

---

**TL;DR**: 
1. Push code to Git
2. Redeploy backend on Render
3. Test registration
4. Done! 🎉

