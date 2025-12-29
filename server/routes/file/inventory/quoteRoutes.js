// routes/file/sales/quoteRoutes.js
const express = require('express');
const router = express.Router();
const quoteController = require('../../../controllers/file/inventory/quoteController');
const auth = require('../../../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Quote routes
console.log('✅ Quote Routes Loaded');
router.post('/', (req, res, next) => {
    console.log('➡️ POST /api/quotes Request Received');
    next();
}, quoteController.createQuote);
router.get('/', quoteController.getAllQuotes);
router.get('/stats', quoteController.getQuoteStats);
router.get('/:id', quoteController.getQuoteById);
router.put('/:id', quoteController.updateQuote);
router.delete('/:id', quoteController.deleteQuote);
router.post('/bulk-delete', quoteController.bulkDeleteQuotes);
router.post('/:id/send', quoteController.sendQuote);
router.post('/:id/duplicate', quoteController.duplicateQuote);

module.exports = router;