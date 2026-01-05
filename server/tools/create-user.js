const mongoose = require('mongoose');
const dotenv = require('dotenv');
const readline = require('readline');
const path = require('path');
const User = require('../models/User'); // Adjust path as needed
const connectDB = require('../config/database'); // Adjust path as needed

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createUser = async () => {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Connected.');

    console.log('\n👤 --- Create New User ---\n');

    const name = await question('Enter Name: ');
    const email = await question('Enter Email: ');
    const password = await question('Enter Password (min 6 chars): ');

    if (!name || !email || !password) {
      console.error('❌ All fields are required.');
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('❌ Password must be at least 6 characters.');
      process.exit(1);
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('❌ User with this email already exists.');
      process.exit(1);
    }

    const user = new User({
      name,
      email,
      password, // Pre-save hook will hash this
      profilePicture: null,
      settings: {
        theme: 'light',
        notifications: { email: true }
      }
    });

    await user.save();

    console.log('\n✨ User created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log('🔑 You can now login with these credentials.');

  } catch (error) {
    console.error('❌ Error creating user:', error.message);
  } finally {
    await mongoose.connection.close();
    rl.close();
    process.exit(0);
  }
};

createUser();
