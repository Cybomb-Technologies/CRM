// server/controllers/file/sales/campaigns/createCampaign.js
const Campaign = require("../../../../models/file/sales/Campaign");

// Create new campaign
const createCampaign = async (req, res) => {
  try {
    const campaignData = req.body;

    // Validate required fields
    if (!campaignData.campaignName) {
      return res.status(400).json({
        success: false,
        message: "Campaign Name is required",
      });
    }

    // Set default values
    const finalCampaignData = {
      ...campaignData,
      campaignOwner: campaignData.campaignOwner || "Current User",
      createdBy: req.user?.id || "System",
      members: campaignData.members || [],
      activities: campaignData.activities || [],
      status: campaignData.status || "Planning",
    };

    // Create campaign
    const campaign = new Campaign(finalCampaignData);
    await campaign.save();

    res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      data: campaign,
    });
  } catch (error) {
    console.error("Create campaign error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating campaign",
    });
  }
};

module.exports = {
  createCampaign,
};
