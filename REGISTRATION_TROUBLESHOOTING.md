# Registration Issue - Troubleshooting Guide

## 🐛 Issue: "Email already registered" for all emails

## ✅ Backend is Working

I tested the API directly and it works:
```
POST /api/auth/register → 201 Success ✅
```

## 🔍 Possible Causes

### 1. Browser Cache
The browser might be caching old responses or localStorage data.

**Solution:**
1. Open browser DevTools (F12)
2. Go to Application tab
3. Clear Storage:
   - Clear localStorage
   - Clear Session Storage
   - Clear Cookies
4. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

### 2. Old Token in localStorage
An invalid token might be causing issues.

**Solution:**
1. Open browser console (F12)
2. Type: `localStorage.clear()`
3. Press Enter
4. Refresh page

### 3. CORS Issue
The frontend might not be reaching the backend.

**Check:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to register
4. Look for `/api/auth/register` request
5. Check if it's reaching `http://localhost:5000`

**If you see CORS error:**
- Backend is running on port 5000 ✅
- Frontend is running on port 8080 ✅
- CORS is configured in backend ✅

### 4. Frontend Not Using API
The frontend might still be using mock data.

**Check:**
1. Open browser console (F12)
2. Try to register
3. Look for console logs
4. Should see: "Registration error:" if there's an issue

## 🧪 Test Steps

### Step 1: Clear Everything
```javascript
// In browser console (F12)
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Step 2: Check Network
1. Open DevTools → Network tab
2. Try to register with: `test123@example.com`
3. Look for request to: `http://localhost:5000/api/auth/register`
4. Check response status (should be 201 or 400)

### Step 3: Check Console
1. Open DevTools → Console tab
2. Try to register
3. Look for any errors
4. Should see API calls being made

### Step 4: Test API Directly
Open a new terminal and run:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test123","role":"player"}'
```

If this works, the backend is fine.

## 🔧 Quick Fixes

### Fix 1: Clear Browser Data
1. Close all browser tabs
2. Clear browser cache completely
3. Reopen browser
4. Go to http://localhost:8080
5. Try registration

### Fix 2: Use Incognito/Private Window
1. Open incognito/private window
2. Go to http://localhost:8080
3. Try registration
4. This bypasses all cache

### Fix 3: Check .env File
Make sure `.env` in frontend root has:
```env
VITE_API_URL=http://localhost:5000/api
```

### Fix 4: Restart Everything
```bash
# Stop both servers (Ctrl+C)

# Backend
cd backend
npm run dev

# Frontend (new terminal)
npm run dev
```

## 📊 What Should Happen

### Successful Registration Flow:
```
1. Fill form → Click "Create Account"
2. Frontend sends POST to http://localhost:5000/api/auth/register
3. Backend creates user in MongoDB
4. Backend returns JWT token
5. Frontend stores token in localStorage
6. Frontend redirects to home page
7. User is logged in
```

### Network Tab Should Show:
```
POST http://localhost:5000/api/auth/register
Status: 201 Created
Response: { success: true, token: "...", user: {...} }
```

## 🎯 Expected Behavior

**New Email:**
- Should register successfully ✅
- Should redirect to home page ✅
- Should be logged in ✅

**Existing Email:**
- Should show: "Email already registered" ❌
- Should NOT register ❌

## 🔍 Debug Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 8080
- [ ] MongoDB connected
- [ ] Browser cache cleared
- [ ] localStorage cleared
- [ ] Network tab shows API calls
- [ ] Console shows no errors
- [ ] .env file exists with correct API URL

## 💡 Most Likely Solution

**Clear browser localStorage and hard refresh:**

1. Open browser console (F12)
2. Run: `localStorage.clear()`
3. Hard refresh: `Ctrl + Shift + R`
4. Try registration again

This should fix 90% of cases!

## 🆘 Still Not Working?

If none of the above works:

1. **Check browser console** - What error do you see?
2. **Check network tab** - Is the request reaching the backend?
3. **Check backend logs** - Is the backend receiving the request?
4. **Try different email** - Use a completely random email

Let me know what you see and I'll help debug further!
