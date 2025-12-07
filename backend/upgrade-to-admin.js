#!/usr/bin/env node

/**
 * Upgrade an existing user to admin/organizer
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;

// CHANGE THIS to the email of the user you want to upgrade
const USER_EMAIL = 'test@gmail.com'; // Change to your email

console.log('═══════════════════════════════════════════════════');
console.log('   UPGRADE USER TO ADMIN');
console.log('═══════════════════════════════════════════════════\n');

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    const user = await User.findOne({ email: USER_EMAIL });
    
    if (!user) {
      console.log(`❌ User with email "${USER_EMAIL}" not found!\n`);
      console.log('Available users:');
      const allUsers = await User.find({});
      allUsers.forEach(u => {
        console.log(`  - ${u.email} (${u.username})`);
      });
      console.log('\nUpdate USER_EMAIL in this script and try again.\n');
      mongoose.connection.close();
      process.exit(1);
      return;
    }
    
    if (user.role === 'organizer') {
      console.log(`⚠️  User "${user.username}" is already an organizer!\n`);
      mongoose.connection.close();
      process.exit(0);
      return;
    }
    
    // Upgrade to organizer
    user.role = 'organizer';
    await user.save();
    
    console.log('✅ User upgraded successfully!\n');
    console.log('Username:', user.username);
    console.log('Email:', user.email);
    console.log('Role:', user.role, '(was: player)');
    console.log('\nYou can now login with this account as an admin!\n');
    console.log('═══════════════════════════════════════════════════\n');
    
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
