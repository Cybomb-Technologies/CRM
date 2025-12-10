// server/controllers/file/sales/campaigns/campaignMembers.js
const Campaign = require("../../../../models/file/sales/Campaign");

// Add members to campaign
const addMembersToCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { members } = req.body;

    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    // Filter out members that already exist
    const existingMemberIds = campaign.members.map((m) => m.id);
    const newMembers = members.filter(
      (member) => !existingMemberIds.includes(member.id)
    );

    // Add new members with timestamps
    const membersWithTimestamps = newMembers.map((member) => ({
      ...member,
      addedDate: new Date(),
    }));

    campaign.members.push(...membersWithTimestamps);
    campaign.updatedBy = req.user?.id || "System";
    await campaign.save();

    res.json({
      success: true,
      message: `${newMembers.length} members added to campaign`,
      data: campaign,
    });
  } catch (error) {
    console.error("Add members to campaign error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding members to campaign",
    });
  }
};

// Remove members from campaign
const removeMembersFromCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { memberIds } = req.body;

    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    // Remove specified members
    campaign.members = campaign.members.filter(
      (member) => !memberIds.includes(member.id)
    );

    campaign.updatedBy = req.user?.id || "System";
    await campaign.save();

    res.json({
      success: true,
      message: `${memberIds.length} members removed from campaign`,
      data: campaign,
    });
  } catch (error) {
    console.error("Remove members from campaign error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while removing members from campaign",
    });
  }
};

// Update member status (responded/converted)
const updateMemberStatus = async (req, res) => {
  try {
    const { campaignId, memberId } = req.params;
    const { status, value } = req.body; // status: 'responded' or 'converted'

    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    const member = campaign.members.id(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found in campaign",
      });
    }

    if (status === "responded") {
      member.responded = value;
      member.respondedDate = value ? new Date() : null;
    } else if (status === "converted") {
      member.converted = value;
      member.convertedDate = value ? new Date() : null;
    }

    campaign.updatedBy = req.user?.id || "System";
    await campaign.save();

    // Update campaign analytics
    if (status === "responded" && value) {
      campaign.totalResponses = (campaign.totalResponses || 0) + 1;
    }
    if (status === "converted" && value) {
      campaign.totalConversions = (campaign.totalConversions || 0) + 1;
    }

    await campaign.save();

    res.json({
      success: true,
      message: `Member ${status} status updated`,
      data: campaign,
    });
  } catch (error) {
    console.error("Update member status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating member status",
    });
  }
};

module.exports = {
  addMembersToCampaign,
  removeMembersFromCampaign,
  updateMemberStatus,
};
