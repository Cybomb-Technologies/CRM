// routes/file/inventory/purchaseOrderRoutes.js

const express = require('express');
const router = express.Router();

const purchaseOrderController = require('../../../controllers/file/inventory/purchaseOrderController');

// Static routes FIRST
router.get('/search/:term', purchaseOrderController.searchPurchaseOrders);
router.post('/filter', purchaseOrderController.filterPurchaseOrders);

// Bulk operations
router.post('/bulk/delete', purchaseOrderController.bulkDeletePurchaseOrders);
router.post('/bulk/export', purchaseOrderController.exportPurchaseOrders);

// Statistics
router.get('/stats/summary', purchaseOrderController.getPurchaseOrderStats);
router.get('/stats/status', purchaseOrderController.getStatusStats);

// CRUD
router.route('/')
  .get(purchaseOrderController.getAllPurchaseOrders)
  .post(purchaseOrderController.createPurchaseOrder);

// Status update
router.put('/:id/status', purchaseOrderController.updateStatus);

// ID-based routes LAST
router.route('/:id')
  .get(purchaseOrderController.getPurchaseOrder)
  .put(purchaseOrderController.updatePurchaseOrder)
  .delete(purchaseOrderController.deletePurchaseOrder);

module.exports = router;
