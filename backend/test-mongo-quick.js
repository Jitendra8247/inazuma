#!/usr/bin/env node

/**
 * Quick MongoDB Connection Test
 * Run this to verify your MongoDB connection works
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('═══════════════════════════════════════════════════');
console.log('   MONGODB CONNECTION TEST');
console.log('═══════════════════════════════════════════════════\n');

if (!MONGODB_URI) {
  console.log('❌ ERROR: MONGODB_URI not found in .env file\n');
  console.log('Fix:');
  console.log('1. Make sure backend/.env file exists');
  console.log('2. Add this line to backend/.env:');
  console.log('   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/inazuma-battle\n');
  process.exit(1);
}

console.log('Testing connection to MongoDB...');
console.log('Connection string:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password
console.log('');

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
})
  .then(() => {
    console.log('✅ SUCCESS! MongoDB Connected\n');
    console.log('Details:');
    console.log('  Database:', mongoose.connection.name);
    console.log('  Host:', mongoose.connection.host);
    console.log('  Port:', mongoose.connection.port);
    console.log('\n✅ Your backend will work now!\n');
    console.log('Next steps:');
    console.log('1. Start your backend: npm start');
    console.log('2. You should see "✅ MongoDB Connected"');
    console.log('3. No more timeout errors!\n');
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ FAILED! Cannot connect to MongoDB\n');
    console.log('Error:', err.message);
    console.log('\n═══════════════════════════════════════════════════');
    console.log('   TROUBLESHOOTING');
    console.log('═══════════════════════════════════════════════════\n');
    
    if (err.message.includes('ECONNREFUSED')) {
      console.log('Problem: MongoDB is not running\n');
      console.log('Solutions:');
      console.log('1. Use MongoDB Atlas (recommended):');
      console.log('   - Go to https://www.mongodb.com/cloud/atlas');
      console.log('   - Create free cluster');
      console.log('   - Get connection string');
      console.log('   - Update backend/.env\n');
      console.log('2. Or install MongoDB locally:');
      console.log('   - Download from https://www.mongodb.com/try/download/community');
      console.log('   - Install and start MongoDB service\n');
    } else if (err.message.includes('authentication failed')) {
      console.log('Problem: Wrong username or password\n');
      console.log('Solutions:');
      console.log('1. Check MongoDB Atlas → Database Access');
      console.log('2. Verify username and password');
      console.log('3. Update MONGODB_URI in backend/.env\n');
    } else if (err.message.includes('timed out')) {
      console.log('Problem: Cannot reach MongoDB server\n');
      console.log('Solutions:');
      console.log('1. Check MongoDB Atlas → Network Access');
      console.log('2. Add IP address: 0.0.0.0/0 (allow all)');
      console.log('3. Wait 1-2 minutes for changes to apply\n');
    } else {
      console.log('Solutions:');
      console.log('1. Check MONGODB_URI format in backend/.env');
      console.log('2. Should look like:');
      console.log('   mongodb+srv://user:pass@cluster.mongodb.net/inazuma-battle');
      console.log('3. Make sure password has no special characters');
      console.log('   (or URL-encode them: @ becomes %40)\n');
    }
    
    console.log('Need help? Read: backend/SETUP_LOCAL_MONGODB.md\n');
    process.exit(1);
  });
