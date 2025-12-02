// server/controllers/file/sales/leads/bulkOperations.js
const Lead = require("../../../../models/file/sales/Lead");

// Bulk update leads
const bulkUpdateLeads = async (req, res) => {
  try {
    const { leadIds, updates } = req.body;

    const result = await Lead.updateMany(
      {
        _id: { $in: leadIds },
      },
      { ...updates, updatedAt: Date.now() }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} leads updated successfully`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Bulk update leads error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during bulk update",
    });
  }
};

// Bulk delete leads
const bulkDeleteLeads = async (req, res) => {
  try {
    const { leadIds } = req.body;

    const result = await Lead.deleteMany({
      _id: { $in: leadIds },
    });

    res.json({
      success: true,
      message: `${result.deletedCount} leads deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Bulk delete leads error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during bulk deletion",
    });
  }
};

// Bulk convert leads
const bulkConvertLeads = async (req, res) => {
  try {
    const { leadIds } = req.body;

    const leads = await Lead.find({
      _id: { $in: leadIds },
      isConverted: false,
    });

    const conversionDate = new Date();
    const updatePromises = leads.map((lead) =>
      Lead.findByIdAndUpdate(lead._id, {
        isConverted: true,
        conversionDate,
        convertedToContactId: `contact_${Date.now()}_${lead._id}`,
        convertedToAccountId: `account_${Date.now()}_${lead._id}`,
      })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: `${leads.length} leads converted successfully`,
      convertedCount: leads.length,
    });
  } catch (error) {
    console.error("Bulk convert leads error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during bulk conversion",
    });
  }
};

// Manage lead tags
const manageLeadTags = async (req, res) => {
  try {
    const { leadIds, tagsToAdd = [], tagsToRemove = [] } = req.body;

    const leads = await Lead.find({
      _id: { $in: leadIds },
    });

    const updatePromises = leads.map((lead) => {
      const currentTags = lead.tags || [];
      const updatedTags = [
        ...currentTags.filter((tag) => !tagsToRemove.includes(tag)),
        ...tagsToAdd.filter((tag) => !currentTags.includes(tag)),
      ];

      return Lead.findByIdAndUpdate(lead._id, {
        tags: updatedTags,
        updatedAt: Date.now(),
      });
    });

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: `Tags updated for ${leads.length} leads`,
    });
  } catch (error) {
    console.error("Manage tags error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while managing tags",
    });
  }
};

module.exports = {
  bulkUpdateLeads,
  bulkDeleteLeads,
  bulkConvertLeads,
  manageLeadTags,
};
