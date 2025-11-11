const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '7d',
  });
};

// Debug endpoint - get all users
router.get('/debug/users', async (req, res) => {
  try {
    console.log('🔍 Fetching all users for debug...');
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    console.log('📋 Found users:', users.length);
    res.json(users);
  } catch (error) {
    console.error('❌ Debug users error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching users',
      error: error.message 
    });
  }
});

// Input validation middleware
const validateRegistration = (req, res, next) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ 
      success: false,
      message: 'All fields (email, password, name) are required' 
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ 
      success: false,
      message: 'Password must be at least 6 characters long' 
    });
  }
  
  next();
};

// Register Route
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    console.log('📝 Registration attempt for:', email);

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }

    // Create user
    console.log('🔨 Creating new user...');
    const user = new User({ 
      email: email.toLowerCase().trim(), 
      password, 
      name: name.trim() 
    });
    
    await user.save();
    console.log('✅ User created successfully:', user._id);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration', 
      error: error.message 
    });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    console.log('🔐 Login attempt for:', email);

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      console.log('❌ No user found with email:', email);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check password
    console.log('🔑 Checking password...');
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.log('❌ Password does not match for user:', email);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken(user._id);
    console.log('✅ Login successful for:', email);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login', 
      error: error.message 
    });
  }
});

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true,
      user 
    });
  } catch (error) {
    console.error('❌ Profile error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;