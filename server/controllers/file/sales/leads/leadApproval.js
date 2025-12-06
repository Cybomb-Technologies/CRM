// server/controllers/file/sales/leads/leadApproval.js
const Lead = require("../../../../models/file/sales/Lead");

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
  approveLeads,
};
