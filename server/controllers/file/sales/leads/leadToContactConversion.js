// server/controllers/file/sales/leads/leadToContactConversion.js
const mongoose = require("mongoose");
const Lead = require("../../../../models/file/sales/Lead");
const Contact = require("../../../../models/file/sales/Contact");
const Account = require("../../../../models/file/sales/Account");

// Convert lead to contact ONLY (no account creation)
const convertLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Check if lead is already converted to CONTACT
    if (lead.convertedToContactId) {
      return res.status(400).json({
        success: false,
        message: "Lead is already converted to contact",
      });
    }

    // Allow conversion even if lead is converted to account (but not to contact)

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
      company: lead.company,

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
      accountName: lead.company,

      // If lead already has an account, link the contact to that account
      accountId: lead.convertedToAccountId || null,
    };

    // Create the contact in database
    const contact = new Contact(contactData);
    await contact.save();

    // Update lead as converted to contact
    lead.isConverted = true;
    lead.conversionDate = new Date();
    lead.convertedToContactId = contact._id.toString();
    await lead.save();

    // CRITICAL FIX: If lead was already converted to account, update account's contacts counter
    if (lead.convertedToAccountId) {
      try {
        // Find the account
        const account = await Account.findById(lead.convertedToAccountId);
        if (account) {
          // Increment contacts counter
          account.contacts = (account.contacts || 0) + 1;
          account.updatedAt = new Date();
          account.updatedBy = "System";
          await account.save();

          console.log(
            `Updated account ${account._id} contacts counter to: ${account.contacts}`
          );
        }
      } catch (accountError) {
        console.error("Error updating account contacts counter:", accountError);
        // Don't fail the whole operation if account update fails
      }
    }

    // Convert image for response
    const leadObj = lead.toObject();
    if (leadObj.image && leadObj.image.data) {
      leadObj.imageUrl = `data:${
        leadObj.image.contentType
      };base64,${leadObj.image.data.toString("base64")}`;
    }

    res.json({
      success: true,
      message: "Lead converted to contact successfully",
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
          accountId: contact.accountId,
        },
        // Include account data if lead was already converted to account
        account: lead.convertedToAccountId
          ? {
              id: lead.convertedToAccountId,
              exists: true,
              contactsUpdated: true,
              note: "Account contacts counter has been updated",
            }
          : null,
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
      // Create new contact if doesn't exist
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
        accountId: lead.convertedToAccountId || null,
      };

      contact = new Contact(contactData);
      await contact.save();

      // Mark lead as converted to contact
      lead.isConverted = true;
      lead.conversionDate = new Date();
      lead.convertedToContactId = contact._id.toString();

      // If lead has an account, update account's contacts counter
      if (lead.convertedToAccountId) {
        try {
          const account = await Account.findById(lead.convertedToAccountId);
          if (account) {
            account.contacts = (account.contacts || 0) + 1;
            account.updatedAt = new Date();
            account.updatedBy = "System";
            await account.save();
            console.log(
              `Updated account ${account._id} contacts counter to: ${account.contacts}`
            );
          }
        } catch (accountError) {
          console.error(
            "Error updating account contacts counter in sync:",
            accountError
          );
        }
      }

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

module.exports = {
  convertLead,
  syncLeadToContact,
};
