#!/usr/bin/env node

const https = require('https');

console.log('Testing admin login on Render...\n');

const postData = JSON.stringify({
  email: 'admin@inazuma.com',
  password: 'Admin@123456'
});

const options = {
  hostname: 'inazuma-back.onrender.com',
  path: '/api/auth/login',
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
    console.log('Status:', res.statusCode);
    console.log('Response:', JSON.stringify(JSON.parse(data), null, 2));
    
    if (res.statusCode === 200) {
      console.log('\n✅ SUCCESS! Admin login works!');
      console.log('Your Render backend is now using the correct database!');
    } else {
      console.log('\n❌ FAILED! Admin login does not work yet.');
      console.log('Make sure you updated MONGODB_URI on Render and waited for redeploy.');
    }
  });
});

req.on('error', (err) => {
  console.log('❌ Error:', err.message);
});

req.write(postData);
req.end();
