const Deal = require("../../../../models/file/sales/Deal");
const mongoose = require("mongoose");

const updateDeal = async (req, res) => {
  console.log("📥 Update deal request:", {
    id: req.params.id,
    body: req.body,
  });

  try {
    const { id } = req.params;
    let updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Deal ID is required",
      });
    }

    console.log("Processing update for deal ID:", id);
    console.log("Update data received:", updateData);

    // Clean up update data - remove fields that shouldn't be updated
    const disallowedFields = [
      "_id",
      "id",
      "createdBy",
      "createdAt",
      "__v",
      "updatedAt",
    ];
    disallowedFields.forEach((field) => {
      delete updateData[field];
    });

    // Add updatedBy and updatedAt
    updateData.updatedBy = req.user ? req.user.id : "system";
    updateData.updatedAt = new Date();

    // Validate required fields if they're being updated
    if (updateData.title !== undefined && !updateData.title) {
      return res.status(400).json({
        success: false,
        message: "Deal title is required",
      });
    }

    if (updateData.company !== undefined && !updateData.company) {
      return res.status(400).json({
        success: false,
        message: "Company is required",
      });
    }

    // Handle number conversions
    if (updateData.value !== undefined) {
      updateData.value = parseFloat(updateData.value) || 0;
    }

    if (updateData.probability !== undefined) {
      updateData.probability = Math.min(
        100,
        Math.max(0, parseInt(updateData.probability) || 0)
      );
    }

    // Handle date conversion
    if (updateData.closeDate !== undefined) {
      updateData.closeDate = new Date(updateData.closeDate);
    }

    console.log("Final update data:", updateData);

    // Find and update deal
    let deal;

    // Try to find by MongoDB _id first
    if (mongoose.Types.ObjectId.isValid(id)) {
      deal = await Deal.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }

    // If not found by _id, try to find by any other means
    if (!deal) {
      // Try to find by any unique field and update
      deal = await Deal.findOneAndUpdate(
        { _id: id },
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    console.log("✅ Deal updated successfully:", deal._id);

    res.status(200).json({
      success: true,
      message: "Deal updated successfully",
      deal,
    });
  } catch (error) {
    console.error("🔥 Update deal error:", {
      name: error.name,
      message: error.message,
      errors: error.errors,
    });

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid deal ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update deal",
      error: error.message,
    });
  }
};

module.exports = updateDeal;
