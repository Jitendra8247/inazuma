# Auto-Archive Tournaments Feature ✅

## Overview
Tournaments are automatically archived after their start time passes. Archived tournaments are hidden from public view but remain visible to registered players in their "My Tournaments" section with a yellow blinking indicator.

## Features Implemented

### 1. Automatic Tournament Archiving ✅
- **Backend Scheduler**: Runs every 5 minutes to check for expired tournaments
- **Auto-Status Update**: Changes tournament status from `upcoming` to `completed` after start time
- **Timestamp Tracking**: Adds `archivedAt` timestamp when tournament is archived

### 2. Public Tournament Filtering ✅
- **Hidden from Browse**: Archived tournaments don't appear in public tournament listings
- **API Filter**: `/api/tournaments` endpoint excludes completed tournaments by default
- **Optional Include**: Can include archived with `?includeArchived=true` query parameter

### 3. My Tournaments View ✅
- **Registered Players Only**: Players who registered can still see their archived tournaments
- **Dedicated Endpoint**: `/api/tournaments/my-tournaments` returns all tournaments user registered for
- **Yellow Blinking Indicator**: Visual indicator shows "Previous Tournament" for completed ones
- **Full Access**: Players can view details, room credentials, and results

### 4. Visual Indicators ✅
- **Yellow Dot**: Animated blinking dot in top-right corner of tournament card
- **Label**: "Previous Tournament" text next to the indicator
- **Animation**: Combines `animate-pulse` and `animate-ping` for attention-grabbing effect

## Files Created

### Backend
1. **backend/utils/tournamentScheduler.js**
   - `archiveExpiredTournaments()` - Checks and archives expired tournaments
   - `startTournamentScheduler()` - Starts the 5-minute interval scheduler
   - Logs all archiving activities

### Documentation
1. **AUTO_ARCHIVE_TOURNAMENTS_FEATURE.md** (this file)

## Files Modified

### Backend
1. **backend/server.js**
   - Added tournament scheduler initialization on server start
   - Scheduler runs automatically in background

2. **backend/models/Tournament.js**
   - Added `archivedAt` field (Date, default: null)
   - Tracks when tournament was auto-archived

3. **backend/routes/tournaments.js**
   - Updated `GET /api/tournaments` to exclude completed tournaments by default
   - Added `GET /api/tournaments/my-tournaments` endpoint for registered players
   - Added mongoose import for Registration model access

### Frontend
1. **src/data/mockData.ts**
   - Added `archivedAt?: string` to Tournament interface

2. **src/services/api.ts**
   - Added `getMyTournaments()` method to tournamentsAPI

3. **src/context/TournamentContext.tsx**
   - Added `myTournaments` state for user's registered tournaments
   - Added `refreshMyTournaments()` method
   - Added `archivedAt` to tournament formatting
   - Updated context interface and provider

4. **src/pages/MyTournaments.tsx**
   - Updated to use `myTournaments` from context
   - Added yellow blinking indicator for completed tournaments
   - Shows "Previous Tournament" label
   - Positioned indicator in top-right corner with absolute positioning

## How It Works

### Archiving Process
```
1. Server starts → Tournament scheduler initializes
2. Every 5 minutes → Check for expired tournaments
3. Find tournaments where: status = 'upcoming' AND startDate < now
4. Update status to 'completed' and set archivedAt timestamp
5. Log archiving activity
```

### Public View
```
User visits /tournaments
  ↓
GET /api/tournaments (no includeArchived param)
  ↓
Backend filters: status != 'completed'
  ↓
Only active tournaments shown
```

### Player View
```
Player visits /my-tournaments
  ↓
GET /api/tournaments/my-tournaments (authenticated)
  ↓
Backend finds user's registrations
  ↓
Returns ALL tournaments (including archived)
  ↓
Frontend shows with yellow indicator for completed ones
```

## API Endpoints

### GET /api/tournaments
**Access**: Public  
**Description**: Get all active tournaments (excludes archived by default)  
**Query Params**:
- `status` - Filter by status
- `game` - Filter by game
- `mode` - Filter by mode
- `includeArchived` - Set to 'true' to include completed tournaments

**Response**:
```json
{
  "success": true,
  "count": 5,
  "tournaments": [...]
}
```

### GET /api/tournaments/my-tournaments
**Access**: Private (requires authentication)  
**Description**: Get all tournaments user is registered for (includes archived)  
**Response**:
```json
{
  "success": true,
  "count": 3,
  "tournaments": [...]
}
```

## Visual Design

### Yellow Blinking Indicator
```tsx
{tournament.status === 'completed' && (
  <div className="absolute top-4 right-4 flex items-center gap-2">
    <div className="relative">
      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
      <div className="absolute inset-0 w-3 h-3 bg-yellow-500 rounded-full animate-ping"></div>
    </div>
    <span className="text-xs font-medium text-yellow-500">Previous Tournament</span>
  </div>
)}
```

**Styling**:
- Yellow color (#eab308 - yellow-500)
- 3x3 pixel dot
- Dual animation: pulse (fade in/out) + ping (expand/fade)
- Positioned absolutely in top-right corner
- Text label for clarity

## Scheduler Configuration

**Interval**: 5 minutes (300,000 ms)  
**Runs**: Automatically on server start  
**Logs**: Console output for monitoring

To change interval, modify in `backend/utils/tournamentScheduler.js`:
```javascript
const FIVE_MINUTES = 5 * 60 * 1000; // Change this value
```

## Testing

### Test Auto-Archiving
1. Create a tournament with start date/time in the past
2. Wait up to 5 minutes for scheduler to run
3. Check server logs for archiving message
4. Verify tournament status changed to 'completed'
5. Verify tournament hidden from public browse page

### Test My Tournaments View
1. Login as a player
2. Register for a tournament
3. Wait for tournament to be archived (or manually set past date)
4. Go to "My Tournaments" page
5. **Expected**: See tournament with yellow blinking dot and "Previous Tournament" label

### Test Public Filtering
1. Logout or use incognito mode
2. Go to /tournaments page
3. **Expected**: Only see upcoming/ongoing tournaments
4. **Expected**: Archived tournaments not visible

## Benefits

✅ **Automatic Cleanup**: No manual intervention needed  
✅ **Clean Public View**: Users only see relevant active tournaments  
✅ **Player History**: Registered players keep access to their past tournaments  
✅ **Visual Clarity**: Clear indicator distinguishes past tournaments  
✅ **Scalable**: Handles any number of tournaments efficiently  
✅ **Reliable**: Runs automatically every 5 minutes  

## Future Enhancements

- Add manual archive button for organizers
- Add tournament results/leaderboard for archived tournaments
- Add email notifications before archiving
- Add configurable archive delay (e.g., archive 1 hour after start)
- Add statistics dashboard for archived tournaments
- Add export functionality for tournament history

## Status: COMPLETE ✅

All features implemented and tested. The system automatically:
- Archives tournaments after start time
- Hides them from public view
- Shows them to registered players with visual indicator
- Runs reliably in the background
