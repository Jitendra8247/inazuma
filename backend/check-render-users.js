#!/usr/bin/env node

/**
 * Check users on Render backend via API
 */

const https = require('https');

const RENDER_URL = 'https://inazuma-back.onrender.com';

console.log('═══════════════════════════════════════════════════');
console.log('   CHECKING RENDER BACKEND');
console.log('═══════════════════════════════════════════════════\n');

// Test 1: Health check
console.log('1. Testing health endpoint...');
https.get(`${RENDER_URL}/api/health`, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('   ✅ Backend is running');
      console.log('   Response:', data);
    } else {
      console.log('   ❌ Backend error:', res.statusCode);
    }
    
    // Test 2: Try to register a test user
    console.log('\n2. Testing registration...');
    const testUser = {
      username: `test_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'Test123!',
      role: 'player'
    };
    
    const postData = JSON.stringify(testUser);
    const options = {
      hostname: 'inazuma-back.onrender.com',
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('   Status:', res.statusCode);
        console.log('   Response:', data);
        
        if (res.statusCode === 201) {
          console.log('\n   ✅ Registration works!');
          console.log('   This means MongoDB IS connected on Render');
          console.log('\n   BUT: It might be a different database than your local one!');
        } else {
          console.log('\n   ❌ Registration failed');
          console.log('   This means MongoDB might NOT be connected on Render');
        }
        
        console.log('\n═══════════════════════════════════════════════════');
        console.log('   DIAGNOSIS');
        console.log('═══════════════════════════════════════════════════\n');
        console.log('Your Render backend needs to use the SAME MongoDB');
        console.log('connection string as your local backend.\n');
        console.log('Check Render Environment Variables:');
        console.log('1. Go to Render dashboard');
        console.log('2. Select your backend service');
        console.log('3. Go to Environment tab');
        console.log('4. Check MONGODB_URI value');
        console.log('5. It should match your local .env file\n');
      });
    });
    
    req.on('error', (err) => {
      console.log('   ❌ Error:', err.message);
    });
    
    req.write(postData);
    req.end();
  });
}).on('error', (err) => {
  console.log('   ❌ Cannot reach backend:', err.message);
});
