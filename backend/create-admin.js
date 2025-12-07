#!/usr/bin/env node

/**
 * Create an admin/organizer account
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Wallet = require('./models/Wallet');

const MONGODB_URI = process.env.MONGODB_URI;

// Admin credentials - CHANGE THESE!
const ADMIN_USERNAME = 'admin';
const ADMIN_EMAIL = 'admin@inazuma.com';
const ADMIN_PASSWORD = 'Admin@123456'; // Change this to your desired password

console.log('═══════════════════════════════════════════════════');
console.log('   CREATE ADMIN ACCOUNT');
console.log('═══════════════════════════════════════════════════\n');

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [{ email: ADMIN_EMAIL }, { username: ADMIN_USERNAME }] 
    });
    
    if (existingAdmin) {
      console.log('⚠️  Admin account already exists!\n');
      console.log('Username:', existingAdmin.username);
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      console.log('\nIf you forgot the password, delete this user from MongoDB Atlas');
      console.log('and run this script again.\n');
      mongoose.connection.close();
      process.exit(0);
      return;
    }
    
    // Create admin user
    console.log('Creating admin account...\n');
    const admin = await User.create({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'organizer'
    });
    
    // Create wallet for admin
    await Wallet.create({ userId: admin._id });
    
    console.log('✅ Admin account created successfully!\n');
    console.log('═══════════════════════════════════════════════════');
    console.log('   ADMIN CREDENTIALS');
    console.log('═══════════════════════════════════════════════════\n');
    console.log('Username:', ADMIN_USERNAME);
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('Role:', 'organizer');
    console.log('\n⚠️  IMPORTANT: Save these credentials!\n');
    console.log('You can now login with:');
    console.log('  Email:', ADMIN_EMAIL);
    console.log('  Password:', ADMIN_PASSWORD);
    console.log('\n═══════════════════════════════════════════════════\n');
    
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
