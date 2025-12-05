# Tournament Archiving Bug Fix ✅

## Critical Bug Fixed

### The Problem
**Symptom**: Tournaments were being deleted/archived immediately after creation, even when the start time was in the future.

**Root Cause**: The scheduler was only comparing `startDate` (date only) without considering `startTime`. This meant:
- Tournament created: Dec 5, 2024 at 18:00 (6 PM)
- Scheduler checked: Is Dec 5, 2024 < Dec 5, 2024? 
- Result: FALSE (dates are equal)
- But if created yesterday with future time: Dec 4, 2024 < Dec 5, 2024?
- Result: TRUE → Archived immediately! ❌

### The Fix
Updated the scheduler to properly combine `startDate` + `startTime` before comparing with current datetime.

**Before**:
```javascript
// Only checked date, ignored time
startDate: { $lt: now }
```

**After**:
```javascript
// Combines date + time properly
const tournamentStartDateTime = combineDateAndTime(
  tournament.startDate,
  tournament.startTime
);
return tournamentStartDateTime < now;
```

## Files Modified

### 1. backend/utils/tournamentScheduler.js
- ✅ Added `combineDateAndTime()` helper function
- ✅ Changed to fetch all upcoming tournaments first
- ✅ Filter by combined date+time in JavaScript
- ✅ Better logging with actual start datetime

### 2. backend/scripts/testArchiving.js
- ✅ Shows start time in results
- ✅ Better output formatting

### 3. backend/scripts/checkTournamentStatus.js (NEW)
- ✅ Check tournament status without archiving
- ✅ Shows time until start for each tournament
- ✅ Identifies which would be archived

## How It Works Now

### Date + Time Combination
```javascript
function combineDateAndTime(dateStr, timeStr) {
  const date = new Date(dateStr);
  if (!timeStr) return date; // Fallback to date only
  
  const [hours, minutes] = timeStr.split(':');
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  date.setSeconds(0);
  date.setMilliseconds(0);
  
  return date;
}
```

### Archiving Logic
```javascript
1. Fetch all upcoming tournaments
2. For each tournament:
   - Combine startDate + startTime
   - Compare with current datetime
   - If past → mark for archiving
3. Archive only the expired ones
4. Log details with actual start datetime
```

## Testing

### Check Current Status (Safe - No Changes)
```bash
cd backend
node scripts/checkTournamentStatus.js
```

**Output Example**:
```
⏰ Current Time: 12/5/2024, 3:30:00 PM

📋 Found 2 upcoming tournaments:

1. Test Tournament
   ID: 507f1f77bcf86cd799439011
   Start Date: 12/5/2024
   Start Time: 18:00
   Combined: 12/5/2024, 6:00:00 PM
   Status: upcoming
   ✅ Active - Starts in 2h 30m

2. Past Tournament
   ID: 507f1f77bcf86cd799439012
   Start Date: 12/5/2024
   Start Time: 14:00
   Combined: 12/5/2024, 2:00:00 PM
   Status: upcoming
   ⚠️  EXPIRED - Would be archived!

📊 Summary:
   Total Upcoming: 2
   Would Archive: 1
   Still Active: 1
```

### Test Archiving (Actually Archives)
```bash
cd backend
node scripts/testArchiving.js
```

### Create Test Tournament
```bash
cd backend
node scripts/createPastTournament.js
```

## Verification Steps

### 1. Check Existing Tournaments
```bash
node backend/scripts/checkTournamentStatus.js
```
- Verify no active tournaments are marked for archiving
- Check times are calculated correctly

### 2. Create Future Tournament
1. Login as organizer
2. Create tournament with:
   - Date: Today
   - Time: 2 hours from now
3. Wait 1 minute
4. Check tournament still exists ✅
5. Check status is still 'upcoming' ✅

### 3. Create Past Tournament
1. Create tournament with:
   - Date: Today
   - Time: 1 hour ago
2. Wait 5 minutes (or run testArchiving.js)
3. Tournament should be archived ✅
4. Should not appear in public browse ✅
5. Should appear in "My Tournaments" with 🟡 ✅

## Edge Cases Handled

### No Start Time Set
```javascript
if (!timeStr) return date; // Uses date only, defaults to 00:00
```

### Timezone Considerations
- Uses server's local timezone
- Date objects handle timezone automatically
- Consistent across date creation and comparison

### Midnight Tournaments
- Start time "00:00" works correctly
- Properly combines with date

### Multi-day Tournaments
- Only checks start datetime
- End date not considered for archiving
- Can manually set status to 'ongoing' if needed

## Scheduler Behavior

### Frequency
- Runs every 5 minutes
- First run immediately on server start

### What It Does
```
Every 5 minutes:
1. Fetch all upcoming tournaments
2. For each tournament:
   - Combine date + time
   - Check if past current datetime
3. Archive expired ones
4. Log results with details
```

### Logging
```
⏰ No tournaments to archive
// or
📦 Archived 2 expired tournaments:
   - Tournament A (Started: 12/5/2024, 2:00:00 PM)
   - Tournament B (Started: 12/4/2024, 6:00:00 PM)
```

## Performance Impact

### Before (Broken)
- Single database query with date comparison
- Fast but incorrect

### After (Fixed)
- Fetch all upcoming tournaments
- Filter in JavaScript with proper date+time logic
- Slightly slower but correct
- Still very efficient (only processes upcoming tournaments)

### Optimization
If you have thousands of tournaments, consider:
- Adding a compound index on (status, startDate)
- Limiting query to tournaments starting within last 24 hours
- Caching results between runs

## Prevention

### For Developers
- Always test with future dates/times
- Use `checkTournamentStatus.js` before deploying
- Monitor server logs for unexpected archiving

### For Users
- Set realistic start times
- Don't create tournaments with past times (unless testing)
- Check "My Tournaments" if tournament disappears

## Rollback Plan

If issues persist, you can:

1. **Disable Scheduler Temporarily**
```javascript
// In backend/server.js, comment out:
// startTournamentScheduler();
```

2. **Restore Archived Tournaments**
```javascript
// Run in MongoDB:
db.tournaments.updateMany(
  { status: 'completed', archivedAt: { $exists: true } },
  { $set: { status: 'upcoming' }, $unset: { archivedAt: 1 } }
)
```

3. **Manual Status Management**
- Update tournament status manually via API
- Use organizer dashboard

## Status: FIXED ✅

The bug is now fixed. Tournaments will only be archived when both:
- ✅ Date has passed
- ✅ Time has passed
- ✅ Combined datetime < current datetime

## Quick Commands

```bash
# Check what would be archived (safe)
node backend/scripts/checkTournamentStatus.js

# Actually archive expired tournaments
node backend/scripts/testArchiving.js

# Create test tournament with past time
node backend/scripts/createPastTournament.js

# Restart server with fix
cd backend && npm start
```

---

**Bug Fixed**: December 5, 2025  
**Severity**: Critical  
**Impact**: All tournaments  
**Status**: Resolved ✅
