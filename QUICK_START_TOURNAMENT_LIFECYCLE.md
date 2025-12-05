# Quick Start - Tournament Lifecycle System

## What It Does
🤖 Automatically archives tournaments after their start time  
👁️ Hides archived tournaments from public view  
🎯 Shows archived tournaments to registered players only  
🟡 Adds yellow blinking indicator for past tournaments  

## Start Using It

### 1. Start Backend (Scheduler Auto-Starts)
```bash
cd backend
npm start
```

You'll see:
```
🚀 Server running on port 5000
🚀 Starting tournament scheduler...
✅ Tournament scheduler started (runs every 5 minutes)
```

### 2. That's It!
The system now automatically:
- Checks every 5 minutes for expired tournaments
- Archives them (changes status to 'completed')
- Hides them from public browse
- Shows them to registered players with yellow indicator

## Test It

### Quick Test (2 minutes)
```bash
# Create a tournament with past date
cd backend
node scripts/createPastTournament.js

# Archive it immediately (don't wait 5 minutes)
node scripts/testArchiving.js

# Check frontend:
# - Browse /tournaments → Should NOT see test tournament
# - My Tournaments → Should see it with 🟡 indicator (if registered)
```

### Manual Test
1. Login as organizer
2. Create tournament with start time in the past
3. Wait 5 minutes (or run `node scripts/testArchiving.js`)
4. Tournament automatically archived
5. Check public browse → Tournament hidden
6. Check My Tournaments → Tournament visible with 🟡

## Visual Indicator

### What Players See
```
┌────────────────────────────────────┐
│              🟡 Previous Tournament │
│  Tournament Name                   │
│  Status: Completed                 │
└────────────────────────────────────┘
```

### When It Shows
- ✅ Tournament status is 'completed'
- ✅ Player is registered for the tournament
- ✅ Viewing "My Tournaments" page

### When It Doesn't Show
- ❌ Tournament is still upcoming/ongoing
- ❌ Player not registered
- ❌ Viewing public browse page

## How It Works

```
Tournament Created
    ↓
Start Time Passes
    ↓
Scheduler Runs (every 5 min)
    ↓
Status: upcoming → completed
    ↓
Hidden from Public
    ↓
Visible to Registered Players Only
    ↓
Shows 🟡 Yellow Indicator
```

## Useful Commands

```bash
# Test archiving manually
node backend/scripts/testArchiving.js

# Create test tournament with past date
node backend/scripts/createPastTournament.js

# Check server logs
# Look for: "📦 Archived X expired tournaments"
```

## Troubleshooting

**Scheduler not running?**
- Check server logs for "Tournament scheduler started"
- Restart backend server

**Tournaments not archiving?**
- Run: `node backend/scripts/testArchiving.js`
- Check tournament startDate is in the past
- Check tournament status is 'upcoming'

**Yellow indicator not showing?**
- Check tournament status is 'completed'
- Check you're registered for the tournament
- Check you're on "My Tournaments" page

## That's It!
The system runs automatically. No configuration needed. Just start your backend and it works! 🚀
