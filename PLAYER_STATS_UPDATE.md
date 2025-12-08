# Player Statistics Update System

## Changes Made

### 1. Updated Profile Statistics Display

**Career Statistics (3 cards):**
- ✅ Tournaments Played (auto-updates)
- ✅ Tournaments Won
- ✅ Total Earnings
- ❌ Current Rank (REMOVED)

**Performance Stats (2 cards):**
- ✅ Total Finishes (replaces Total Kills)
- ✅ Avg Finishes (calculated as: Total Finishes / Tournaments Played)
- ❌ Win Rate (REMOVED)
- ❌ Top 10 Rate (REMOVED)
- ❌ Avg Damage (REMOVED)
- ❌ Avg Survival (REMOVED)

### 2. Auto-Update System

Created `backend/utils/updatePlayerStats.js` that:
- Runs every 5 minutes
- Checks all tournaments
- When tournament start time + 40 minutes has passed:
  - Increments `tournamentsPlayed` for all registered players
  - Marks tournament as `statsUpdated: true` to prevent duplicate updates

### 3. Database Schema Updates

**User Model (`stats` object):**
```javascript
{
  tournamentsPlayed: Number,  // Auto-incremented
  tournamentsWon: Number,
  totalEarnings: Number,
  totalFinishes: Number,      // NEW - manually updated by organizer
  rank: String
}
```

**Tournament Model:**
```javascript
{
  // ... existing fields
  statsUpdated: Boolean  // NEW - tracks if stats were updated
}
```

## How It Works

### Automatic Tournament Played Update

1. **Player registers** for a tournament
2. **Tournament starts** at specified date/time
3. **After 40 minutes**, the system automatically:
   - Finds all confirmed registrations
   - Increments each player's `tournamentsPlayed` by 1
   - Marks tournament as `statsUpdated: true`

### Manual Stats Update

Organizers can manually update:
- `tournamentsWon` - When a player wins
- `totalFinishes` - Total kills/finishes in the tournament
- `totalEarnings` - Prize money earned

### Avg Finishes Calculation

Calculated automatically on the frontend:
```javascript
avgFinishes = totalFinishes / tournamentsPlayed
```

## Testing

### Test Auto-Update

1. Create a tournament with start time in the past (e.g., 1 hour ago)
2. Register for the tournament
3. Wait 5 minutes (or restart backend to trigger immediately)
4. Check your profile - `Tournaments Played` should increment

### Test Manual Update

Organizers can update player stats via admin panel or API:
```javascript
// Update player stats
PUT /api/users/:userId
{
  "stats": {
    "tournamentsWon": 5,
    "totalFinishes": 150,
    "totalEarnings": 50000
  }
}
```

## Files Modified

### Frontend:
- ✅ `src/pages/Profile.tsx` - Updated stats display
- ✅ `src/data/mockData.ts` - Added `totalFinishes` to User interface

### Backend:
- ✅ `backend/models/User.js` - Added `totalFinishes` field
- ✅ `backend/models/Tournament.js` - Added `statsUpdated` field
- ✅ `backend/utils/updatePlayerStats.js` - NEW - Auto-update system
- ✅ `backend/server.js` - Start stats updater on server start

## Important Notes

1. **Tournaments Played** updates automatically 40 minutes after tournament starts
2. **Total Finishes** must be updated manually by organizers
3. **Avg Finishes** is calculated automatically (Total Finishes / Tournaments Played)
4. The system runs every 5 minutes, so updates may take up to 5 minutes to appear
5. Restart backend to trigger immediate update check

## Next Steps

To fully implement this system, you may want to:
1. Create an admin panel for organizers to update player stats
2. Add API endpoints for bulk stat updates
3. Create a tournament results submission form
4. Add validation to prevent negative stats
