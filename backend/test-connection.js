// Test MongoDB Connection
const mongoose = require('mongoose');

// Replace with your actual MongoDB URI from Render
const MONGODB_URI = 'YOUR_MONGODB_URI_HERE';

console.log('Testing MongoDB connection...');
console.log('Connection string:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Failed:');
    console.error('Error:', err.message);
    console.error('\nCommon fixes:');
    console.error('1. Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)');
    console.error('2. Verify username and password');
    console.error('3. Ensure database name is included in URI');
    console.error('4. Check if special characters in password are URL-encoded');
    process.exit(1);
  });
