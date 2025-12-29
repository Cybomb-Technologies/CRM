// server/routes/file/sales/campaignRoutes.js
const express = require("express");
const router = express.Router();
const campaignController = require("../../../controllers/file/sales/campaigns/campaignController");

// GET Routes
router.get("/", campaignController.getCampaigns);
router.get("/:id", campaignController.getCampaign);
router.get("/:id/activities", campaignController.getCampaignActivities);
router.get("/:id/analytics", campaignController.getCampaignAnalytics);

// POST Routes
router.post("/", campaignController.createCampaign);
router.post("/:id/members", campaignController.addMembersToCampaign);
router.post("/:id/activities", campaignController.addActivityToCampaign);
router.post("/bulk-update", campaignController.bulkUpdateCampaigns);
router.post("/bulk-delete", campaignController.bulkDeleteCampaigns);
router.post("/bulk-add-members", campaignController.bulkAddMembersToCampaigns);

// PUT Routes
router.put("/:id", campaignController.updateCampaign);
router.put("/:id/members/remove", campaignController.removeMembersFromCampaign);
router.put(
  "/:id/activities/:activityId",
  campaignController.updateActivityInCampaign
);
router.put(
  "/:id/members/:memberId/status",
  campaignController.updateMemberStatus
);

// DELETE Routes
router.delete("/:id", campaignController.deleteCampaign);
router.delete(
  "/:id/activities/:activityId",
  campaignController.deleteActivityFromCampaign
);
router.delete("/:id/permanent", campaignController.permanentDeleteCampaign);

module.exports = router;
