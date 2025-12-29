// server/controllers/file/sales/campaigns/campaignMembers.js
const Campaign = require("../../../../models/file/sales/Campaign");

// Add members to campaign
const addMembersToCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { members } = req.body;

    console.log("=== ADD MEMBERS DEBUG ===");
    console.log("Campaign ID from params:", id);
    console.log("Members data received:", members);
    console.log("=== END DEBUG ===");

    // Find the campaign
    const campaign = await Campaign.findById(id);

    if (!campaign) {
      console.log("Campaign not found with ID:", id);
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    console.log("Campaign found:", campaign.campaignName);

    // Check current members structure
    console.log("Current members type:", typeof campaign.members);
    console.log("Current members:", campaign.members);
    console.log(
      "First member type:",
      campaign.members[0] ? typeof campaign.members[0] : "none"
    );

    // If members is currently an array of strings (JSON strings), parse them
    let existingMembers = [];
    if (Array.isArray(campaign.members)) {
      existingMembers = campaign.members.map((member) => {
        if (typeof member === "string") {
          try {
            return JSON.parse(member);
          } catch (e) {
            return { id: member.toString() };
          }
        }
        return member;
      });
    }

    console.log("Parsed existing members:", existingMembers);

    // Filter out members that already exist
    const existingMemberIds = existingMembers.map((m) => {
      if (m && typeof m === "object") return m.id;
      return m ? m.toString() : "";
    });

    const newMembers = members.filter(
      (member) => !existingMemberIds.includes(member.id)
    );

    console.log("New members to add (filtered):", newMembers.length);

    if (newMembers.length === 0) {
      return res.json({
        success: true,
        message: "No new members to add (all already exist)",
        data: campaign,
      });
    }

    // Create member objects
    const membersToAdd = newMembers.map((member) => {
      const memberObj = {
        id: String(member.id || ""),
        name: String(member.name || ""),
        email: String(member.email || ""),
        type: String(member.type || "lead"),
        company: String(member.company || ""),
        phone: String(member.phone || ""),
        addedDate: new Date().toISOString(),
        responded: false,
        converted: false,
        notes: "",
      };

      // Convert to JSON string for storage (if schema expects strings)
      return JSON.stringify(memberObj);
    });

    console.log("Members to add (formatted):", membersToAdd);

    // Add new members to the existing array
    const updatedMembers = [...campaign.members, ...membersToAdd];

    // Update the campaign
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      id,
      {
        $set: {
          members: updatedMembers,
          updatedBy: req.user?.id || "System",
          updatedAt: new Date(),
        },
      },
      {
        new: true,
      }
    );

    if (!updatedCampaign) {
      throw new Error("Failed to update campaign");
    }

    console.log("Campaign updated successfully");

    // Parse members back for response
    const parsedMembers = updatedCampaign.members.map((m) => {
      if (typeof m === "string") {
        try {
          return JSON.parse(m);
        } catch (e) {
          return { id: m, name: "Unknown" };
        }
      }
      return m;
    });

    const responseCampaign = updatedCampaign.toObject();
    responseCampaign.members = parsedMembers;

    res.json({
      success: true,
      message: `${newMembers.length} members added to campaign`,
      data: responseCampaign,
    });
  } catch (error) {
    console.error("Add members to campaign error:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    if (error.name === "ValidationError") {
      console.error("Validation errors:", error.errors);
      return res.status(400).json({
        success: false,
        message: "Validation error while adding members",
        errors: Object.values(error.errors).map((err) => ({
          path: err.path,
          message: err.message,
          value: err.value,
        })),
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid data format: ${error.message}`,
        path: error.path,
        value: error.value,
        kind: error.kind,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while adding members to campaign",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Remove members from campaign
const removeMembersFromCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberIds } = req.body;

    console.log("=== REMOVE MEMBERS DEBUG ===");
    console.log("Campaign ID:", id);
    console.log("Member IDs to remove:", memberIds);
    console.log("=== END DEBUG ===");

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    // Filter out members to remove
    const updatedMembers = campaign.members.filter((member) => {
      let memberId;
      if (typeof member === "string") {
        try {
          const parsed = JSON.parse(member);
          memberId = parsed.id;
        } catch (e) {
          memberId = member;
        }
      } else if (member && typeof member === "object") {
        memberId = member.id;
      } else {
        memberId = member ? member.toString() : "";
      }

      return !memberIds.includes(memberId);
    });

    const updateResult = await Campaign.findByIdAndUpdate(
      id,
      {
        $set: {
          members: updatedMembers,
          updatedBy: req.user?.id || "System",
          updatedAt: new Date(),
        },
      },
      {
        new: true,
      }
    );

    // Parse members for response
    const parsedMembers = updateResult.members.map((m) => {
      if (typeof m === "string") {
        try {
          return JSON.parse(m);
        } catch (e) {
          return { id: m, name: "Unknown" };
        }
      }
      return m;
    });

    const responseCampaign = updateResult.toObject();
    responseCampaign.members = parsedMembers;

    res.json({
      success: true,
      message: `${memberIds.length} members removed from campaign`,
      data: responseCampaign,
    });
  } catch (error) {
    console.error("Remove members from campaign error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while removing members from campaign",
    });
  }
};

// Update member status (responded/converted)
const updateMemberStatus = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const { status, value } = req.body;

    console.log("=== UPDATE MEMBER STATUS DEBUG ===");
    console.log("Campaign ID:", id);
    console.log("Member ID:", memberId);
    console.log("Status:", status, "Value:", value);
    console.log("=== END DEBUG ===");

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    // Find and update the specific member
    const updatedMembers = campaign.members.map((member) => {
      let memberObj;
      if (typeof member === "string") {
        try {
          memberObj = JSON.parse(member);
        } catch (e) {
          return member; // Return as-is if can't parse
        }
      } else {
        memberObj = member;
      }

      if (memberObj.id === memberId) {
        if (status === "responded") {
          memberObj.responded = value;
          memberObj.respondedDate = value ? new Date().toISOString() : null;
        } else if (status === "converted") {
          memberObj.converted = value;
          memberObj.convertedDate = value ? new Date().toISOString() : null;
        }

        // Convert back to string for storage
        return JSON.stringify(memberObj);
      }

      return member;
    });

    // Update the campaign
    const updateResult = await Campaign.findByIdAndUpdate(
      id,
      {
        $set: {
          members: updatedMembers,
          updatedBy: req.user?.id || "System",
          updatedAt: new Date(),
        },
      },
      {
        new: true,
      }
    );

    // Parse members for response
    const parsedMembers = updateResult.members.map((m) => {
      if (typeof m === "string") {
        try {
          return JSON.parse(m);
        } catch (e) {
          return { id: m, name: "Unknown" };
        }
      }
      return m;
    });

    const responseCampaign = updateResult.toObject();
    responseCampaign.members = parsedMembers;

    res.json({
      success: true,
      message: `Member ${status} status updated`,
      data: responseCampaign,
    });
  } catch (error) {
    console.error("Update member status error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

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
