// Check Registration Schema
const mongoose = require('mongoose');
require('dotenv').config();

async function checkSchema() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get the Registration model
    const Registration = require('./models/Registration');
    
    // Get schema paths
    console.log('📋 Registration Schema Fields:');
    console.log('================================');
    
    const schema = Registration.schema;
    Object.keys(schema.paths).forEach(path => {
      const field = schema.paths[path];
      console.log(`- ${path}: ${field.instance}${field.isRequired ? ' (required)' : ''}`);
    });

    console.log('\n📊 Existing Registrations:');
    console.log('================================');
    
    const registrations = await Registration.find().limit(5);
    console.log(`Found ${registrations.length} registrations\n`);
    
    if (registrations.length > 0) {
      registrations.forEach((reg, index) => {
        console.log(`Registration ${index + 1}:`);
        console.log(JSON.stringify(reg.toObject(), null, 2));
        console.log('---');
      });
    } else {
      console.log('No registrations found in database');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected');
  }
}

checkSchema();
