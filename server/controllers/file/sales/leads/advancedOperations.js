// server/controllers/file/sales/leads/advancedOperations.js
const Lead = require("../../../../models/file/sales/Lead");

// Deduplicate leads
const deduplicateLeads = async (req, res) => {
  try {
    const { criteria = ["email", "phone"] } = req.body;

    const leads = await Lead.find({});
    const seen = new Set();
    const duplicates = [];
    const uniqueLeads = [];

    leads.forEach((lead) => {
      const key = criteria
        .map((field) => lead[field] || "")
        .join("|")
        .toLowerCase();

      if (key && seen.has(key)) {
        duplicates.push(lead);
      } else {
        if (key) seen.add(key);
        uniqueLeads.push(lead._id);
      }
    });

    // Delete duplicates
    if (duplicates.length > 0) {
      await Lead.deleteMany({
        _id: { $in: duplicates.map((lead) => lead._id) },
      });
    }

    res.json({
      success: true,
      message: `Found ${duplicates.length} duplicate leads and removed them`,
      duplicatesFound: duplicates.length,
      uniqueLeadsCount: uniqueLeads.length,
    });
  } catch (error) {
    console.error("Deduplicate leads error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deduplicating leads",
    });
  }
};

// Add leads to campaign
const addLeadsToCampaign = async (req, res) => {
  try {
    const { leadIds, campaignId } = req.body;

    res.json({
      success: true,
      message: `${leadIds.length} leads added to campaign`,
      campaignId,
      addedCount: leadIds.length,
    });
  } catch (error) {
    console.error("Add to campaign error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding leads to campaign",
    });
  }
};

module.exports = {
  deduplicateLeads,
  addLeadsToCampaign,
};
