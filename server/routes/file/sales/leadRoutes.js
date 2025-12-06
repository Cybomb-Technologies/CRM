// server/routes/file/sales/leadRoutes.js
const express = require("express");
const router = express.Router();
const leadController = require("../../../controllers/file/sales/leads/leadController");

// GET Routes
router.get("/", leadController.getLeads);
router.get("/:id", leadController.getLead);

// POST Routes
router.post("/", leadController.createLead);
router.post("/bulk-update", leadController.bulkUpdateLeads);
router.post("/bulk-delete", leadController.bulkDeleteLeads);
router.post("/bulk-convert", leadController.bulkConvertLeads);
router.post(
  "/bulk-convert-to-account",
  leadController.bulkConvertLeadsToAccount
); // NEW
router.post("/manage-tags", leadController.manageLeadTags);
router.post("/approve", leadController.approveLeads);
router.post("/deduplicate", leadController.deduplicateLeads);
router.post("/add-to-campaign", leadController.addLeadsToCampaign);

// PUT Routes
router.put("/:id", leadController.updateLead);
// router.put("/bulk-update", leadController.bulkUpdateLeads);

// DELETE Routes
router.delete("/:id", leadController.deleteLead);

// Conversion Routes
router.post("/:id/convert", leadController.convertLead);
router.post("/:id/convert-to-account", leadController.convertLeadToAccount); // NEW
router.post("/:id/sync-contact", leadController.syncLeadToContact);
router.post("/:id/sync-account", leadController.syncLeadToAccount); // NEW

module.exports = router;
