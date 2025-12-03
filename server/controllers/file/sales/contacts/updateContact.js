const Contact = require("../../../../models/file/sales/Contact");
const mongoose = require("mongoose");

const updateContact = async (req, res) => {
  console.log("📥 Update contact request:", {
    id: req.params.id,
    body: req.body,
  });

  try {
    const { id } = req.params;
    let updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Contact ID is required",
      });
    }

    console.log("Processing update for contact ID:", id);
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
    if (updateData.firstName !== undefined && !updateData.firstName) {
      return res.status(400).json({
        success: false,
        message: "First name is required",
      });
    }
    if (updateData.lastName !== undefined && !updateData.lastName) {
      return res.status(400).json({
        success: false,
        message: "Last name is required",
      });
    }

    console.log("Final update data:", updateData);

    // Find and update contact
    let contact;

    // Try to find by MongoDB _id first
    if (mongoose.Types.ObjectId.isValid(id)) {
      contact = await Contact.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }

    // If not found by _id, try to find by any other means
    if (!contact) {
      // Try to find by any unique field and update
      contact = await Contact.findOneAndUpdate(
        { _id: id },
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    console.log("✅ Contact updated successfully:", contact._id);

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      contact,
    });
  } catch (error) {
    console.error("🔥 Update contact error:", {
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
        message: "Invalid contact ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update contact",
      error: error.message,
    });
  }
};

module.exports = updateContact;
