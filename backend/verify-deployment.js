#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Run this to verify your Render deployment is working correctly
 */

const https = require('https');

// CONFIGURATION - Update these with your actual URLs
const BACKEND_URL = 'https://inazuma-backend.onrender.com'; // Change this to your Render URL
const MONGODB_URI = process.env.MONGODB_URI || 'YOUR_MONGODB_URI_HERE';

console.log('🔍 Verifying Render Deployment...\n');

// Test 1: Health Check
function testHealthCheck() {
  return new Promise((resolve, reject) => {
    console.log('1️⃣  Testing Health Endpoint...');
    https.get(`${BACKEND_URL}/api/health`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('   ✅ Health check passed');
          console.log('   Response:', data);
          resolve(true);
        } else {
          console.log('   ❌ Health check failed');
          console.log('   Status:', res.statusCode);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.log('   ❌ Cannot reach backend');
      console.log('   Error:', err.message);
      resolve(false);
    });
  });
}

// Test 2: MongoDB Connection
function testMongoConnection() {
  return new Promise((resolve) => {
    console.log('\n2️⃣  Testing MongoDB Connection...');
    
    if (!MONGODB_URI || MONGODB_URI === 'YOUR_MONGODB_URI_HERE') {
      console.log('   ⚠️  MONGODB_URI not configured');
      console.log('   Set it in Render dashboard or as environment variable');
      resolve(false);
      return;
    }

    const mongoose = require('mongoose');
    mongoose.connect(MONGODB_URI)
      .then(() => {
        console.log('   ✅ MongoDB connected successfully');
        console.log('   Database:', mongoose.connection.name);
        console.log('   Host:', mongoose.connection.host);
        mongoose.connection.close();
        resolve(true);
      })
      .catch((err) => {
        console.log('   ❌ MongoDB connection failed');
        console.log('   Error:', err.message);
        console.log('\n   Common fixes:');
        console.log('   - Check MongoDB Atlas IP whitelist (0.0.0.0/0)');
        console.log('   - Verify username and password');
        console.log('   - Ensure database name is in URI');
        resolve(false);
      });
  });
}

// Test 3: Registration Endpoint
function testRegistration() {
  return new Promise((resolve) => {
    console.log('\n3️⃣  Testing Registration Endpoint...');
    
    const testUser = {
      username: `test_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'Test123!',
      role: 'player'
    };

    const postData = JSON.stringify(testUser);
    const url = new URL(`${BACKEND_URL}/api/auth/register`);

    const options = {
      hostname: url.hostname,
      path: url.pathname,
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
        if (res.statusCode === 201) {
          console.log('   ✅ Registration works');
          const response = JSON.parse(data);
          console.log('   User created:', response.user?.username);
          console.log('   Token received:', response.token ? 'Yes' : 'No');
          resolve(true);
        } else {
          console.log('   ❌ Registration failed');
          console.log('   Status:', res.statusCode);
          console.log('   Response:', data);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log('   ❌ Cannot test registration');
      console.log('   Error:', err.message);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

// Test 4: Environment Variables
function checkEnvironmentVariables() {
  console.log('\n4️⃣  Checking Environment Variables...');
  
  const requiredVars = [
    'NODE_ENV',
    'MONGODB_URI',
    'JWT_SECRET',
    'FRONTEND_URL',
    'PORT'
  ];

  let allSet = true;
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`   ✅ ${varName} is set`);
    } else {
      console.log(`   ❌ ${varName} is NOT set`);
      allSet = false;
    }
  });

  if (!allSet) {
    console.log('\n   ⚠️  Some environment variables are missing');
    console.log('   Set them in Render dashboard → Environment tab');
  }

  return allSet;
}

// Run all tests
async function runTests() {
  console.log('═══════════════════════════════════════════════════');
  console.log('   RENDER DEPLOYMENT VERIFICATION');
  console.log('═══════════════════════════════════════════════════\n');
  console.log('Backend URL:', BACKEND_URL);
  console.log('');

  const results = {
    health: await testHealthCheck(),
    mongo: await testMongoConnection(),
    registration: await testRegistration(),
    envVars: checkEnvironmentVariables()
  };

  console.log('\n═══════════════════════════════════════════════════');
  console.log('   RESULTS');
  console.log('═══════════════════════════════════════════════════\n');

  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;

  console.log(`Tests Passed: ${passed}/${total}\n`);

  if (passed === total) {
    console.log('🎉 All tests passed! Your deployment is working correctly.\n');
    console.log('Next steps:');
    console.log('1. Create your admin account');
    console.log('2. Update frontend with backend URL');
    console.log('3. Set up UptimeRobot to keep service awake');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.\n');
    console.log('Common fixes:');
    console.log('1. Verify MONGODB_URI in Render dashboard');
    console.log('2. Check MongoDB Atlas IP whitelist (0.0.0.0/0)');
    console.log('3. Ensure all environment variables are set');
    console.log('4. Check Render logs for errors');
  }

  console.log('\n═══════════════════════════════════════════════════\n');
  process.exit(passed === total ? 0 : 1);
}

// Run the tests
runTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
