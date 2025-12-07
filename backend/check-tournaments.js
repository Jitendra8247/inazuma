// Check Tournaments in Database
const mongoose = require('mongoose');
require('dotenv').config();

async function checkTournaments() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const Tournament = require('./models/Tournament');
    
    // Get all tournaments
    const tournaments = await Tournament.find().sort({ createdAt: -1 }).limit(10);
    
    console.log(`📊 Found ${tournaments.length} tournaments\n`);
    
    if (tournaments.length > 0) {
      tournaments.forEach((tournament, index) => {
        console.log(`Tournament ${index + 1}:`);
        console.log(`  ID: ${tournament._id}`);
        console.log(`  Name: ${tournament.name}`);
        console.log(`  Mode: ${tournament.mode}`);
        console.log(`  Status: ${tournament.status}`);
        console.log(`  Organizer: ${tournament.organizer}`);
        console.log(`  Created: ${tournament.createdAt}`);
        console.log(`  Archived: ${tournament.archivedAt || 'No'}`);
        console.log('---');
      });
    } else {
      console.log('❌ No tournaments found in database');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected');
  }
}

checkTournaments();
