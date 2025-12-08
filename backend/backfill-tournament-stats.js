#!/usr/bin/env node

/**
 * Backfill Tournament Stats
 * Updates tournaments played count for all players based on their past registrations
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Registration = require('./models/Registration');
const Tournament = require('./models/Tournament');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('═══════════════════════════════════════════════════');
console.log('   BACKFILL TOURNAMENT STATS');
console.log('═══════════════════════════════════════════════════\n');

/**
 * Combine date and time into a single Date object
 */
function combineDateAndTime(dateStr, timeStr) {
  const date = new Date(dateStr);
  if (!timeStr) return date;
  
  const [hours, minutes] = timeStr.split(':');
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  date.setSeconds(0);
  date.setMilliseconds(0);
  
  return date;
}

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    console.log('Database:', mongoose.connection.name, '\n');
    
    const now = new Date();
    
    // Get all tournaments that have passed (start time + 40 minutes ago)
    const allTournaments = await Tournament.find({});
    
    const pastTournaments = allTournaments.filter(tournament => {
      const tournamentStartDateTime = combineDateAndTime(
        tournament.startDate,
        tournament.startTime
      );
      const updateTime = new Date(tournamentStartDateTime.getTime() + 40 * 60 * 1000);
      return now >= updateTime;
    });

    console.log(`Found ${pastTournaments.length} past tournaments\n`);

    if (pastTournaments.length === 0) {
      console.log('No past tournaments to process');
      mongoose.connection.close();
      process.exit(0);
      return;
    }

    // Get all users
    const users = await User.find({ role: 'player' });
    console.log(`Found ${users.length} players\n`);

    let updatedPlayers = 0;

    // For each player, count their confirmed registrations in past tournaments
    for (const user of users) {
      const registrations = await Registration.find({
        playerId: user._id,
        status: 'confirmed'
      });

      // Count how many of these registrations are for past tournaments
      let tournamentsPlayed = 0;
      
      for (const reg of registrations) {
        const tournament = pastTournaments.find(t => 
          t._id.toString() === reg.tournamentId.toString()
        );
        if (tournament) {
          tournamentsPlayed++;
        }
      }

      if (tournamentsPlayed > 0) {
        // Update user's tournaments played
        await User.findByIdAndUpdate(user._id, {
          'stats.tournamentsPlayed': tournamentsPlayed
        });
        
        console.log(`✅ ${user.username}: ${tournamentsPlayed} tournaments played`);
        updatedPlayers++;
      }
    }

    // Mark all past tournaments as stats updated
    for (const tournament of pastTournaments) {
      tournament.statsUpdated = true;
      await tournament.save();
    }

    console.log('\n═══════════════════════════════════════════════════');
    console.log('   SUMMARY');
    console.log('═══════════════════════════════════════════════════\n');
    console.log(`✅ Updated ${updatedPlayers} players`);
    console.log(`✅ Marked ${pastTournaments.length} tournaments as processed\n`);
    
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
