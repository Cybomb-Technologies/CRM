// server/controllers/file/sales/campaigns/deleteCampaign.js
const Campaign = require("../../../../models/file/sales/Campaign");

// Delete campaign (soft delete - set as archived)
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    // Soft delete - set as archived
    campaign.isArchived = true;
    campaign.updatedBy = req.user?.id || "System";
    await campaign.save();

    res.json({
      success: true,
      message: "Campaign archived successfully",
    });
  } catch (error) {
    console.error("Delete campaign error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting campaign",
    });
  }
};

// Permanent delete (for admin use)
const permanentDeleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.json({
      success: true,
      message: "Campaign permanently deleted",
    });
  } catch (error) {
    console.error("Permanent delete campaign error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting campaign",
    });
  }
};

module.exports = {
  deleteCampaign,
  permanentDeleteCampaign,
};
