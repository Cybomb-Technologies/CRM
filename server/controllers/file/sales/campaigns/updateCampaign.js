// server/controllers/file/sales/campaigns/updateCampaign.js
const Campaign = require("../../../../models/file/sales/Campaign");

// Update campaign
const updateCampaign = async (req, res) => {
  try {
    const updateData = req.body;
    updateData.updatedBy = req.user?.id || "System";

    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.json({
      success: true,
      message: "Campaign updated successfully",
      data: campaign,
    });
  } catch (error) {
    console.error("Update campaign error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating campaign",
    });
  }
};

module.exports = {
  updateCampaign,
};
