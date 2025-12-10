const express = require("express");
const router = express.Router();
const {
  createDeal,
  getDeals,
  getDealById,
  getAllDeals,
  updateDeal,
  deleteDeal,
  bulkUpdateDeals,
  bulkDeleteDeals,
  moveDealStage,
  bulkMoveDealsStage,
} = require("../../../controllers/file/sales/deals/dealController");

// GET /api/deals - Get all deals with filters
router.get("/", getDeals);

// GET /api/deals/all - Get all deals without pagination (for kanban view)
router.get("/all", getAllDeals);

// GET /api/deals/:id - Get single deal
router.get("/:id", getDealById);

// POST /api/deals - Create new deal
router.post("/", createDeal);

// PUT /api/deals/:id - Update deal
router.put("/:id", updateDeal);

// DELETE /api/deals/:id - Delete deal
router.delete("/:id", deleteDeal);

// PUT /api/deals/bulk/update - Bulk update deals
router.put("/bulk/update", bulkUpdateDeals);

// DELETE /api/deals/bulk/delete - Bulk delete deals
router.delete("/bulk/delete", bulkDeleteDeals);

// PUT /api/deals/:dealId/move-stage - Move deal to new stage
router.put("/:dealId/move-stage", moveDealStage);

// PUT /api/deals/bulk/move-stage - Bulk move deals to new stage
router.put("/bulk/move-stage", bulkMoveDealsStage);

module.exports = router;
