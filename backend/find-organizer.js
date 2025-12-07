#!/usr/bin/env node

/**
 * Search for organizer@demo.com in all databases
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('═══════════════════════════════════════════════════');
console.log('   SEARCHING FOR ORGANIZER ACCOUNT');
console.log('═══════════════════════════════════════════════════\n');

// Extract base connection without database name
const baseUri = MONGODB_URI.replace(/\/[^\/]*\?/, '/?');

console.log('Connecting to MongoDB...\n');

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    console.log('Current Database:', mongoose.connection.name);
    console.log('\nSearching for organizer@demo.com...\n');
    
    // Try to find in current database
    const User = require('./models/User');
    const organizer = await User.findOne({ email: 'organizer@demo.com' });
    
    if (organizer) {
      console.log('✅ FOUND in current database!');
      console.log('Username:', organizer.username);
      console.log('Email:', organizer.email);
      console.log('Role:', organizer.role);
      console.log('Created:', organizer.createdAt);
      console.log('\nThis account should work for login!');
    } else {
      console.log('❌ NOT FOUND in current database:', mongoose.connection.name);
      console.log('\nThis means:');
      console.log('1. You created organizer@demo.com in a DIFFERENT database');
      console.log('2. Your backend is connected to:', mongoose.connection.name);
      console.log('3. But organizer@demo.com is in a different database\n');
      
      console.log('Solution:');
      console.log('1. Check MongoDB Atlas - which database has organizer@demo.com?');
      console.log('2. Update MONGODB_URI to use that database name');
      console.log('3. Or create organizer@demo.com in the current database\n');
    }
    
    // List all users in current database
    console.log('\n═══════════════════════════════════════════════════');
    console.log('   ALL USERS IN CURRENT DATABASE');
    console.log('═══════════════════════════════════════════════════\n');
    
    const allUsers = await User.find({});
    console.log(`Found ${allUsers.length} users in "${mongoose.connection.name}":\n`);
    allUsers.forEach((user, i) => {
      console.log(`${i + 1}. ${user.email} (${user.role})`);
    });
    
    console.log('\n═══════════════════════════════════════════════════\n');
    
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
