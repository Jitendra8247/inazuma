# Test Your Existing Login

Since you already have accounts in your MongoDB database, let's verify the login is working.

## Step 1: Check Backend is Connected to Your Database

Open this URL in your browser:
```
https://inazuma-back.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Inazuma Battle API is running",
  "timestamp": "..."
}
```

## Step 2: Test Login with Your Credentials

### Via Browser Console (F12):

```javascript
// Replace with your actual email and password
fetch('https://inazuma-back.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'YOUR_EMAIL@example.com',  // Replace this
    password: 'YOUR_PASSWORD'          // Replace this
  })
})
.then(r => r.json())
.then(d => console.log('Login Result:', d))
.catch(e => console.error('Login Error:', e));
```

### Expected Responses:

**✅ Success:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "YourUsername",
    "email": "your@email.com",
    "role": "player" or "organizer"
  }
}
```

**❌ Invalid Credentials:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**❌ User Not Found:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## Step 3: Check What's Happening

Open browser DevTools (F12) and try to login. Look for:

### In Console Tab:
```
🔧 API Configuration: { VITE_API_URL: "...", API_URL: "..." }
🔑 Login form submitted: { email: "..." }
🔐 Attempting login to: https://...
✅ Login response: { ... }
🔑 Login result: { success: true/false }
```

### In Network Tab:
1. Filter by "login"
2. Click on the `/api/auth/login` request
3. Check:
   - **Status**: Should be 200 (success) or 401 (invalid credentials)
   - **Response**: Shows the actual error message
   - **Request Payload**: Shows what email/password was sent

## Common Issues

### Issue 1: "Invalid credentials" but you're sure the password is correct

**Possible causes:**
1. Password was changed in database
2. Email has extra spaces or different case
3. Password is hashed differently

**Solution:**
Reset the password via "Forgot Password" link, or update it directly in MongoDB.

### Issue 2: Backend takes 30+ seconds to respond

**Cause:** Render free tier - backend is sleeping
**Solution:** Wait for it to wake up, then try again

### Issue 3: Email exists but with different password

**Solution:** Use the "Forgot Password" feature to reset it

## Check Your MongoDB Database

If you have access to MongoDB Atlas:

1. Login to https://cloud.mongodb.com
2. Go to your cluster
3. Click "Browse Collections"
4. Find the `users` collection
5. Look for your user document
6. Verify:
   - Email is correct (case-sensitive)
   - `isActive` is `true`
   - `role` is "player" or "organizer"

## Reset Password in Database

If you need to reset a password in MongoDB:

### Option A: Via Render Shell
```bash
node upgrade-to-admin.js
# Enter your email when prompted
# This will also upgrade you to organizer if needed
```

### Option B: Via MongoDB Atlas
You can't directly set a plain text password (it needs to be hashed). Better to use the forgot password feature or create a new account.

## Still Not Working?

Share these details:
1. What error message you see
2. Browser console logs (F12 > Console)
3. Network tab response for `/api/auth/login`
4. Whether the backend health check works

This will help identify the exact issue!
