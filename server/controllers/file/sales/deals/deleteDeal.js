const Deal = require("../../../../models/file/sales/Deal");

const deleteDeal = async (req, res) => {
  try {
    const { id } = req.params;

    const deal = await Deal.findById(id);
    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    await Deal.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Deal deleted successfully",
      deletedDeal: {
        id: deal._id,
        title: deal.title,
        company: deal.company,
        value: deal.value,
      },
    });
  } catch (error) {
    console.error("Delete deal error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid deal ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete deal",
      error: error.message,
    });
  }
};

module.exports = deleteDeal;
