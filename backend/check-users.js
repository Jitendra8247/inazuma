#!/usr/bin/env node

/**
 * Check what users exist in MongoDB
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Connecting to MongoDB...\n');

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    console.log('Database:', mongoose.connection.name);
    console.log('\n═══════════════════════════════════════════════════');
    console.log('   USERS IN DATABASE');
    console.log('═══════════════════════════════════════════════════\n');
    
    const users = await User.find({});
    
    if (users.length === 0) {
      console.log('❌ No users found in database!\n');
      console.log('This means:');
      console.log('- Your old credentials were never saved');
      console.log('- You need to create a new admin account\n');
      console.log('Solution:');
      console.log('1. Use the registration endpoint to create admin');
      console.log('2. Or I can create one for you\n');
    } else {
      console.log(`Found ${users.length} user(s):\n`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. Username: ${user.username}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log(`   Active: ${user.isActive}`);
        console.log('');
      });
    }
    
    console.log('═══════════════════════════════════════════════════\n');
    
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
