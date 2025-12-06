// server/controllers/file/sales/leads/bulkOperations.js
const Lead = require("../../../../models/file/sales/Lead");
const Contact = require("../../../../models/file/sales/Contact"); // ADD THIS

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

// Bulk convert leads - FIXED TO ACTUALLY CREATE CONTACTS
const bulkConvertLeads = async (req, res) => {
  try {
    const { leadIds } = req.body;

    // Get the leads that are not converted
    const leads = await Lead.find({
      _id: { $in: leadIds },
      isConverted: false,
    });

    if (leads.length === 0) {
      return res.json({
        success: true,
        message: "No unconverted leads found",
        convertedCount: 0,
      });
    }

    const conversionDate = new Date();
    const conversionPromises = [];

    // Process each lead to create a contact
    for (const lead of leads) {
      // Create contact data from lead
      const contactData = {
        firstName: lead.firstName,
        lastName: lead.lastName,
        title: lead.title,
        department: "None",
        email: lead.email,
        phone: lead.phone,
        mobile: lead.mobile,
        leadSource: lead.leadSource,
        emailOptOut: lead.emailOptOut,
        mailingAddress: {
          street: lead.streetAddress || "",
          city: lead.city || "",
          state: lead.state || "",
          zipCode: lead.zipCode || "",
          country: lead.country || "",
        },
        description: lead.description || "",
        convertedFromLead: lead._id.toString(),
        leadConversionDate: conversionDate,
        lastSyncedFromLead: conversionDate,
        createdBy: lead.createdBy || "System",
        accountName: lead.company,
      };

      // Create contact
      const contact = new Contact(contactData);
      const saveContactPromise = contact.save();

      // Update lead
      const updateLeadPromise = Lead.findByIdAndUpdate(lead._id, {
        isConverted: true,
        conversionDate,
        convertedToContactId: contact._id.toString(),
        convertedToAccountId: `account_${Date.now()}_${lead._id}`,
      });

      conversionPromises.push(saveContactPromise, updateLeadPromise);
    }

    // Execute all promises
    await Promise.all(conversionPromises);

    res.json({
      success: true,
      message: `${leads.length} leads converted successfully and contacts created`,
      convertedCount: leads.length,
    });
  } catch (error) {
    console.error("Bulk convert leads error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during bulk conversion",
      error: error.message,
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
