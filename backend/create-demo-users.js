#!/usr/bin/env node

/**
 * Create demo users for testing
 * - player@demo.com / demo123
 * - organizer@demo.com / demo123
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Wallet = require('./models/Wallet');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('═══════════════════════════════════════════════════');
console.log('   CREATE DEMO USERS');
console.log('═══════════════════════════════════════════════════\n');

const demoUsers = [
  {
    username: 'DemoPlayer',
    email: 'player@demo.com',
    password: 'demo123',
    role: 'player'
  },
  {
    username: 'DemoOrganizer',
    email: 'organizer@demo.com',
    password: 'demo123',
    role: 'organizer'
  }
];

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    console.log('Database:', mongoose.connection.name, '\n');
    
    for (const userData of demoUsers) {
      console.log(`Creating ${userData.email}...`);
      
      // Check if already exists
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`⚠️  ${userData.email} already exists - updating password...`);
        existing.password = userData.password;
        await existing.save();
        console.log(`✅ Password updated for ${userData.email}\n`);
      } else {
        // Create new user
        const user = await User.create(userData);
        
        // Create wallet
        await Wallet.create({ userId: user._id });
        
        console.log(`✅ Created ${userData.email}\n`);
      }
    }
    
    console.log('═══════════════════════════════════════════════════');
    console.log('   DEMO CREDENTIALS');
    console.log('═══════════════════════════════════════════════════\n');
    console.log('Player Account:');
    console.log('  Email: player@demo.com');
    console.log('  Password: demo123\n');
    console.log('Organizer Account:');
    console.log('  Email: organizer@demo.com');
    console.log('  Password: demo123\n');
    console.log('✅ You can now login with these credentials!\n');
    console.log('═══════════════════════════════════════════════════\n');
    
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
