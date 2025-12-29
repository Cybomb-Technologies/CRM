const express = require('express');
const router = express.Router();
const priceBookController = require('../../../controllers/file/inventory/priceBookController');
console.log('✅ Price Book Routes File Loaded');

// Import middleware
const auth = require('../../../middleware/auth');

// Apply authentication middleware to all routes
router.use(auth);

// Debug Middleware
router.use((req, res, next) => {
    console.log(`🔔 Request entered priceBookRoutes: ${req.method} ${req.url}`);
    next();
});

// Test Route
router.get('/test-ping', (req, res) => res.send('pong'));

// @route   GET /api/price-books
// @desc    Get all price books
// @access  Private
router.get('/', priceBookController.getPriceBooks);

// @route   GET /api/price-books/stats
// @desc    Get price books statistics
// @access  Private
router.get('/stats', priceBookController.getPriceBooksStats);

// @route   GET /api/price-books/export/csv
// @desc    Export price books to CSV
// @access  Private
router.get('/export/csv', priceBookController.exportPriceBooksCSV);

// @route   GET /api/price-books/:id
// @desc    Get single price book
// @access  Private
router.get('/:id', priceBookController.getPriceBook);

// @route   POST /api/price-books
// @desc    Create price book
// @access  Private
router.post('/', priceBookController.createPriceBook);

// @route   PUT /api/price-books/:id
// @desc    Update price book
// @access  Private
router.put('/:id', priceBookController.updatePriceBook);

// @route   DELETE /api/price-books/:id
// @desc    Delete price book
// @access  Private
router.delete('/:id', priceBookController.deletePriceBook);

// @route   DELETE /api/price-books/bulk/delete
// @desc    Bulk delete price books
// @access  Private
router.delete('/bulk/delete', priceBookController.bulkDeletePriceBooks);

// @route   PUT /api/price-books/bulk/update
// @desc    Bulk update price books
// @access  Private
router.put('/bulk/update', priceBookController.bulkUpdatePriceBooks);

module.exports = router;