// Test Registration Script
// This script helps test the new registration format

const mongoose = require('mongoose');
require('dotenv').config();

const Registration = require('./models/Registration');
const Tournament = require('./models/Tournament');

async function testRegistration() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find a tournament
    const tournament = await Tournament.findOne();
    if (!tournament) {
      console.log('❌ No tournaments found. Create a tournament first.');
      process.exit(1);
    }

    console.log(`\n📋 Testing with tournament: ${tournament.name}`);
    console.log(`   Mode: ${tournament.mode}`);

    // Test data based on mode
    let testData = {
      tournamentId: tournament._id,
      playerId: new mongoose.Types.ObjectId(), // Fake player ID for testing
      mode: tournament.mode,
      email: 'test@example.com',
      phone: '9876543210'
    };

    if (tournament.mode === 'Solo') {
      testData.player = {
        inGameName: 'TestPlayer',
        bgmiId: '12345678'
      };
    } else if (tournament.mode === 'Duo') {
      testData.teamName = 'Test Team';
      testData.player1 = {
        inGameName: 'Player1',
        bgmiId: '11111111'
      };
      testData.player2 = {
        inGameName: 'Player2',
        bgmiId: '22222222'
      };
    } else if (tournament.mode === 'Squad') {
      testData.teamName = 'Test Squad';
      testData.player1 = {
        inGameName: 'Player1',
        bgmiId: '11111111'
      };
      testData.player2 = {
        inGameName: 'Player2',
        bgmiId: '22222222'
      };
      testData.player3 = {
        inGameName: 'Player3',
        bgmiId: '33333333'
      };
      testData.player4 = {
        inGameName: 'Player4',
        bgmiId: '44444444'
      };
    }

    console.log('\n📝 Test data:');
    console.log(JSON.stringify(testData, null, 2));

    // Try to create registration
    console.log('\n🔄 Creating test registration...');
    const registration = new Registration(testData);
    
    // Validate without saving
    const validationError = registration.validateSync();
    if (validationError) {
      console.log('❌ Validation failed:');
      Object.keys(validationError.errors).forEach(key => {
        console.log(`   - ${key}: ${validationError.errors[key].message}`);
      });
    } else {
      console.log('✅ Validation passed!');
      
      // Save to database
      await registration.save();
      console.log('✅ Registration saved successfully!');
      console.log('\n📄 Saved registration:');
      console.log(JSON.stringify(registration.toObject(), null, 2));
      
      // Clean up - delete test registration
      await Registration.deleteOne({ _id: registration._id });
      console.log('\n🧹 Test registration cleaned up');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.errors) {
      console.log('\nValidation errors:');
      Object.keys(error.errors).forEach(key => {
        console.log(`   - ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

testRegistration();
