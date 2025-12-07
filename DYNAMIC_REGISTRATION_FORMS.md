# Dynamic Tournament Registration Forms ✅

## Overview
Implemented dynamic registration forms that adapt based on tournament mode (Solo/Duo/Squad). Each mode now collects the appropriate player information.

## Changes Made

### Backend Changes

#### 1. Updated Registration Model (`backend/models/Registration.js`)
**New Schema Structure:**
- **Solo Mode**: Single player with in-game name and BGMI ID
- **Duo Mode**: Team name + 2 players (each with in-game name and BGMI ID)
- **Squad Mode**: Team name + 4 players (each with in-game name and BGMI ID)

**Schema Fields:**
```javascript
{
  mode: 'Solo' | 'Duo' | 'Squad',
  
  // Solo mode
  player: {
    inGameName: String,
    bgmiId: String
  },
  
  // Duo/Squad modes
  teamName: String,
  player1: { inGameName, bgmiId },
  player2: { inGameName, bgmiId },
  player3: { inGameName, bgmiId }, // Squad only
  player4: { inGameName, bgmiId }, // Squad only
  
  // Contact info (all modes)
  email: String,
  phone: String
}
```

#### 2. Updated Registration Route (`backend/routes/registrations.js`)
**Changes:**
- Validates tournament mode matches registration mode
- Builds registration data dynamically based on mode
- Handles Solo/Duo/Squad data structures
- Maintains wallet deduction logic

### Frontend Changes

#### 1. Updated Registration Page (`src/pages/Registration.tsx`)
**Dynamic Form Rendering:**
- Shows different fields based on tournament mode
- Three separate validation schemas (Solo/Duo/Squad)
- Mode-specific form sections with visual grouping

**Solo Mode Form:**
```
- In-Game Name
- BGMI ID
- Email
- Phone
```

**Duo Mode Form:**
```
- Team Name
- Player 1: In-Game Name, BGMI ID
- Player 2: In-Game Name, BGMI ID
- Email
- Phone
```

**Squad Mode Form:**
```
- Team Name
- Player 1: In-Game Name, BGMI ID
- Player 2: In-Game Name, BGMI ID
- Player 3: In-Game Name, BGMI ID
- Player 4: In-Game Name, BGMI ID
- Email
- Phone
```

#### 2. Updated TournamentContext (`src/context/TournamentContext.tsx`)
- Changed `registerForTournament` to accept any registration payload
- Passes entire registration object to API

#### 3. Updated API Service (`src/services/api.ts`)
- Simplified `registerForTournament` to accept any data structure
- Backend handles validation

## Features

✅ **Mode Detection**: Automatically detects tournament mode
✅ **Dynamic Forms**: Shows appropriate fields for each mode
✅ **Visual Grouping**: Player sections clearly separated
✅ **Validation**: Mode-specific validation rules
✅ **Responsive**: Works on all screen sizes
✅ **User-Friendly**: Clear labels and placeholders
✅ **Error Handling**: Detailed error messages

## How It Works

### Registration Flow:

1. **User clicks "Register Now"** on tournament details page
2. **System detects tournament mode** (Solo/Duo/Squad)
3. **Form renders with appropriate fields**:
   - Solo: 1 player section
   - Duo: Team name + 2 player sections
   - Squad: Team name + 4 player sections
4. **User fills in details** for all required players
5. **Validation runs** based on mode-specific schema
6. **Data submitted** to backend with mode information
7. **Backend validates** mode matches tournament
8. **Registration created** with appropriate structure
9. **Wallet deducted** if entry fee exists
10. **Success!** User registered for tournament

### Data Structure Examples:

**Solo Registration:**
```json
{
  "tournamentId": "123",
  "mode": "Solo",
  "player": {
    "inGameName": "ProGamer",
    "bgmiId": "12345678"
  },
  "email": "player@example.com",
  "phone": "9876543210"
}
```

**Duo Registration:**
```json
{
  "tournamentId": "123",
  "mode": "Duo",
  "teamName": "Thunder Squad",
  "player1": {
    "inGameName": "Player1",
    "bgmiId": "11111111"
  },
  "player2": {
    "inGameName": "Player2",
    "bgmiId": "22222222"
  },
  "email": "team@example.com",
  "phone": "9876543210"
}
```

**Squad Registration:**
```json
{
  "tournamentId": "123",
  "mode": "Squad",
  "teamName": "Elite Warriors",
  "player1": {
    "inGameName": "Player1",
    "bgmiId": "11111111"
  },
  "player2": {
    "inGameName": "Player2",
    "bgmiId": "22222222"
  },
  "player3": {
    "inGameName": "Player3",
    "bgmiId": "33333333"
  },
  "player4": {
    "inGameName": "Player4",
    "bgmiId": "44444444"
  },
  "email": "team@example.com",
  "phone": "9876543210"
}
```

## Validation Rules

### In-Game Name:
- Minimum 3 characters
- Maximum 20 characters
- Required for all players

### BGMI ID:
- Minimum 5 characters
- Maximum 20 characters
- Required for all players

### Team Name (Duo/Squad only):
- Minimum 3 characters
- Maximum 30 characters
- Only letters, numbers, spaces, underscores, hyphens
- Required for Duo and Squad modes

### Email:
- Valid email format
- Required for all modes

### Phone:
- 10-digit Indian phone number
- Must start with 6-9
- Required for all modes

## UI/UX Improvements

1. **Mode Badge**: Shows tournament mode at top of form
2. **Grouped Sections**: Each player has their own visual section
3. **Clear Labels**: "Player 1", "Player 2", etc.
4. **Consistent Layout**: Same structure for all player sections
5. **Contact Section**: Separated with border for clarity
6. **Responsive Design**: Stacks nicely on mobile
7. **Error Messages**: Inline validation feedback

## Files Modified

### Backend:
1. `backend/models/Registration.js` - New schema structure
2. `backend/routes/registrations.js` - Updated registration logic

### Frontend:
1. `src/pages/Registration.tsx` - Dynamic form rendering
2. `src/context/TournamentContext.tsx` - Updated context
3. `src/services/api.ts` - Simplified API call

## Testing Checklist

✅ Solo tournament registration works
✅ Duo tournament registration works
✅ Squad tournament registration works
✅ Validation works for all modes
✅ Team name required for Duo/Squad
✅ Team name not shown for Solo
✅ Correct number of player fields shown
✅ All fields validate properly
✅ Error messages display correctly
✅ Form submits successfully
✅ Backend saves correct structure
✅ Wallet deduction still works
✅ Registration count updates
✅ Responsive on mobile
✅ Responsive on desktop

## Database Migration Note

⚠️ **Important**: Existing registrations in the database use the old schema. They will continue to work but won't have the new structure. Consider:

1. **Option 1**: Keep old registrations as-is (they'll still display)
2. **Option 2**: Run a migration script to convert old data
3. **Option 3**: Clear old registrations (if in development)

For production, old registrations should be migrated or kept with a flag indicating old format.

## Future Enhancements (Optional)

1. **Auto-fill**: Pre-fill player 1 with user's saved game info
2. **Save Team**: Allow saving team compositions for future use
3. **Invite Players**: Send invites to team members
4. **Verification**: Verify BGMI IDs are valid
5. **Team Management**: Edit team members before tournament starts
6. **Player Profiles**: Link to player profiles/stats

## Benefits

✅ **Accurate Data**: Collects proper information for each mode
✅ **Better Organization**: Clear team structure in database
✅ **Improved UX**: Users know exactly what to fill
✅ **Scalable**: Easy to add more modes in future
✅ **Validation**: Ensures data quality
✅ **Flexible**: Supports all tournament types

---

**Status**: ✅ Complete and Working
**Deployment**: Ready for production
**Backend**: Updated schema and routes
**Frontend**: Dynamic forms implemented
**Testing**: All modes working correctly

