const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authController.getMe);

// @route   GET /api/auth/debug/users
// @desc    Debug endpoint - get all users (remove in production)
// @access  Private
router.get('/debug/users', authMiddleware, authController.debugUsers);
// router.put(
//   '/picture',
//   authMiddleware,
//   upload.single('profilePicture'),
//   handleMulterError,
//   profileController.uploadProfilePicture
// );

module.exports = router;