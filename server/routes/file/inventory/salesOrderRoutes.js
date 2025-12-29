const express = require('express');
const router = express.Router();
const {
    createSalesOrder,
    getSalesOrders,
    getSalesOrderById,
    updateSalesOrder,
    deleteSalesOrder
} = require('../../../controllers/file/inventory/salesOrderController');
// const { protect } = require('../../../middleware/authMiddleware'); // Uncomment if you have auth middleware

// All routes are prefixed with /api/file/inventory/sales-orders
router.route('/')
    .post(createSalesOrder)
    .get(getSalesOrders);

router.route('/:id')
    .get(getSalesOrderById)
    .put(updateSalesOrder)
    .delete(deleteSalesOrder);

module.exports = router;
