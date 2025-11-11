const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Adjust based on your model

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      console.log('📝 Registration attempt:', { name, email });

      // Validation
      if (!name || !email || !password) {
        return res.status(400).json({ 
          message: 'Name, email and password are required' 
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ 
          message: 'Password must be at least 6 characters' 
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'User already exists with this email' 
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await User.create({
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );

      // Return user data (without password)
      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      };

      console.log('✅ User registered successfully:', userResponse.email);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: userResponse
      });

    } catch (error) {
      console.error('🚨 Registration error:', error);
      res.status(500).json({ 
        message: 'Server error during registration' 
      });
    }
  },

  // Add this to your authController.js
debugUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'createdAt'],
        order: [['createdAt', 'DESC']]
      });
      
      console.log('📋 Found users:', users.length);
      res.json(users);
    } catch (error) {
      console.error('Debug users error:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  },
  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      console.log('🔐 Login attempt:', { email });

      // Validation
      if (!email || !password) {
        return res.status(400).json({ 
          message: 'Email and password are required' 
        });
      }

      // Find user
      const user = await User.findOne({ 
        where: { email: email.toLowerCase().trim() } 
      });

      if (!user) {
        console.log('❌ User not found:', email);
        return res.status(400).json({ 
          message: 'Invalid credentials' 
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        console.log('❌ Invalid password for:', email);
        return res.status(400).json({ 
          message: 'Invalid credentials' 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );

      // Return user data (without password)
      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      };

      console.log('✅ Login successful for:', userResponse.email);

      res.json({
        message: 'Login successful',
        token,
        user: userResponse
      });

    } catch (error) {
      console.error('🚨 Login error:', error);
      res.status(500).json({ 
        message: 'Server error during login' 
      });
    }
  },

  // Get current user
  getMe: async (req, res) => {
    try {
      // User is attached to req by authMiddleware
      const userResponse = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt
      };

      res.json({ user: userResponse });
    } catch (error) {
      console.error('Get me error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Debug endpoint - get all users (remove in production)
  debugUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'createdAt'],
        order: [['createdAt', 'DESC']]
      });
      
      res.json(users);
    } catch (error) {
      console.error('Debug users error:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  }
};

module.exports = authController;