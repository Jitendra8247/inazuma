# Registration Error Fix Guide

## Error Message
```
Registration Failed
Registration validation failed: inGameId: In-game ID is required
```

## Root Cause
The error is happening because:
1. The **deployed backend on Render** still has the OLD registration code
2. The **frontend** is sending the NEW format with nested player objects
3. The old backend expects `inGameId` field, but the new format uses `player.bgmiId`

## Solution

You have **TWO options**:

### Option 1: Redeploy Backend to Render (Recommended)

1. **Commit your changes** to Git:
   ```bash
   git add .
   git commit -m "Update registration forms for Solo/Duo/Squad modes"
   git push
   ```

2. **Redeploy on Render**:
   - Go to your Render dashboard
   - Find your backend service
   - Click "Manual Deploy" → "Deploy latest commit"
   - Wait for deployment to complete (~2-3 minutes)

3. **Test again** - Registration should now work!

### Option 2: Test Locally First

1. **Start your local backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Update frontend API URL** to point to localhost:
   - Edit `src/services/api.ts`
   - Change `baseURL` to `http://localhost:5000/api`

3. **Test registration** locally

4. **Once working**, redeploy to Render (Option 1)

## Testing the Fix

### Test Registration Locally:
```bash
cd backend
node test-registration.js
```

This will:
- Connect to your MongoDB
- Find a tournament
- Create a test registration
- Validate the data structure
- Show any errors
- Clean up test data

### Expected Output:
```
✅ Connected to MongoDB
📋 Testing with tournament: BGMI Championship
   Mode: Solo
📝 Test data: {...}
🔄 Creating test registration...
✅ Validation passed!
✅ Registration saved successfully!
🧹 Test registration cleaned up
👋 Disconnected from MongoDB
```

## What Changed in the Code

### Backend (`backend/models/Registration.js`):
- **OLD**: Single `inGameId` field
- **NEW**: Nested player objects with `inGameName` and `bgmiId`

### Frontend (`src/pages/Registration.tsx`):
- **OLD**: Single form for all modes
- **NEW**: Dynamic forms based on tournament mode

### Data Structure:

**Solo Mode:**
```json
{
  "mode": "Solo",
  "player": {
    "inGameName": "ProGamer",
    "bgmiId": "12345678"
  }
}
```

**Duo Mode:**
```json
{
  "mode": "Duo",
  "teamName": "Thunder Squad",
  "player1": { "inGameName": "...", "bgmiId": "..." },
  "player2": { "inGameName": "...", "bgmiId": "..." }
}
```

**Squad Mode:**
```json
{
  "mode": "Squad",
  "teamName": "Elite Warriors",
  "player1": { "inGameName": "...", "bgmiId": "..." },
  "player2": { "inGameName": "...", "bgmiId": "..." },
  "player3": { "inGameName": "...", "bgmiId": "..." },
  "player4": { "inGameName": "...", "bgmiId": "..." }
}
```

## Debugging Steps

If registration still fails after redeploying:

1. **Check backend logs** on Render:
   - Go to Render dashboard
   - Click on your backend service
   - Click "Logs" tab
   - Look for "Registration request body:" log

2. **Check browser console**:
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for any errors

3. **Check Network tab**:
   - Open browser DevTools (F12)
   - Go to Network tab
   - Find the `/api/registrations` request
   - Check the request payload
   - Check the response

## Quick Checklist

- [ ] Backend code updated locally
- [ ] Frontend code updated locally
- [ ] Test registration script runs successfully
- [ ] Changes committed to Git
- [ ] Backend redeployed on Render
- [ ] Frontend redeployed on Vercel (if needed)
- [ ] Test registration on live site
- [ ] Verify data saved correctly in MongoDB

## Need Help?

If you're still seeing errors:
1. Run the test script: `node backend/test-registration.js`
2. Check the backend logs on Render
3. Share the error message from browser console

---

**Status**: Fix Ready ✅
**Action Required**: Redeploy backend to Render
**Estimated Time**: 5 minutes

