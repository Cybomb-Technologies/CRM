const express = require('express');
const router = express.Router();
const forecastController = require('../../../controllers/file/sales/forecasts/forecastController');
const auth = require('../../../middleware/auth'); // Assuming auth middleware exists at this path

// Protect all forecast routes
router.use(auth);

// GET /api/forecasts/stats - Get forecast statistics
router.get('/stats', forecastController.getStats);

// GET /api/forecasts/settings - Get settings and quotas
router.get('/settings', forecastController.getSettings);

// PUT /api/forecasts/settings - Update settings and quotas
router.put('/settings', forecastController.updateSettings);

module.exports = router;
