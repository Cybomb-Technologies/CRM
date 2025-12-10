const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const profileController = require('../controllers/profileController');
const { upload, handleMulterError } = require('../middleware/upload');

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/', authMiddleware, profileController.getProfile);

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', authMiddleware, profileController.updateProfile);

// @route   POST /api/profile/picture
// @desc    Upload profile picture
// @access  Private
router.post(
  '/picture',
  authMiddleware,
  upload.single('profilePicture'),
  handleMulterError,
  profileController.uploadProfilePicture
);

// @route   DELETE /api/profile/picture
// @desc    Delete profile picture
// @access  Private
router.delete('/picture', authMiddleware, profileController.deleteProfilePicture);

module.exports = router;