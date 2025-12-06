// server/controllers/file/sales/leads/deleteLead.js
const Lead = require("../../../../models/file/sales/Lead");

// Delete lead
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Delete lead error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting lead",
    });
  }
};

module.exports = {
  deleteLead,
};
