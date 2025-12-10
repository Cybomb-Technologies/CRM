const Deal = require("../../../../models/file/sales/Deal");

const moveDealStage = async (req, res) => {
  try {
    const { dealId } = req.params;
    const { newStage } = req.body;

    if (!dealId) {
      return res.status(400).json({
        success: false,
        message: "Deal ID is required",
      });
    }

    if (!newStage) {
      return res.status(400).json({
        success: false,
        message: "New stage is required",
      });
    }

    // Validate stage
    const validStages = [
      "qualification",
      "needs-analysis",
      "value-proposition",
      "identify-decision-makers",
      "proposal-price-quote",
      "negotiation-review",
      "closed-won",
      "closed-lost",
      "closed-lost-to-competition",
    ];

    if (!validStages.includes(newStage)) {
      return res.status(400).json({
        success: false,
        message: "Invalid stage",
      });
    }

    // Find the deal
    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    const oldStage = deal.stage;

    // Update deal stage
    deal.stage = newStage;
    deal.updatedBy = req.user ? req.user.id : "system";
    deal.updatedAt = new Date();

    await deal.save();

    res.status(200).json({
      success: true,
      message: `Deal moved from ${oldStage} to ${newStage}`,
      deal,
    });
  } catch (error) {
    console.error("Move deal stage error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid deal ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to move deal stage",
      error: error.message,
    });
  }
};

const bulkMoveDealsStage = async (req, res) => {
  try {
    const { dealIds, newStage } = req.body;

    if (!dealIds || !Array.isArray(dealIds) || dealIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Deal IDs are required",
      });
    }

    if (!newStage) {
      return res.status(400).json({
        success: false,
        message: "New stage is required",
      });
    }

    // Validate stage
    const validStages = [
      "qualification",
      "needs-analysis",
      "value-proposition",
      "identify-decision-makers",
      "proposal-price-quote",
      "negotiation-review",
      "closed-won",
      "closed-lost",
      "closed-lost-to-competition",
    ];

    if (!validStages.includes(newStage)) {
      return res.status(400).json({
        success: false,
        message: "Invalid stage",
      });
    }

    // Update all deals
    const result = await Deal.updateMany(
      { _id: { $in: dealIds } },
      {
        $set: {
          stage: newStage,
          updatedBy: req.user ? req.user.id : "system",
          updatedAt: new Date(),
        },
      }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} deals moved to ${newStage}`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Bulk move deals stage error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid deal ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to move deals stage",
      error: error.message,
    });
  }
};

module.exports = { moveDealStage, bulkMoveDealsStage };
