const express = require('express');
const router = express.Router();
const analyticsController = require('../../../controllers/file/analytics/analyticsController');
// const auth = require('../../../middleware/auth'); // Authenticate if needed

// Apply auth middleware if you want to protect these routes
// router.use(auth);

// Organization Overview Analytics
router.get('/org-overview', analyticsController.getOrgOverview);

// Lead Analytics
router.get('/leads', analyticsController.getLeadAnalytics);

// Deal Insights
router.get('/deals', analyticsController.getDealInsights);

// Sales Trend Analytics
router.get('/sales-trend', analyticsController.getSalesTrend);

// Marketing Analytics
router.get('/marketing', analyticsController.getMarketingMetrics);

// Activity Analytics
router.get('/activity', analyticsController.getActivityStats);

module.exports = router;
