const express = require("express");
const router = express.Router();
const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  bulkUpdateLeads,
  bulkDeleteLeads,
  convertLead,
  bulkConvertLeads,
  syncLeadToContact,
  approveLeads,
  manageLeadTags,
  deduplicateLeads,
  addLeadsToCampaign,
} = require("../../../controllers/file/sales/leadController");

// Remove auth middleware for now to match tasks pattern
// router.use(auth);

// Lead CRUD routes
router.get("/", getLeads);
router.get("/:id", getLead);
router.post("/", createLead);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);

// Bulk operations
router.post("/bulk-update", bulkUpdateLeads);
router.post("/bulk-delete", bulkDeleteLeads);
router.post("/bulk-convert", bulkConvertLeads);

// Lead conversion
router.post("/:id/convert", convertLead);
router.post("/:id/sync-contact", syncLeadToContact);

// Additional operations
router.post("/approve", approveLeads);
router.post("/manage-tags", manageLeadTags);
router.post("/deduplicate", deduplicateLeads);
router.post("/add-to-campaign", addLeadsToCampaign);

module.exports = router;
