const Contact = require("../../../../models/file/sales/Contact");

const bulkUpdateContacts = async (req, res) => {
  try {
    const { contactIds, updates } = req.body;

    console.log("Bulk update request:", { contactIds, updates });

    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Contact IDs are required",
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
      "email",
      "firstName",
      "lastName",
    ];
    for (const field of disallowedFields) {
      if (cleanUpdates[field] !== undefined) {
        delete cleanUpdates[field];
      }
    }

    // Add updatedBy and updatedAt
    cleanUpdates.updatedBy = req.user ? req.user.id : "system";
    cleanUpdates.updatedAt = new Date();

    console.log("Clean updates for bulk update:", cleanUpdates);

    const result = await Contact.updateMany(
      { _id: { $in: contactIds } },
      { $set: cleanUpdates },
      { runValidators: true }
    );

    console.log("Bulk update result:", result);

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} contacts updated successfully`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Bulk update contacts error:", error);

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
      message: "Failed to update contacts",
      error: error.message,
    });
  }
};

const bulkDeleteContacts = async (req, res) => {
  try {
    const { contactIds } = req.body;

    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Contact IDs are required",
      });
    }

    const contacts = await Contact.find({ _id: { $in: contactIds } });

    if (contacts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No contacts found with the provided IDs",
      });
    }

    const result = await Contact.deleteMany({ _id: { $in: contactIds } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} contacts deleted successfully`,
      deletedCount: result.deletedCount,
      deletedContacts: contacts.map((contact) => ({
        id: contact._id,
        name: `${contact.firstName} ${contact.lastName}`,
        email: contact.email,
      })),
    });
  } catch (error) {
    console.error("Bulk delete contacts error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete contacts",
      error: error.message,
    });
  }
};

module.exports = { bulkUpdateContacts, bulkDeleteContacts };
