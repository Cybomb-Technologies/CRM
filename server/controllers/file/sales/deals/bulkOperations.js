const Deal = require("../../../../models/file/sales/Deal");

const bulkUpdateDeals = async (req, res) => {
  try {
    const { dealIds, updates } = req.body;

    console.log("Bulk update deals request:", { dealIds, updates });

    if (!dealIds || !Array.isArray(dealIds) || dealIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Deal IDs are required",
      });
    }

    if (
      !updates ||
      typeof updates !== "object" ||
      Object.keys(updates).length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Updates are required",
      });
    }

    // Clean updates - remove empty or invalid values
    const cleanUpdates = { ...updates };
    Object.keys(cleanUpdates).forEach((key) => {
      if (
        cleanUpdates[key] === undefined ||
        cleanUpdates[key] === null ||
        cleanUpdates[key] === "" ||
        cleanUpdates[key] === "no-change"
      ) {
        delete cleanUpdates[key];
      }
    });

    if (Object.keys(cleanUpdates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid updates provided",
      });
    }

    // Don't allow updating certain fields in bulk
    const disallowedFields = [
      "_id",
      "id",
      "createdBy",
      "createdAt",
      "title",
      "company",
    ];
    for (const field of disallowedFields) {
      if (cleanUpdates[field] !== undefined) {
        delete cleanUpdates[field];
      }
    }

    // Handle number conversions
    if (cleanUpdates.value !== undefined) {
      cleanUpdates.value = parseFloat(cleanUpdates.value) || 0;
    }

    if (cleanUpdates.probability !== undefined) {
      cleanUpdates.probability = Math.min(
        100,
        Math.max(0, parseInt(cleanUpdates.probability) || 0)
      );
    }

    // Add updatedBy and updatedAt
    cleanUpdates.updatedBy = req.user ? req.user.id : "system";
    cleanUpdates.updatedAt = new Date();

    console.log("Clean updates for bulk update:", cleanUpdates);

    const result = await Deal.updateMany(
      { _id: { $in: dealIds } },
      { $set: cleanUpdates },
      { runValidators: true }
    );

    console.log("Bulk update result:", result);

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} deals updated successfully`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Bulk update deals error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update deals",
      error: error.message,
    });
  }
};

const bulkDeleteDeals = async (req, res) => {
  try {
    const { dealIds } = req.body;

    if (!dealIds || !Array.isArray(dealIds) || dealIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Deal IDs are required",
      });
    }

    const deals = await Deal.find({ _id: { $in: dealIds } });

    if (deals.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No deals found with the provided IDs",
      });
    }

    const result = await Deal.deleteMany({ _id: { $in: dealIds } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} deals deleted successfully`,
      deletedCount: result.deletedCount,
      deletedDeals: deals.map((deal) => ({
        id: deal._id,
        title: deal.title,
        company: deal.company,
        value: deal.value,
      })),
    });
  } catch (error) {
    console.error("Bulk delete deals error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid deal ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete deals",
      error: error.message,
    });
  }
};

module.exports = { bulkUpdateDeals, bulkDeleteDeals };
