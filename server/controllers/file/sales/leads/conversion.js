// server/controllers/file/sales/leads/conversion.js
const Lead = require("../../../../models/file/sales/Lead");

// Convert lead to contact
const convertLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (lead.isConverted) {
      return res.status(400).json({
        success: false,
        message: "Lead is already converted",
      });
    }

    // Update lead as converted
    lead.isConverted = true;
    lead.conversionDate = new Date();
    lead.convertedToContactId = `contact_${Date.now()}`;
    lead.convertedToAccountId = `account_${Date.now()}`;
    await lead.save();

    // Convert image for response
    const leadObj = lead.toObject();
    if (leadObj.image && leadObj.image.data) {
      leadObj.imageUrl = `data:${
        leadObj.image.contentType
      };base64,${leadObj.image.data.toString("base64")}`;
    }

    res.json({
      success: true,
      message: "Lead converted successfully",
      data: {
        lead: leadObj,
        contact: {
          id: lead.convertedToContactId,
          name: `${lead.firstName} ${lead.lastName}`,
          email: lead.email,
        },
        account: {
          id: lead.convertedToAccountId,
          name: lead.company,
        },
      },
    });
  } catch (error) {
    console.error("Convert lead error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while converting lead",
    });
  }
};

// Sync lead to contact
const syncLeadToContact = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (!lead.isConverted) {
      return res.status(400).json({
        success: false,
        message: "Lead must be converted first",
      });
    }

    res.json({
      success: true,
      message: "Lead data synced to contact successfully",
      data: {
        lead,
        lastSynced: new Date(),
      },
    });
  } catch (error) {
    console.error("Sync lead error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while syncing lead",
    });
  }
};

// Approve leads
const approveLeads = async (req, res) => {
  try {
    const { leadIds } = req.body;

    const result = await Lead.updateMany(
      {
        _id: { $in: leadIds },
      },
      {
        isApproved: true,
        approvedAt: new Date(),
        approvedBy: "System",
        leadStatus: "Qualified",
        updatedAt: Date.now(),
      }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} leads approved successfully`,
      approvedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Approve leads error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while approving leads",
    });
  }
};

module.exports = {
  convertLead,
  syncLeadToContact,
  approveLeads,
};
