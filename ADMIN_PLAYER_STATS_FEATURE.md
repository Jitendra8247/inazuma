# Admin Player Stats Management

## Feature Overview

Organizers can now update player statistics including:
- ✅ Tournaments Won
- ✅ Total Earnings
- ✅ Total Finishes
- ℹ️ Tournaments Played (Auto-updated, read-only)
- ℹ️ Avg Finishes (Auto-calculated)

## How to Access

1. **Login as Organizer**
2. **Click "Player Stats"** in the navbar
3. **Search for a player** by name or email
4. **Click "Edit Stats"** on any player
5. **Update the values** and click "Save Changes"

## Features

### Player List View
- Shows all registered players
- Search by username or email
- Displays current stats for each player:
  - Tournaments Played (auto)
  - Tournaments Won
  - Total Earnings
  - Total Finishes
  - Avg Finishes (calculated)

### Edit Stats Dialog
- **Tournaments Played**: Read-only (auto-updated by system)
- **Tournaments Won**: Editable
- **Total Earnings**: Editable (in ₹)
- **Total Finishes**: Editable
- **Avg Finishes**: Auto-calculated (Total Finishes / Tournaments Played)

## Use Cases

### After Tournament Ends
1. Open Player Stats page
2. Find the winner
3. Update their stats:
   - Increment "Tournaments Won" by 1
   - Add prize money to "Total Earnings"
   - Add their kills/finishes to "Total Finishes"

### Bulk Updates
You can update multiple players one by one after a tournament:
- Winner: +1 won, +prize money, +finishes
- Runner-up: +prize money, +finishes
- Other players: +finishes

## API Endpoint

The feature uses:
```
PUT /api/users/:userId
{
  "stats": {
    "tournamentsWon": 5,
    "totalEarnings": 50000,
    "totalFinishes": 150
  }
}
```

## Files Created

- ✅ `src/pages/AdminPlayerStats.tsx` - Admin page for managing player stats
- ✅ Updated `src/App.tsx` - Added route
- ✅ Updated `src/components/layout/Navbar.tsx` - Added nav link

## Important Notes

1. **Tournaments Played** is automatically updated 40 minutes after tournament starts
2. **Avg Finishes** is calculated automatically: `totalFinishes / tournamentsPlayed`
3. Only **organizers** can access this page
4. Changes are saved immediately to the database
5. Players will see updated stats on their profile page

## Example Workflow

### Tournament Winner Update:
1. Tournament ends
2. Organizer goes to Player Stats
3. Searches for winner's username
4. Clicks "Edit Stats"
5. Updates:
   - Tournaments Won: 2 → 3
   - Total Earnings: 10000 → 20000
   - Total Finishes: 45 → 60
6. Clicks "Save Changes"
7. Player sees updated stats on their profile

## Security

- Only users with `role: 'organizer'` can access
- Protected route with authentication check
- Backend validates organizer role before allowing updates
