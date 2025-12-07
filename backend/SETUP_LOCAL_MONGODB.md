# Setup MongoDB for Local Development

## Quick Setup (5 minutes)

You have 2 options:

---

## Option 1: MongoDB Atlas (Recommended) ⭐

**Why?** 
- Free forever
- Works locally AND on Render
- No installation needed
- Same database everywhere

### Steps:

1. **Go to MongoDB Atlas**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Sign up (free)

2. **Create Free Cluster**
   - Click "Build a Database"
   - Choose "M0 FREE"
   - Select region closest to you
   - Click "Create"

3. **Create Database User**
   - Username: `inazuma_admin`
   - Password: Click "Autogenerate" and SAVE IT!
   - Click "Create User"

4. **Setup Network Access**
   - Click "Add IP Address"
   - Enter: `0.0.0.0/0` (allow all)
   - Click "Confirm"

5. **Get Connection String**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Add `/inazuma-battle` before the `?`

   **Example:**
   ```
   mongodb+srv://inazuma_admin:MyPassword123@cluster0.abc123.mongodb.net/inazuma-battle?retryWrites=true&w=majority
   ```

6. **Update backend/.env**
   - Open `backend/.env`
   - Replace the MONGODB_URI line with your connection string:
   ```
   MONGODB_URI=mongodb+srv://inazuma_admin:YourPassword@cluster0.xxxxx.mongodb.net/inazuma-battle?retryWrites=true&w=majority
   ```

7. **Restart Backend**
   ```bash
   cd backend
   npm start
   ```

8. **Look for Success**
   ```
   ✅ MongoDB Connected
   ```

---

## Option 2: Local MongoDB (Advanced)

**Why?**
- Works offline
- Faster for development

**Why Not?**
- Requires installation
- Different database for local vs Render
- More setup

### Steps:

1. **Download MongoDB**
   - Visit: https://www.mongodb.com/try/download/community
   - Download MongoDB Community Server
   - Install with default settings

2. **Start MongoDB**
   - Windows: MongoDB starts automatically as a service
   - Or run: `mongod`

3. **Verify backend/.env**
   ```
   MONGODB_URI=mongodb://localhost:27017/inazuma-battle
   ```

4. **Start Backend**
   ```bash
   cd backend
   npm start
   ```

---

## Troubleshooting

### Error: "MongoDB Connection Error"

**Check:**
1. Is MONGODB_URI set in `.env`?
2. Is MongoDB Atlas IP whitelist set to `0.0.0.0/0`?
3. Is password correct (no special characters or URL-encoded)?
4. Does connection string have `/inazuma-battle` database name?

### Error: "Operation buffering timed out"

This means MongoDB isn't reachable:
- For Atlas: Check network access whitelist
- For Local: Check if MongoDB is running

### Success Indicators

You'll know it's working when you see:
```
✅ MongoDB Connected
```

And NO errors about:
- "buffering timed out"
- "connection refused"
- "authentication failed"

---

## Recommendation

**Use MongoDB Atlas** - it's easier, free, and works everywhere!

Follow the steps in Option 1 above, then restart your backend.
