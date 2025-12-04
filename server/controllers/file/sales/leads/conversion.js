// server/controllers/file/sales/leads/conversion.js
const Lead = require("../../../../models/file/sales/Lead");
const Contact = require("../../../../models/file/sales/Contact"); // ADD THIS

// Convert lead to contact
const convertLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (lead.isConverted) {
      return res.status(400).json({
        success: false,
        message: "Lead is already converted",
      });
    }

    // ACTUALLY CREATE CONTACT FROM LEAD DATA
    const contactData = {
      // Map lead fields to contact fields
      firstName: lead.firstName,
      lastName: lead.lastName,
      title: lead.title,
      department: "None", // Default value
      email: lead.email,
      phone: lead.phone,
      mobile: lead.mobile,
      leadSource: lead.leadSource,
      emailOptOut: lead.emailOptOut,
      company: lead.company, // Will be mapped to accountName

      // Address information
      mailingAddress: {
        street: lead.streetAddress || "",
        city: lead.city || "",
        state: lead.state || "",
        zipCode: lead.zipCode || "",
        country: lead.country || "",
      },

      // Description
      description: lead.description || "",

      // Lead conversion tracking
      convertedFromLead: lead._id.toString(),
      leadConversionDate: new Date(),
      lastSyncedFromLead: new Date(),

      // System fields
      createdBy: lead.createdBy || "System",
      accountName: lead.company, // Company becomes account name
    };

    // Create the contact in database
    const contact = new Contact(contactData);
    await contact.save();

    // Update lead as converted with the actual contact ID
    lead.isConverted = true;
    lead.conversionDate = new Date();
    lead.convertedToContactId = contact._id.toString();
    lead.convertedToAccountId = `account_${Date.now()}`;
    await lead.save();

    // Convert image for response
    const leadObj = lead.toObject();
    if (leadObj.image && leadObj.image.data) {
      leadObj.imageUrl = `data:${
        leadObj.image.contentType
      };base64,${leadObj.image.data.toString("base64")}`;
    }

    res.json({
      success: true,
      message: "Lead converted successfully and contact created",
      data: {
        lead: leadObj,
        contact: {
          id: contact._id,
          _id: contact._id,
          name: `${contact.firstName} ${contact.lastName}`,
          email: contact.email,
          phone: contact.phone,
          accountName: contact.accountName,
          convertedFromLead: contact.convertedFromLead,
        },
        account: {
          id: lead.convertedToAccountId,
          name: lead.company,
        },
      },
    });
  } catch (error) {
    console.error("Convert lead error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while converting lead",
      error: error.message,
    });
  }
};

// Sync lead to contact
const syncLeadToContact = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Check if contact already exists for this lead
    let contact = await Contact.findOne({
      convertedFromLead: lead._id.toString(),
    });

    if (contact) {
      // Update existing contact with latest lead data
      contact.firstName = lead.firstName;
      contact.lastName = lead.lastName;
      contact.title = lead.title;
      contact.email = lead.email;
      contact.phone = lead.phone;
      contact.mobile = lead.mobile;
      contact.leadSource = lead.leadSource;
      contact.emailOptOut = lead.emailOptOut;
      contact.accountName = lead.company;
      contact.mailingAddress = {
        street: lead.streetAddress || "",
        city: lead.city || "",
        state: lead.state || "",
        zipCode: lead.zipCode || "",
        country: lead.country || "",
      };
      contact.description = lead.description || "";
      contact.lastSyncedFromLead = new Date();
      contact.updatedBy = "System";
      contact.updatedAt = new Date();

      await contact.save();
    } else {
      // Create new contact if doesn't exist (similar to convertLead)
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
        leadConversionDate: new Date(),
        lastSyncedFromLead: new Date(),
        createdBy: lead.createdBy || "System",
        accountName: lead.company,
      };

      contact = new Contact(contactData);
      await contact.save();

      // Mark lead as converted
      lead.isConverted = true;
      lead.conversionDate = new Date();
      lead.convertedToContactId = contact._id.toString();
      lead.convertedToAccountId = `account_${Date.now()}`;
      await lead.save();
    }

    res.json({
      success: true,
      message: contact
        ? "Contact updated with lead data"
        : "Contact created from lead data",
      data: {
        lead,
        contact: {
          id: contact._id,
          name: `${contact.firstName} ${contact.lastName}`,
          email: contact.email,
          phone: contact.phone,
        },
        lastSynced: new Date(),
      },
    });
  } catch (error) {
    console.error("Sync lead error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while syncing lead",
      error: error.message,
    });
  }
};

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
  convertLead,
  syncLeadToContact,
  approveLeads,
};
