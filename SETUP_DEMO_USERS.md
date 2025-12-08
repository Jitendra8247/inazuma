# Setup Demo Users

## Problem
Getting "Invalid credentials" error when trying to login because demo users don't exist in the database.

## Solution
You need to create demo users in your MongoDB database.

## Option 1: Run the Script Locally (Recommended)

If you have the backend running locally:

```bash
cd backend
node create-demo-users.js
```

This will create:
- **player@demo.com** / demo123 (Player account)
- **organizer@demo.com** / demo123 (Organizer account)

## Option 2: Run on Render

1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your backend service (inazuma-back)
3. Go to the **Shell** tab
4. Run:
   ```bash
   node create-demo-users.js
   ```

## Option 3: Use MongoDB Compass

1. Open MongoDB Compass
2. Connect to your database using the connection string from `.env`
3. Go to the `users` collection
4. Click "Insert Document"
5. Add this document:

```json
{
  "username": "DemoPlayer",
  "email": "player@demo.com",
  "password": "$2a$10$YourHashedPasswordHere",
  "role": "player",
  "isActive": true,
  "stats": {
    "tournamentsPlayed": 0,
    "tournamentsWon": 0,
    "totalEarnings": 0,
    "rank": "Beginner"
  }
}
```

**Note**: The password needs to be hashed. It's easier to use the script (Option 1 or 2).

## Option 4: Register a New Account

1. Go to the Register page
2. Create a new player account
3. Use that account to login

## Verify Demo Users Exist

Run this script to check:

```bash
cd backend
node check-users.js
```

This will show all users in the database.

## What the Script Does

The `create-demo-users.js` script:
1. Connects to your MongoDB database
2. Checks if demo users already exist
3. If they exist, updates their passwords to `demo123`
4. If they don't exist, creates them with the correct credentials
5. Creates wallets for each user

## Credentials After Setup

After running the script, you can login with:

### Player Account
- **Email**: player@demo.com
- **Password**: demo123
- **Role**: player

### Organizer Account
- **Email**: organizer@demo.com
- **Password**: demo123
- **Role**: organizer

## Troubleshooting

### "Cannot connect to MongoDB"
- Check your `.env` file has `MONGODB_URI` set
- Verify the connection string is correct
- Make sure MongoDB Atlas allows connections from your IP

### "User already exists but password is wrong"
- The script will update the password to `demo123`
- Run the script again to reset passwords

### "Script runs but login still fails"
- Check browser console for errors
- Verify backend is using the same database
- Clear browser localStorage and try again
- Check backend logs for authentication errors

## Alternative: Create Your Own Account

If you don't want to use demo accounts:

1. Go to `/register` on your frontend
2. Create a new player account
3. Login with your new credentials

To create an organizer account, you'll need to:
1. Create a player account first
2. Use MongoDB Compass to change the `role` field from "player" to "organizer"

## Quick Test

After creating demo users, test the login:

```bash
# Test from command line
curl -X POST https://inazuma-back.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"player@demo.com","password":"demo123"}'
```

Expected response:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "username": "DemoPlayer",
    "email": "player@demo.com",
    "role": "player"
  }
}
```
