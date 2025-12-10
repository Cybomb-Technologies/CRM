const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const profileController = {
    // Get user profile
    getProfile: async (req, res) => {
        try {
            console.log('📥 Fetching profile for user:', req.user._id);
            const user = await User.findById(req.user._id).select('-password');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            console.log('✅ Profile found:', user.name);
            res.json({
                success: true,
                user
            });
        } catch (error) {
            console.error('❌ Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching profile',
                error: error.message
            });
        }
    },

    // Update user profile (without picture)
    updateProfile: async (req, res) => {
        try {
            console.log('🔄 Updating profile for user:', req.user._id);
            const { name, settings } = req.body;
            const updateData = {};

            if (name) updateData.name = name.trim();
            if (settings) updateData.settings = settings;

            const user = await User.findByIdAndUpdate(
                req.user._id,
                updateData,
                { new: true, runValidators: true }
            ).select('-password');

            console.log('✅ Profile updated:', user.name);
            res.json({
                success: true,
                message: 'Profile updated successfully',
                user
            });
        } catch (error) {
            console.error('❌ Update profile error:', error);

            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: Object.values(error.errors).map(err => err.message)
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error updating profile',
                error: error.message
            });
        }
    },

    // Upload profile picture - FIXED VERSION
    uploadProfilePicture: async (req, res) => {
        try {
            console.log('📤 Uploading profile picture for user:', req.user._id);

            if (!req.file) {
                console.log('❌ No file uploaded');
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded. Please select an image.'
                });
            }

            console.log('📁 File received:', {
                filename: req.file.filename,
                originalname: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                path: req.file.path
            });

            const user = await User.findById(req.user._id);

            // Delete old profile picture if exists
            if (user.profilePicture) {
                const oldImagePath = path.join(__dirname, '..', 'public', user.profilePicture);
                console.log('🗑️ Checking old image at:', oldImagePath);

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                    console.log('🗑️ Old image deleted:', oldImagePath);
                }
            }

            // Update user with new profile picture path
            const filePath = `/uploads/profiles/${req.file.filename}`;
            console.log('💾 Saving new image path:', filePath);

            user.profilePicture = filePath;
            await user.save();

            console.log('✅ Profile picture updated for user:', user.name);
            res.json({
                success: true,
                message: 'Profile picture uploaded successfully',
                profilePicture: user.profilePicture,
                fullUrl: `http://localhost:${process.env.PORT || 5000}${user.profilePicture}`
            });
        } catch (error) {
            console.error('❌ Upload profile picture error:', error);
            res.status(500).json({
                success: false,
                message: 'Error uploading profile picture',
                error: error.message,
                details: error.stack
            });
        }
    },

    // Delete profile picture - FIXED VERSION
    deleteProfilePicture: async (req, res) => {
        try {
            console.log('🗑️ Deleting profile picture for user:', req.user._id);

            const user = await User.findById(req.user._id);

            if (!user.profilePicture) {
                console.log('⚠️ No profile picture to delete');
                return res.status(400).json({
                    success: false,
                    message: 'No profile picture to delete'
                });
            }

            // Delete file from server - CORRECT PATH
            const imagePath = path.join(__dirname, '..', 'public', user.profilePicture);
            console.log('🗑️ Looking for image at:', imagePath);

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log('🗑️ Image deleted:', imagePath);
            } else {
                console.log('⚠️ Image not found at:', imagePath);
            }

            // Remove profile picture from user
            user.profilePicture = null;
            await user.save();

            console.log('✅ Profile picture deleted for user:', user.name);
            res.json({
                success: true,
                message: 'Profile picture deleted successfully'
            });
        } catch (error) {
            console.error('❌ Delete profile picture error:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting profile picture',
                error: error.message
            });
        }
    }
};

module.exports = profileController;