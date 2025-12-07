// Reset all tournaments to upcoming status
const mongoose = require('mongoose');
require('dotenv').config();

async function resetTournaments() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const Tournament = require('./models/Tournament');
    
    // Update all completed tournaments to upcoming
    const result = await Tournament.updateMany(
      { status: 'completed' },
      { 
        $set: { status: 'upcoming' },
        $unset: { archivedAt: 1 }
      }
    );

    console.log(`✅ Reset ${result.modifiedCount} tournaments to "upcoming" status\n`);
    
    // Show all tournaments
    const tournaments = await Tournament.find().sort({ createdAt: -1 });
    console.log(`📊 Total tournaments: ${tournaments.length}\n`);
    
    tournaments.forEach((t, index) => {
      console.log(`${index + 1}. ${t.name}`);
      console.log(`   Status: ${t.status}`);
      console.log(`   Start: ${new Date(t.startDate).toLocaleDateString()} ${t.startTime}`);
      console.log('---');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected');
  }
}

resetTournaments();
