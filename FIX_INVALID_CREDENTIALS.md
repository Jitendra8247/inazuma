# Fix "Invalid Credentials" Error

## The Issue
You're getting "Invalid credentials" because the demo users don't exist in your database.

## Quick Fix (Choose One)

### Option A: Create Demo Users via Render Shell

1. Go to https://dashboard.render.com
2. Click on your backend service: **inazuma-back**
3. Click the **Shell** tab at the top
4. Run this command:
   ```bash
   node create-demo-users.js
   ```
5. Wait for success message
6. Try logging in again with:
   - Email: `player@demo.com`
   - Password: `demo123`

### Option B: Register a New Account

1. Go to your website
2. Click "Create one" (Register link)
3. Fill in the registration form:
   - Username: anything you want
   - Email: your email
   - Password: at least 6 characters
4. Click "Create Account"
5. Login with your new credentials

### Option C: Run Script Locally (If Backend is Local)

```bash
cd backend
node create-demo-users.js
```

## Verify Users Exist

To check what users are in your database:

```bash
cd backend
node check-users.js
```

This will show all users and their details.

## What Happened?

Your database was likely cleared or reset, removing all users including the demo accounts. The login page shows demo credentials, but those users don't exist in the database yet.

## After Creating Demo Users

You'll have these accounts:

**Player Account:**
- Email: player@demo.com
- Password: demo123
- Can register for tournaments, view wallet, etc.

**Organizer Account:**
- Email: organizer@demo.com  
- Password: demo123
- Can create tournaments, manage players, etc.

## Still Not Working?

1. **Check Backend is Running:**
   - Open: https://inazuma-back.onrender.com/api/health
   - Should see: `{"status":"OK",...}`

2. **Check Browser Console:**
   - Press F12
   - Look for error messages
   - Share the error if you need help

3. **Clear Browser Data:**
   - F12 > Application > Local Storage
   - Clear all items
   - Refresh and try again

4. **Verify Database Connection:**
   - Check Render logs for MongoDB connection errors
   - Verify MONGODB_URI environment variable is set

## Need an Organizer Account?

If you registered as a player but need organizer access:

1. Login to MongoDB Atlas
2. Find your user in the `users` collection
3. Change `role` from "player" to "organizer"
4. Logout and login again

Or run this in Render Shell:
```bash
node upgrade-to-admin.js
```
Then enter your email when prompted.
