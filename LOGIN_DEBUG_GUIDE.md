# Login Issue Debug Guide

## Problem
Login shows something briefly then returns to login page.

## Possible Causes & Solutions

### 1. Backend Server is Sleeping (Render Free Tier)
**Symptom**: First login attempt fails, second attempt works
**Solution**: 
- Wait 30-60 seconds for the backend to wake up
- Try logging in again
- The backend URL is: `https://inazuma-back.onrender.com`

### 2. Check Backend Status
Open your browser console (F12) and look for:
- ❌ Network errors (red in Network tab)
- ❌ CORS errors
- ❌ 401 Unauthorized errors
- ❌ 500 Server errors

### 3. Test Backend Directly
Open this URL in your browser:
```
https://inazuma-back.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Inazuma Battle API is running",
  "timestamp": "2024-..."
}
```

If you get an error or timeout, the backend is down.

### 4. Check Browser Console Logs
After attempting login, check the console for:
```
🔐 Attempting login to: ...
✅ Login response: ...
```
or
```
❌ Login error: ...
```

### 5. Clear Browser Data
Sometimes cached tokens cause issues:
1. Open DevTools (F12)
2. Go to Application tab
3. Clear Local Storage
4. Refresh page
5. Try logging in again

### 6. Test with Demo Credentials
Try these credentials:
- **Player**: `player@demo.com` / `demo123`
- **Organizer**: `organizer@demo.com` / `demo123`

## What I Fixed

1. **Improved Error Handling**: The API interceptor now won't redirect during login attempts
2. **Better Token Validation**: Invalid tokens are cleared immediately
3. **Enhanced Logging**: Login attempts now log detailed information to console

## How to Debug

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try to login
4. Look for these messages:
   - `🔧 API Configuration:` - Shows API URL
   - `🔐 Attempting login to:` - Shows login attempt
   - `✅ Login response:` or `❌ Login error:` - Shows result

5. Go to Network tab
6. Look for the `/api/auth/login` request
7. Check:
   - Status code (should be 200)
   - Response body (should have `success: true`, `token`, and `user`)
   - Time taken (if > 30s, backend is waking up)

## Common Issues

### Issue: "Network Error"
**Cause**: Backend is down or sleeping
**Fix**: Wait 30-60 seconds, try again

### Issue: "Invalid credentials"
**Cause**: Wrong email/password or user doesn't exist
**Fix**: Use demo credentials or register a new account

### Issue: "CORS Error"
**Cause**: Backend CORS not configured for your domain
**Fix**: Check backend CORS settings in `backend/server.js`

### Issue: Redirects back to login immediately
**Cause**: Token validation failing
**Fix**: 
1. Clear localStorage
2. Check backend `/api/auth/me` endpoint
3. Verify JWT_SECRET is set in backend

## Quick Test Script

Open browser console and run:
```javascript
// Test backend health
fetch('https://inazuma-back.onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend is up:', d))
  .catch(e => console.error('❌ Backend is down:', e));

// Test login
fetch('https://inazuma-back.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'player@demo.com', password: 'demo123' })
})
  .then(r => r.json())
  .then(d => console.log('✅ Login works:', d))
  .catch(e => console.error('❌ Login failed:', e));
```

## If Nothing Works

1. Check if backend is deployed and running
2. Verify environment variables in Vercel
3. Check backend logs in Render dashboard
4. Restart backend service in Render
5. Clear all browser data and try again
