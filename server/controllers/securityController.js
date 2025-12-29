const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Change password
// Change password
exports.changePassword = async (req, res) => {
    console.log('🔐 [SecurityController] Change password request received');
    try {
        const { currentPassword, newPassword } = req.body;
        console.log('📝 [SecurityController] Body:', { currentPassword: '***', newPassword: '***' });
        console.log('👤 [SecurityController] Request user:', req.user ? { id: req.user.id, email: req.user.email } : 'Missing');

        // Validate input
        if (!currentPassword || !newPassword) {
            console.log('❌ [SecurityController] Missing passwords');
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        if (newPassword.length < 6) {
            console.log('❌ [SecurityController] Password too short');
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters'
            });
        }

        // Get user with password
        // Explicitly using _id to be safe
        const userId = req.user.id || req.user._id;
        console.log('🔍 [SecurityController] Finding user by ID:', userId);

        const user = await User.findById(userId).select('+password');

        if (!user) {
            console.log('❌ [SecurityController] User not found during re-fetch');
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('✅ [SecurityController] User found, checking password...');

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            console.log('❌ [SecurityController] Incorrect password');
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Set new password (model pre-save hook will hash it)
        user.password = newPassword;

        await user.save();
        console.log('✅ [SecurityController] Password updated successfully');

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('❌ [SecurityController] Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Toggle 2FA
exports.toggle2FA = async (req, res) => {
    try {
        const { enabled } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.twoFactorEnabled = enabled === true;
        await user.save();

        res.status(200).json({
            success: true,
            message: `2FA ${enabled ? 'enabled' : 'disabled'} successfully`,
            twoFactorEnabled: user.twoFactorEnabled
        });
    } catch (error) {
        console.error('Toggle 2FA error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get security settings
exports.getSecuritySettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('twoFactorEnabled lastPasswordChange');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                twoFactorEnabled: user.twoFactorEnabled || false,
                lastPasswordChange: user.lastPasswordChange || null
            }
        });
    } catch (error) {
        console.error('Get security settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};