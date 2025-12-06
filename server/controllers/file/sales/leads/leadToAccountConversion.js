// server/controllers/file/sales/leads/leadToAccountConversion.js
const mongoose = require("mongoose");
const Lead = require("../../../../models/file/sales/Lead");
const Contact = require("../../../../models/file/sales/Contact");
const Account = require("../../../../models/file/sales/Account");

// Convert lead to account ONLY (no contact creation unless already exists)
const convertLeadToAccount = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Check if lead is already converted to account
    if (lead.convertedToAccountId) {
      return res.status(400).json({
        success: false,
        message: "Lead is already converted to an account",
      });
    }

    // Parse annual revenue from lead
    let annualRevenue = 0;
    if (lead.annualRevenue !== undefined && lead.annualRevenue !== null) {
      if (typeof lead.annualRevenue === "string") {
        // Remove all non-numeric characters except decimal point
        const cleanRevenue = lead.annualRevenue
          .toString()
          .replace(/[^\d.]/g, "");
        annualRevenue = parseFloat(cleanRevenue) || 0;
      } else {
        annualRevenue = parseFloat(lead.annualRevenue) || 0;
      }
    }

    // Parse employees from lead
    let employees = 0;
    if (
      lead.numberOfEmployees !== undefined &&
      lead.numberOfEmployees !== null
    ) {
      if (typeof lead.numberOfEmployees === "string") {
        employees = parseInt(lead.numberOfEmployees, 10) || 0;
      } else {
        employees = parseInt(lead.numberOfEmployees) || 0;
      }
    }

    console.log(
      "Converting lead to account. Annual revenue from lead:",
      lead.annualRevenue,
      "Parsed:",
      annualRevenue,
      "Type:",
      typeof annualRevenue
    );

    // Count existing contacts for this lead (if any)
    const existingContactsCount = await Contact.countDocuments({
      convertedFromLead: lead._id.toString(),
    });

    // Create account data from lead
    const accountData = {
      name: lead.company || `${lead.firstName} ${lead.lastName}`,
      website: lead.website || "",
      phone: lead.phone || "",
      email: lead.email || "",
      industry: lead.industry || "",
      type: "Customer",
      contacts: existingContactsCount, // Count existing contacts if any
      employees: employees,
      annualRevenue: annualRevenue,
      description:
        lead.description ||
        `Converted from lead: ${lead.firstName} ${lead.lastName}`,

      // Billing address from lead address
      billingAddress: {
        street: lead.streetAddress || "",
        city: lead.city || "",
        state: lead.state || "",
        zipCode: lead.zipCode || "",
        country: lead.country || "",
      },

      // Shipping address same as billing for now
      shippingAddress: {
        street: lead.streetAddress || "",
        city: lead.city || "",
        state: lead.state || "",
        zipCode: lead.zipCode || "",
        country: lead.country || "",
      },

      // System fields
      createdBy: lead.createdBy || "System",
      updatedBy: "System",
    };

    console.log("Account data being created:", accountData);

    // Create the account
    const account = new Account(accountData);
    await account.save();

    console.log(
      "Account created with annual revenue:",
      account.annualRevenue,
      "Type:",
      typeof account.annualRevenue,
      "Contacts:",
      account.contacts
    );

    // Update any existing contacts to link them to this new account
    if (existingContactsCount > 0) {
      await Contact.updateMany(
        { convertedFromLead: lead._id.toString() },
        {
          accountId: account._id.toString(),
          accountName: account.name,
          updatedAt: new Date(),
          updatedBy: "System",
        }
      );
      console.log(
        `Updated ${existingContactsCount} existing contacts to link to account ${account._id}`
      );
    }

    // Update lead with account conversion info
    lead.isConverted = true;
    lead.convertedToAccountId = account._id.toString();
    lead.accountConversionDate = new Date();
    lead.lastSyncedToAccount = new Date();

    // Only set conversionDate if this is the first conversion
    if (!lead.conversionDate) {
      lead.conversionDate = new Date();
    }

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
      message: "Lead converted to account successfully",
      data: {
        lead: leadObj,
        account: {
          id: account._id,
          _id: account._id,
          name: account.name,
          industry: account.industry,
          type: account.type,
          email: account.email,
          phone: account.phone,
          annualRevenue: account.annualRevenue,
          employees: account.employees,
          contacts: account.contacts,
        },
        // Include contact data if lead was already converted to contact
        contact: lead.convertedToContactId
          ? {
              id: lead.convertedToContactId,
              exists: true,
              count: existingContactsCount,
              note: "Lead was already converted to contact previously",
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Convert lead to account error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while converting lead to account",
      error: error.message,
    });
  }
};

// Sync lead to account
const syncLeadToAccount = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (!lead.convertedToAccountId) {
      return res.status(400).json({
        success: false,
        message: "Lead is not converted to an account",
      });
    }

    let account;

    // Check if it's a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(lead.convertedToAccountId)) {
      account = await Account.findById(lead.convertedToAccountId);
    }

    // If account not found or ID is not a valid ObjectId, create a new one
    if (!account) {
      // Parse annual revenue from lead
      let annualRevenue = 0;
      if (lead.annualRevenue !== undefined && lead.annualRevenue !== null) {
        if (typeof lead.annualRevenue === "string") {
          const cleanRevenue = lead.annualRevenue
            .toString()
            .replace(/[^\d.]/g, "");
          annualRevenue = parseFloat(cleanRevenue) || 0;
        } else {
          annualRevenue = parseFloat(lead.annualRevenue) || 0;
        }
      }

      // Count existing contacts for this lead
      const existingContactsCount = await Contact.countDocuments({
        convertedFromLead: lead._id.toString(),
      });

      const accountData = {
        name: lead.company || `${lead.firstName} ${lead.lastName}`,
        website: lead.website || "",
        phone: lead.phone || "",
        email: lead.email || "",
        industry: lead.industry || "",
        type: "Customer",
        contacts: existingContactsCount,
        employees: lead.numberOfEmployees || 0,
        annualRevenue: annualRevenue,
        description:
          lead.description ||
          `Created from lead: ${lead.firstName} ${lead.lastName}`,
        billingAddress: {
          street: lead.streetAddress || "",
          city: lead.city || "",
          state: lead.state || "",
          zipCode: lead.zipCode || "",
          country: lead.country || "",
        },
        shippingAddress: {
          street: lead.streetAddress || "",
          city: lead.city || "",
          state: lead.state || "",
          zipCode: lead.zipCode || "",
          country: lead.country || "",
        },
        createdBy: lead.createdBy || "System",
        updatedBy: "System",
      };

      account = new Account(accountData);
      await account.save();

      // Update lead with the actual account ID
      lead.convertedToAccountId = account._id.toString();
      await lead.save();
    }

    // Parse annual revenue from lead for update
    let annualRevenue = 0;
    if (lead.annualRevenue !== undefined && lead.annualRevenue !== null) {
      if (typeof lead.annualRevenue === "string") {
        const cleanRevenue = lead.annualRevenue
          .toString()
          .replace(/[^\d.]/g, "");
        annualRevenue = parseFloat(cleanRevenue) || 0;
      } else {
        annualRevenue = parseFloat(lead.annualRevenue) || 0;
      }
    }

    // Parse employees from lead
    let employees = 0;
    if (
      lead.numberOfEmployees !== undefined &&
      lead.numberOfEmployees !== null
    ) {
      if (typeof lead.numberOfEmployees === "string") {
        employees = parseInt(lead.numberOfEmployees, 10) || 0;
      } else {
        employees = parseInt(lead.numberOfEmployees) || 0;
      }
    }

    // Count current contacts for this lead
    const currentContactsCount = await Contact.countDocuments({
      convertedFromLead: lead._id.toString(),
    });

    // Update account with latest lead data
    account.name = lead.company || account.name;
    account.website = lead.website || account.website;
    account.phone = lead.phone || account.phone;
    account.email = lead.email || account.email;
    account.industry = lead.industry || account.industry;
    account.employees = employees;
    account.annualRevenue = annualRevenue;
    account.contacts = currentContactsCount; // Update contacts count
    account.description = lead.description || account.description;
    account.updatedAt = new Date();
    account.updatedBy = "System";

    // Update address if lead has address info
    if (
      lead.streetAddress ||
      lead.city ||
      lead.state ||
      lead.zipCode ||
      lead.country
    ) {
      account.billingAddress = {
        street: lead.streetAddress || account.billingAddress.street,
        city: lead.city || account.billingAddress.city,
        state: lead.state || account.billingAddress.state,
        zipCode: lead.zipCode || account.billingAddress.zipCode,
        country: lead.country || account.billingAddress.country,
      };

      // Update shipping address too if it was same as billing
      if (
        JSON.stringify(account.shippingAddress) ===
        JSON.stringify(account.billingAddress)
      ) {
        account.shippingAddress = { ...account.billingAddress };
      }
    }

    await account.save();

    // Update lead sync timestamp
    lead.lastSyncedToAccount = new Date();
    await lead.save();

    res.json({
      success: true,
      message: "Lead data synced to account successfully",
      data: {
        lead,
        account: {
          id: account._id,
          name: account.name,
          annualRevenue: account.annualRevenue,
          contacts: account.contacts,
          updatedAt: account.updatedAt,
        },
        lastSynced: new Date(),
      },
    });
  } catch (error) {
    console.error("Sync lead to account error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while syncing lead to account",
      error: error.message,
    });
  }
};

module.exports = {
  convertLeadToAccount,
  syncLeadToAccount,
};
