# MongoDB Connection Fix Guide 🔧

## Your Specific Problem

**Symptoms:**
- ✅ Signup works (returns success)
- ❌ Credentials don't save to MongoDB
- ❌ Can't login with existing MongoDB credentials

**Root Cause:**
Your Render backend is NOT connected to MongoDB properly.

---

## The Fix (5 Steps)

### Step 1: Check Your MongoDB Connection String

Your connection string MUST look like this:
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/inazuma-battle?retryWrites=true&w=majority
```

**Common mistakes:**
❌ Missing database name: `...mongodb.net/?retryWrites...`
✅ Correct: `...mongodb.net/inazuma-battle?retryWrites...`

❌ Wrong password: `...user:wrongpass@...`
✅ Correct: Use the exact password from MongoDB Atlas

❌ Special characters not encoded: `...user:Pass@123@...`
✅ Correct: `...user:Pass%40123@...` (@ becomes %40)

### Step 2: Fix MongoDB Atlas IP Whitelist

1. Go to https://cloud.mongodb.com
2. Click **"Network Access"** (left sidebar)
3. Check if `0.0.0.0/0` is in the list
4. If not, click **"Add IP Address"**
5. Select **"Allow Access from Anywhere"**
6. Enter: `0.0.0.0/0`
7. Click **"Confirm"**

**Why?** Render uses dynamic IPs, so we need to allow all IPs.

### Step 3: Verify Database User Permissions

1. In MongoDB Atlas, click **"Database Access"**
2. Find your user
3. Check permissions: Should be **"Read and write to any database"**
4. If not, click **"Edit"**
5. Select **"Built-in Role"** → **"Read and write to any database"**
6. Click **"Update User"**

### Step 4: Update Render Environment Variable

1. Go to https://dashboard.render.com
2. Select your backend service
3. Click **"Environment"** tab
4. Find `MONGODB_URI`
5. Click **"Edit"**
6. Paste your CORRECT connection string
7. Click **"Save Changes"**
8. Service will auto-redeploy

**Wait 2-3 minutes for redeploy to complete.**

### Step 5: Verify Connection

1. Go to **"Logs"** tab in Render
2. Look for:
   ```
   ✅ MongoDB Connected
   ```
3. If you see this, you're good!
4. If you see errors, read them carefully

---

## Test Your Fix

### Test 1: Check Render Logs

Look for this in logs:
```
✅ MongoDB Connected
```

If you see:
```
❌ MongoDB Connection Error
```

Then check the error message. Common errors:

**"Authentication failed"**
→ Wrong username or password

**"Connection timeout"**
→ IP not whitelisted (add 0.0.0.0/0)

**"Database not found"**
→ Missing database name in connection string

### Test 2: Register a New User

```bash
curl -X POST https://YOUR-APP.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "email": "testuser123@example.com",
    "password": "Test123!",
    "role": "player"
  }'
```

Should return:
```json
{
  "success": true,
  "token": "...",
  "user": { ... }
}
```

### Test 3: Check MongoDB Atlas

1. Go to MongoDB Atlas
2. Click **"Browse Collections"**
3. Select `inazuma-battle` database
4. Select `users` collection
5. You should see `testuser123` in the list!

**If you see the user → SUCCESS! MongoDB is connected!**

### Test 4: Login with New User

```bash
curl -X POST https://YOUR-APP.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser123@example.com",
    "password": "Test123!"
  }'
```

Should return a token.

---

## Fix Your Admin Credentials

Now that MongoDB is connected, let's create your admin account properly:

### Option 1: Create New Admin via API

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

**Save the response!** It contains your admin token.

### Option 2: Use Existing Admin in MongoDB

If you already have an admin user in MongoDB:

1. Go to MongoDB Atlas → Browse Collections
2. Find your admin user in `users` collection
3. Note the email address
4. **Problem:** The password is hashed, you can't see it

**Solution:** Reset the password by creating a new admin (Option 1).

---

## Special Characters in Password

If your MongoDB password has special characters, encode them:

| Character | Encoded | Example |
|-----------|---------|---------|
| @ | %40 | Pass@123 → Pass%40123 |
| : | %3A | Pass:123 → Pass%3A123 |
| / | %2F | Pass/123 → Pass%2F123 |
| ? | %3F | Pass?123 → Pass%3F123 |
| # | %23 | Pass#123 → Pass%23123 |
| [ | %5B | Pass[123 → Pass%5B123 |
| ] | %5D | Pass]123 → Pass%5D123 |

**Example:**
```
Original: mongodb+srv://user:P@ss#123@cluster.mongodb.net/inazuma-battle
Encoded:  mongodb+srv://user:P%40ss%23123@cluster.mongodb.net/inazuma-battle
```

---

## Still Not Working?

### Debug Checklist

Run through this checklist:

1. **MongoDB Atlas:**
   - [ ] Cluster is running (green status)
   - [ ] Database user exists
   - [ ] User has read/write permissions
   - [ ] Network access includes 0.0.0.0/0
   - [ ] Connection string is correct

2. **Render:**
   - [ ] Service is "Live" (green)
   - [ ] MONGODB_URI environment variable is set
   - [ ] Root directory is set to `backend`
   - [ ] Logs show "MongoDB Connected"
   - [ ] No errors in logs

3. **Connection String:**
   - [ ] Has `mongodb+srv://` prefix
   - [ ] Has correct username
   - [ ] Has correct password (encoded if special chars)
   - [ ] Has correct cluster URL
   - [ ] Has `/inazuma-battle` database name
   - [ ] Has `?retryWrites=true&w=majority` suffix

### Get Your Exact Connection String

1. Go to MongoDB Atlas
2. Click **"Connect"**
3. Choose **"Connect your application"**
4. Copy the string
5. Replace `<password>` with your actual password
6. Add `/inazuma-battle` before the `?`

**Final format:**
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/inazuma-battle?retryWrites=true&w=majority
```

### Test Connection Locally

Run this on your computer:

```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/inazuma-battle?retryWrites=true&w=majority
JWT_SECRET=test123
PORT=5000
```

Run:
```bash
npm start
```

If it works locally but not on Render:
→ The connection string is correct
→ Problem is with Render environment variables
→ Double-check MONGODB_URI in Render dashboard

---

## Success Indicators

You'll know it's working when:

✅ Render logs show "✅ MongoDB Connected"
✅ New registrations appear in MongoDB Atlas
✅ You can login with registered credentials
✅ Health endpoint returns 200 OK
✅ No connection errors in logs

---

## Quick Test Script

Save this as `test-mongo.js`:

```javascript
const mongoose = require('mongoose');

const MONGODB_URI = 'YOUR_CONNECTION_STRING_HERE';

console.log('Testing MongoDB connection...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ SUCCESS! MongoDB connected');
    console.log('Database:', mongoose.connection.name);
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ FAILED! Cannot connect');
    console.log('Error:', err.message);
    process.exit(1);
  });
```

Run:
```bash
node test-mongo.js
```

If this works, use the EXACT same connection string in Render.

---

## Need More Help?

1. **Check Render Logs:**
   - Dashboard → Your Service → Logs
   - Look for specific error messages

2. **Check MongoDB Atlas Metrics:**
   - Dashboard → Metrics
   - See if connections are being attempted

3. **Test Connection String:**
   - Use the test script above
   - Verify it works locally first

4. **Common Issues:**
   - Wrong password (most common!)
   - Missing database name
   - IP not whitelisted
   - Special characters not encoded

---

**Remember:** Once MongoDB is connected, your existing admin credentials in the database will work for login!
