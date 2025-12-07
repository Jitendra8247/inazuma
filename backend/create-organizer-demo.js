#!/usr/bin/env node

/**
 * Create organizer@demo.com account in current database
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Wallet = require('./models/Wallet');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('═══════════════════════════════════════════════════');
console.log('   CREATE ORGANIZER@DEMO.COM ACCOUNT');
console.log('═══════════════════════════════════════════════════\n');

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    console.log('Database:', mongoose.connection.name, '\n');
    
    // Check if already exists
    const existing = await User.findOne({ email: 'organizer@demo.com' });
    if (existing) {
      console.log('⚠️  organizer@demo.com already exists!\n');
      console.log('Username:', existing.username);
      console.log('Email:', existing.email);
      console.log('Role:', existing.role);
      console.log('\nYou can login with this account now!\n');
      mongoose.connection.close();
      process.exit(0);
      return;
    }
    
    // Create organizer account
    console.log('Creating organizer@demo.com...\n');
    const organizer = await User.create({
      username: 'organizer',
      email: 'organizer@demo.com',
      password: 'Organizer@123',
      role: 'organizer'
    });
    
    // Create wallet
    await Wallet.create({ userId: organizer._id });
    
    console.log('✅ Account created successfully!\n');
    console.log('═══════════════════════════════════════════════════');
    console.log('   CREDENTIALS');
    console.log('═══════════════════════════════════════════════════\n');
    console.log('Email: organizer@demo.com');
    console.log('Password: Organizer@123');
    console.log('Role: organizer');
    console.log('\n✅ You can now login with these credentials!\n');
    console.log('This account will work on:');
    console.log('- Local backend (localhost:5000)');
    console.log('- Render backend (inazuma-back.onrender.com)');
    console.log('- Both use the same database now!\n');
    console.log('═══════════════════════════════════════════════════\n');
    
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
