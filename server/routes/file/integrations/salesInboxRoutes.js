const express = require('express');
const router = express.Router();
const {
  getEmails,
  getEmail,
  getEmailStats,
  sendEmail,
  updateEmail,
  getConnectedAccounts,
  addConnectedAccount,
  removeConnectedAccount
} = require('../../../controllers/file/integrations/salesInboxController');

// Email Routes
router.get('/emails', getEmails);
router.post('/emails', sendEmail);
router.get('/emails/stats', getEmailStats);
router.get('/debug-sync', require('../../../controllers/file/integrations/salesInboxController').debugSync); // New Debug Route
router.get('/emails/:id', getEmail);
router.put('/emails/:id', updateEmail);

// Account Routes
router.get('/accounts', getConnectedAccounts);
router.post('/accounts', addConnectedAccount);
router.delete('/accounts/:id', removeConnectedAccount);

module.exports = router;
