# Troubleshooting Network Error - Complete Guide

## Current Status

✅ Backend server running on port 5000
✅ Frontend server running on port 8080
✅ .env file configured with VITE_API_URL
✅ CORS configured for port 8080
✅ Direct API test works (curl/Invoke-RestMethod)
❌ Browser login/signup shows "Network Error"

## Debug Steps Added

I've added console logging to help diagnose the issue. When you open the browser console (F12), you should see:

### 1. API Configuration Log
```
🔧 API Configuration: {
  VITE_API_URL: "http://localhost:5000/api",
  API_URL: "http://localhost:5000/api",
  mode: "development"
}
```

### 2. Login Attempt Log
```
🔐 Attempting login to: http://localhost:5000/api/auth/login
```

### 3. Success or Error
Either:
```
✅ Login response: { success: true, token: "...", user: {...} }
```
Or:
```
❌ Login error: {
  message: "...",
  response: {...},
  status: ...,
  url: "..."
}
```

## What to Check in Browser Console

### Step 1: Open Browser DevTools
1. Open browser (Chrome/Edge/Firefox)
2. Press F12 or Right-click → Inspect
3. Go to **Console** tab
4. Clear console (trash icon)

### Step 2: Try to Login
1. Enter email: `admin@inazuma.com`
2. Enter password: `Admin@2024`
3. Click Login
4. Watch the console

### Step 3: Check Network Tab
1. Go to **Network** tab in DevTools
2. Try login again
3. Look for request to `/auth/login`
4. Click on it to see details

## Common Issues & What Console Shows

### Issue 1: VITE_API_URL is undefined
**Console shows:**
```
🔧 API Configuration: {
  VITE_API_URL: undefined,
  API_URL: "http://localhost:5000/api",
  mode: "development"
}
```

**Cause:** .env file not loaded
**Solution:**
```powershell
# Stop frontend (Ctrl+C)
# Verify .env file exists and has correct content
Get-Content .env
# Should show: VITE_API_URL=http://localhost:5000/api

# Restart frontend
npm run dev
```

### Issue 2: Wrong API URL
**Console shows:**
```
🔐 Attempting login to: http://localhost:5173/api/auth/login
```

**Cause:** Using wrong port or URL
**Solution:** Check .env file has `http://localhost:5000/api`

### Issue 3: CORS Error
**Console shows:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/auth/login' 
from origin 'http://localhost:8080' has been blocked by CORS policy
```

**Cause:** Backend CORS not configured for port 8080
**Solution:** Already fixed in backend/server.js

### Issue 4: Network Error (Can't Reach Backend)
**Console shows:**
```
❌ Login error: {
  message: "Network Error",
  response: undefined,
  status: undefined
}
```

**Cause:** Backend not running or firewall blocking
**Solution:**
```powershell
# Check backend is running
curl http://localhost:5000/api/health

# If fails, restart backend
cd backend
npm run dev
```

### Issue 5: 401 Unauthorized
**Console shows:**
```
❌ Login error: {
  message: "Request failed with status code 401",
  response: { success: false, message: "Invalid credentials" },
  status: 401
}
```

**Cause:** Wrong password or user doesn't exist
**Solution:** Verify credentials or create user in database

### Issue 6: 500 Server Error
**Console shows:**
```
❌ Login error: {
  message: "Request failed with status code 500",
  response: { success: false, message: "..." },
  status: 500
}
```

**Cause:** Backend error (check backend console)
**Solution:** Look at backend terminal for error details

## Manual Testing Steps

### Test 1: Backend Health Check
```powershell
curl http://localhost:5000/api/health
```
Expected: `{"status":"OK","message":"Inazuma Battle API is running",...}`

### Test 2: Direct Login API Call
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"admin@inazuma.com","password":"Admin@2024"}'
```
Expected: `success: True, token: "..."`

### Test 3: Frontend Can Reach Backend
1. Open browser to `http://localhost:8080`
2. Open Console (F12)
3. Type: `fetch('http://localhost:5000/api/health').then(r => r.json()).then(console.log)`
4. Press Enter
Expected: Should log `{status: "OK", message: "..."}`

### Test 4: Check CORS
In browser console:
```javascript
fetch('http://localhost:5000/api/health', {
  method: 'GET',
  credentials: 'include'
}).then(r => r.json()).then(console.log).catch(console.error)
```
Expected: Should work without CORS error

## Files to Verify

### 1. Frontend .env
```bash
# Location: E:\Inazuma-Arena\.env
VITE_API_URL=http://localhost:5000/api
```

### 2. Backend .env
```bash
# Location: E:\Inazuma-Arena\backend\.env
PORT=5000
FRONTEND_URL=http://localhost:8080
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
```

### 3. Backend CORS (backend/server.js)
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8080',  // ← Must include this
    'http://localhost:3000'
  ],
  credentials: true
}));
```

### 4. Frontend API Service (src/services/api.ts)
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

## Nuclear Option: Complete Reset

If nothing works, do a complete reset:

### 1. Stop Everything
- Stop frontend server (Ctrl+C)
- Stop backend server (Ctrl+C)

### 2. Clear All Caches
```powershell
# Frontend
cd E:\Inazuma-Arena
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# Backend
cd E:\Inazuma-Arena\backend
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
```

### 3. Clear Browser Data
1. Open browser
2. Press Ctrl+Shift+Delete
3. Select:
   - Cached images and files
   - Cookies and site data
4. Time range: All time
5. Clear data

### 4. Restart Everything
```powershell
# Terminal 1 - Backend
cd E:\Inazuma-Arena\backend
npm run dev

# Terminal 2 - Frontend  
cd E:\Inazuma-Arena
npm run dev
```

### 5. Test in Incognito
- Open new Incognito/Private window
- Go to `http://localhost:8080`
- Try login

## What to Report

If still not working, please provide:

1. **Console Output** (from browser F12 → Console)
   - The API Configuration log
   - The login attempt log
   - Any error messages

2. **Network Tab** (from browser F12 → Network)
   - Status code of `/auth/login` request
   - Request URL
   - Response data

3. **Backend Console** (from backend terminal)
   - Any error messages
   - The login request log

4. **Environment Check**
   ```powershell
   # Run these and share output:
   Get-Content .env
   curl http://localhost:5000/api/health
   ```

## Expected Working Flow

When everything works correctly:

### Browser Console:
```
🔧 API Configuration: {
  VITE_API_URL: "http://localhost:5000/api",
  API_URL: "http://localhost:5000/api",
  mode: "development"
}

🔐 Attempting login to: http://localhost:5000/api/auth/login

✅ Login response: {
  success: true,
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: "...",
    username: "AdminOrganizer",
    email: "admin@inazuma.com",
    role: "organizer",
    ...
  }
}
```

### Network Tab:
```
Request URL: http://localhost:5000/api/auth/login
Status: 200 OK
Response: { success: true, token: "...", user: {...} }
```

### Backend Console:
```
POST /api/auth/login 200 45.123 ms - 456
```

---

**Next Steps:**
1. Open browser console (F12)
2. Try to login
3. Share what you see in the console
4. This will help identify the exact issue
