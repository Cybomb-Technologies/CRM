const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authController.getMe);
router.get('/debug/users', authController.debugUsers); // Remove in production

module.exports = router;