# Connect Frontend to Backend - Complete Guide

## ✅ What I've Done

1. ✅ Created `src/services/api.ts` - API service layer
2. ✅ Created `.env` - Frontend environment variables
3. ✅ Installed `axios` - HTTP client library

## 🔌 Current Status

**Frontend:** Still using mock data (React Context)
**Backend:** Running with real MongoDB database

## 📋 Next Steps to Connect

You have **2 options**:

### Option 1: Quick Test (Recommended First)
Test the API directly without changing frontend code.

### Option 2: Full Integration
Replace all Context files with real API calls.

---

## 🧪 Option 1: Quick API Test

### Test Registration via API

Open a new terminal and run:

```bash
# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testplayer\",\"email\":\"test@example.com\",\"password\":\"Test123\",\"role\":\"player\"}"
```

**Or use Postman:**
- URL: `http://localhost:5000/api/auth/register`
- Method: POST
- Body (JSON):
```json
{
  "username": "testplayer",
  "email": "test@example.com",
  "password": "Test123",
  "role": "player"
}
```

### Check MongoDB Compass
Refresh your MongoDB Compass and you'll see the new user!

---

## 🔄 Option 2: Full Integration

This requires updating your Context files to use the API instead of mock data.

### Files That Need Updates:

1. **src/context/AuthContext.tsx**
   - Replace mock login/register with API calls
   - Use `authAPI.login()` and `authAPI.register()`

2. **src/context/TournamentContext.tsx**
   - Replace mock tournaments with API calls
   - Use `tournamentsAPI.getAllTournaments()`

3. **src/context/WalletContext.tsx**
   - Replace mock wallet with API calls
   - Use `walletsAPI.getMyWallet()`

### Example: Update AuthContext

**Current (Mock):**
```typescript
const login = async (email: string, password: string) => {
  // Mock data lookup
  const userData = mockUsers.get(email);
  // ...
};
```

**Updated (Real API):**
```typescript
import { authAPI } from '@/services/api';

const login = async (email: string, password: string) => {
  try {
    const response = await authAPI.login(email, password);
    setUser(response.user);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

---

## 🎯 What You Should Do Now

### Step 1: Test Backend API
Use Postman or curl to test:
- ✅ Registration: `POST /api/auth/register`
- ✅ Login: `POST /api/auth/login`
- ✅ Get tournaments: `GET /api/tournaments`

### Step 2: Verify in MongoDB Compass
- Connect to your MongoDB Atlas
- Check `inazuma-battle` database
- Look in `users` collection
- You should see new users appear

### Step 3: Decide on Integration
**Option A:** Keep mock data for now (faster development)
**Option B:** Integrate with backend (production-ready)

---

## 🔍 Why You Don't See New Signups

**Current Flow:**
```
Frontend Signup → React Context (Memory) → Lost on refresh
```

**After Integration:**
```
Frontend Signup → API Call → MongoDB → Permanent storage
```

---

## 🛠️ Quick Integration Example

Want me to update just the **AuthContext** to use real API?

This would make:
- ✅ Signups save to MongoDB
- ✅ Logins check MongoDB
- ✅ Users persist after refresh

**Say "yes" and I'll do it!**

---

## 📊 Current Architecture

```
┌─────────────┐
│  Frontend   │
│  (React)    │ ← Currently using mock data
└─────────────┘

┌─────────────┐
│   Backend   │
│  (Express)  │ ← Running and ready
└─────────────┘
      ↓
┌─────────────┐
│  MongoDB    │
│   Atlas     │ ← Database ready
└─────────────┘
```

---

## 🚀 Benefits of Full Integration

- ✅ Real data persistence
- ✅ Multi-device access
- ✅ Proper authentication
- ✅ Transaction history
- ✅ Admin controls
- ✅ Production-ready

---

## 📝 Summary

**What's Working:**
- ✅ Backend API running
- ✅ MongoDB connected
- ✅ API endpoints ready
- ✅ Frontend running

**What's Not Connected:**
- ❌ Frontend still uses mock data
- ❌ Signups don't reach database
- ❌ Data lost on refresh

**Solution:**
Update Context files to use `src/services/api.ts`

---

## 💡 Recommendation

1. **Test backend API first** (use Postman/curl)
2. **Verify data in MongoDB Compass**
3. **Then integrate frontend** (update Context files)

This way you know the backend works before changing frontend!

**Ready to integrate? Let me know!** 🚀
