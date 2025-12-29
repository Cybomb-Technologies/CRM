const express = require("express");
const router = express.Router();
const dealController = require('../../../controllers/file/sales/deals/dealController');
const auth = require('../../../middleware/auth');
const upload = require('../../../middleware/upload');

// GET /api/deals - Get all deals with filters
router.get("/", dealController.getDeals);

// GET /api/deals/all - Get all deals without pagination (for kanban view)
router.get("/all", dealController.getAllDeals);

// GET /api/deals/:id - Get single deal
router.get("/:id", dealController.getDealById);

// POST /api/deals - Create new deal
router.post("/", dealController.createDeal);

// PUT /api/deals/:id - Update deal
router.put("/:id", dealController.updateDeal);

// DELETE /api/deals/:id - Delete deal
router.delete("/:id", dealController.deleteDeal);

// PUT /api/deals/bulk/update - Bulk update deals
router.put("/bulk/update", dealController.bulkUpdateDeals);

// DELETE /api/deals/bulk/delete - Bulk delete deals
router.delete("/bulk/delete", dealController.bulkDeleteDeals);

// PUT /api/deals/:dealId/move-stage - Move deal to new stage
router.put("/:dealId/move-stage", dealController.moveDealStage);

// PUT /api/deals/bulk/move-stage - Bulk move deals to new stage
router.put("/bulk/move-stage", dealController.bulkMoveDealsStage);

module.exports = router;
