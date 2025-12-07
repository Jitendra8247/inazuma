# Deploy Updated Backend to Render

## The Problem
Your frontend is sending the NEW registration format, but your Render backend still has the OLD code.

## The Solution
Redeploy your backend to Render with the updated code.

## Step-by-Step Deployment

### Method 1: Auto-Deploy from Git (Recommended)

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: Add dynamic registration forms for Solo/Duo/Squad modes"
   git push origin main
   ```

2. **Render will auto-deploy** (if you have auto-deploy enabled):
   - Go to https://dashboard.render.com
   - Find your `inazuma-back` service
   - Watch the "Events" tab for deployment progress
   - Wait 2-3 minutes for deployment to complete

3. **If auto-deploy is NOT enabled**:
   - Go to https://dashboard.render.com
   - Click on your `inazuma-back` service
   - Click "Manual Deploy" button (top right)
   - Select "Deploy latest commit"
   - Wait for deployment to complete

### Method 2: Manual Deploy (If Git not set up)

1. **Go to Render Dashboard**: https://dashboard.render.com

2. **Find your backend service**: `inazuma-back`

3. **Click "Manual Deploy"**

4. **Select "Clear build cache & deploy"**

5. **Wait for deployment** (~2-3 minutes)

## Verify Deployment

### Check Render Logs:
1. Go to your service on Render
2. Click "Logs" tab
3. Look for:
   ```
   🚀 Server running on port 5000
   ✅ MongoDB connected successfully
   ```

### Test the API:
Open this URL in your browser:
```
https://inazuma-back.onrender.com/api/auth/health
```

You should see a response (or 404 if health endpoint doesn't exist - that's okay).

### Test Registration:
1. Go to your frontend: https://inazuma1.vercel.app
2. Login as a player
3. Find a tournament
4. Click "Register Now"
5. Fill in the form
6. Submit

**Expected**: Registration should work! ✅

## Troubleshooting

### If deployment fails:

1. **Check Render logs** for errors
2. **Verify environment variables** are set:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `PORT` (should be 5000)
   - `NODE_ENV` (should be production)

3. **Check package.json** has correct start script:
   ```json
   {
     "scripts": {
       "start": "node server.js"
     }
   }
   ```

### If registration still fails after deployment:

1. **Check Render logs** for the registration request:
   - Look for "Registration request body:" log
   - This will show what data is being received

2. **Check browser console** for errors:
   - Press F12
   - Go to Console tab
   - Look for red errors

3. **Check Network tab**:
   - Press F12
   - Go to Network tab
   - Find the `/api/registrations` request
   - Check the "Response" tab for error details

## Environment Variables on Render

Make sure these are set correctly:

```
MONGODB_URI=mongodb+srv://jroy03062_db_user:Jitendra00852322@cluster0.czsplks.mongodb.net/test?retryWrites=true&w=majority
JWT_SECRET=82a783abc7522d94f3b9cb4ea89ea593d5a10a394bf1765ad7ba1c6107be6fd9
FRONTEND_URL=https://inazuma1.vercel.app
PORT=5000
NODE_ENV=production
```

## After Successful Deployment

1. ✅ Backend updated with new registration code
2. ✅ Frontend can register for tournaments
3. ✅ Solo/Duo/Squad modes work correctly
4. ✅ Data saved in correct format to MongoDB

## Quick Test Commands

### Test locally first:
```bash
# Terminal 1 - Start backend
cd backend
npm start

# Terminal 2 - Start frontend (in new terminal)
npm run dev
```

### Test registration format:
```bash
cd backend
node test-registration.js
```

---

**Next Steps**:
1. Commit and push your code
2. Wait for Render to deploy
3. Test registration on live site
4. Done! 🎉

