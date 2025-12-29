const express = require('express');
const router = express.Router();
const  protect  = require('../middleware/auth');
const {
  changePassword,
  toggle2FA,
  getSecuritySettings
} = require('../controllers/securityController');

// All routes require authentication
router.use(protect);

router.get('/', getSecuritySettings);
router.post('/change-password', changePassword);
router.post('/toggle-2fa', toggle2FA);

module.exports = router;