// server/controllers/file/sales/campaigns/bulkOperations.js
const Campaign = require("../../../../models/file/sales/Campaign");

// Bulk update campaigns
const bulkUpdateCampaigns = async (req, res) => {
  try {
    const { campaignIds, updates } = req.body;

    if (
      !campaignIds ||
      !Array.isArray(campaignIds) ||
      campaignIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "No campaign IDs provided",
      });
    }

    // Add updatedBy and updatedAt
    const finalUpdates = {
      ...updates,
      updatedBy: req.user?.id || "System",
      updatedAt: Date.now(),
    };

    const result = await Campaign.updateMany(
      { _id: { $in: campaignIds } },
      { $set: finalUpdates }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} campaigns updated successfully`,
      data: result,
    });
  } catch (error) {
    console.error("Bulk update campaigns error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while bulk updating campaigns",
    });
  }
};

// Bulk delete (archive) campaigns
const bulkDeleteCampaigns = async (req, res) => {
  try {
    const { campaignIds } = req.body;

    if (
      !campaignIds ||
      !Array.isArray(campaignIds) ||
      campaignIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "No campaign IDs provided",
      });
    }

    const result = await Campaign.updateMany(
      { _id: { $in: campaignIds } },
      {
        $set: {
          isArchived: true,
          updatedBy: req.user?.id || "System",
          updatedAt: Date.now(),
        },
      }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} campaigns archived successfully`,
      data: result,
    });
  } catch (error) {
    console.error("Bulk delete campaigns error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while bulk deleting campaigns",
    });
  }
};

// Bulk add members to campaigns
const bulkAddMembersToCampaigns = async (req, res) => {
  try {
    const { campaignIds, members } = req.body;

    if (
      !campaignIds ||
      !Array.isArray(campaignIds) ||
      campaignIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "No campaign IDs provided",
      });
    }

    if (!members || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No members provided",
      });
    }

    const campaigns = await Campaign.find({ _id: { $in: campaignIds } });

    for (const campaign of campaigns) {
      // Filter out members that already exist
      const existingMemberIds = campaign.members.map((m) => m.id);
      const newMembers = members.filter(
        (member) => !existingMemberIds.includes(member.id)
      );

      if (newMembers.length > 0) {
        const membersWithTimestamps = newMembers.map((member) => ({
          ...member,
          addedDate: new Date(),
        }));

        campaign.members.push(...membersWithTimestamps);
        campaign.updatedBy = req.user?.id || "System";
        await campaign.save();
      }
    }

    res.json({
      success: true,
      message: `Members added to ${campaigns.length} campaigns`,
    });
  } catch (error) {
    console.error("Bulk add members to campaigns error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while bulk adding members to campaigns",
    });
  }
};

module.exports = {
  bulkUpdateCampaigns,
  bulkDeleteCampaigns,
  bulkAddMembersToCampaigns,
};
