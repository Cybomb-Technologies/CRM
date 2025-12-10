// server/controllers/file/sales/campaigns/campaignController.js
// Import split controller modules
const createCampaign = require("./createCampaign");
const readCampaign = require("./readCampaign");
const updateCampaign = require("./updateCampaign");
const deleteCampaign = require("./deleteCampaign");
const campaignMembers = require("./campaignMembers");
const campaignActivities = require("./campaignActivities");
const campaignAnalytics = require("./campaignAnalytics");
const bulkOperations = require("./bulkOperations");

// Export all controller functions as a single object
module.exports = {
  // Campaign CRUD operations
  getCampaigns: readCampaign.getCampaigns,
  getCampaign: readCampaign.getCampaign,
  createCampaign: createCampaign.createCampaign,
  updateCampaign: updateCampaign.updateCampaign,
  deleteCampaign: deleteCampaign.deleteCampaign,
  permanentDeleteCampaign: deleteCampaign.permanentDeleteCampaign,

  // Campaign members operations
  addMembersToCampaign: campaignMembers.addMembersToCampaign,
  removeMembersFromCampaign: campaignMembers.removeMembersFromCampaign,
  updateMemberStatus: campaignMembers.updateMemberStatus,

  // Campaign activities operations
  addActivityToCampaign: campaignActivities.addActivityToCampaign,
  updateActivityInCampaign: campaignActivities.updateActivityInCampaign,
  deleteActivityFromCampaign: campaignActivities.deleteActivityFromCampaign,
  getCampaignActivities: campaignActivities.getCampaignActivities,

  // Campaign analytics
  getCampaignAnalytics: campaignAnalytics.getCampaignAnalytics,

  // Bulk operations
  bulkUpdateCampaigns: bulkOperations.bulkUpdateCampaigns,
  bulkDeleteCampaigns: bulkOperations.bulkDeleteCampaigns,
  bulkAddMembersToCampaigns: bulkOperations.bulkAddMembersToCampaigns,
};
