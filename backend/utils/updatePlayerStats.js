// Update Player Stats - Auto-update tournaments played after tournament starts + 40 minutes

const Tournament = require('../models/Tournament');
const Registration = require('../models/Registration');
const User = require('../models/User');

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

/**
 * Update tournaments played count for all registered players
 * when tournament start time + 40 minutes has passed
 */
async function updateTournamentsPlayed() {
  try {
    const now = new Date();
    
    // Find all tournaments that started more than 40 minutes ago
    // and haven't been marked as stats updated
    const tournaments = await Tournament.find({
      status: { $in: ['upcoming', 'ongoing', 'completed'] },
      statsUpdated: { $ne: true }
    });

    if (tournaments.length === 0) {
      return { updated: 0 };
    }

    let updatedCount = 0;

    for (const tournament of tournaments) {
      const tournamentStartDateTime = combineDateAndTime(
        tournament.startDate,
        tournament.startTime
      );
      
      // Add 40 minutes
      const updateTime = new Date(tournamentStartDateTime.getTime() + 40 * 60 * 1000);
      
      // Check if 40 minutes have passed since tournament start
      if (now >= updateTime) {
        // Get all confirmed registrations for this tournament
        const registrations = await Registration.find({
          tournamentId: tournament._id,
          status: 'confirmed'
        });

        // Update each player's tournaments played count
        for (const registration of registrations) {
          await User.findByIdAndUpdate(
            registration.playerId,
            { $inc: { 'stats.tournamentsPlayed': 1 } }
          );
        }

        // Mark tournament as stats updated
        tournament.statsUpdated = true;
        await tournament.save();

        updatedCount++;
        console.log(`✅ Updated stats for tournament: ${tournament.name} (${registrations.length} players)`);
      }
    }

    if (updatedCount > 0) {
      console.log(`📊 Total tournaments processed: ${updatedCount}`);
    }

    return { updated: updatedCount };
  } catch (error) {
    console.error('❌ Error updating player stats:', error);
    throw error;
  }
}

/**
 * Start the player stats updater
 * Runs every 5 minutes to check for tournaments that need stats updated
 */
function startPlayerStatsUpdater() {
  console.log('🚀 Starting player stats updater...');
  
  // Run immediately on startup
  updateTournamentsPlayed();
  
  // Then run every 5 minutes
  const FIVE_MINUTES = 5 * 60 * 1000;
  setInterval(updateTournamentsPlayed, FIVE_MINUTES);
  
  console.log('✅ Player stats updater started (runs every 5 minutes)');
}

module.exports = {
  updateTournamentsPlayed,
  startPlayerStatsUpdater
};
