// server/controllers/file/sales/leads/bulkLeadConversion.js
const Lead = require("../../../../models/file/sales/Lead");
const Contact = require("../../../../models/file/sales/Contact");
const Account = require("../../../../models/file/sales/Account");

// Bulk convert leads to contacts ONLY (no account creation)
const bulkConvertLeads = async (req, res) => {
  try {
    const { leadIds } = req.body;

    // Get the leads that are not converted to contacts
    const leads = await Lead.find({
      _id: { $in: leadIds },
      convertedToContactId: { $exists: false }, // Not already converted to contact
    });

    if (leads.length === 0) {
      return res.json({
        success: true,
        message: "No leads found that can be converted to contacts",
        convertedCount: 0,
      });
    }

    const conversionDate = new Date();
    const conversionPromises = [];
    const createdContacts = [];

    // Track accounts that need their contacts counter updated
    const accountsToUpdate = new Set();

    // Process each lead to create ONLY a contact
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
        accountId: lead.convertedToAccountId || null, // Link to existing account if any
      };

      // Create contact
      const contact = new Contact(contactData);
      const saveContactPromise = contact.save();
      createdContacts.push(contact);

      // Update lead - contact conversion ONLY
      const updateLeadPromise = Lead.findByIdAndUpdate(lead._id, {
        isConverted: true,
        conversionDate,
        convertedToContactId: contact._id.toString(),
        // Keep existing convertedToAccountId if it exists
      });

      conversionPromises.push(saveContactPromise, updateLeadPromise);

      // CRITICAL: If lead was already converted to an account, track it for counter update
      if (lead.convertedToAccountId) {
        accountsToUpdate.add(lead.convertedToAccountId);
      }
    }

    // Execute all contact creation and lead update promises
    await Promise.all(conversionPromises);

    // CRITICAL FIX: Update account contacts counters for all affected accounts
    if (accountsToUpdate.size > 0) {
      console.log(
        `Updating contacts counter for ${accountsToUpdate.size} accounts`
      );

      const accountUpdatePromises = Array.from(accountsToUpdate).map(
        async (accountId) => {
          try {
            // Count contacts for this specific account from the newly created contacts
            const contactCountForAccount = await Contact.countDocuments({
              accountId: accountId,
              convertedFromLead: {
                $in: leads.map((lead) => lead._id.toString()),
              },
            });

            if (contactCountForAccount > 0) {
              // Update the account's contacts counter
              const account = await Account.findById(accountId);
              if (account) {
                // Increment the counter by the number of new contacts
                account.contacts =
                  (account.contacts || 0) + contactCountForAccount;
                account.updatedAt = new Date();
                account.updatedBy = "System";
                await account.save();

                console.log(
                  `Updated account ${accountId} contacts counter. Previous: ${
                    account.contacts - contactCountForAccount
                  }, New: ${account.contacts}`
                );
              }
            }
          } catch (accountError) {
            console.error(
              `Error updating account ${accountId} contacts counter:`,
              accountError
            );
            // Don't fail the whole operation if one account update fails
          }
        }
      );

      // Wait for all account updates to complete
      await Promise.all(accountUpdatePromises);
      console.log(
        `Completed updating contacts counters for ${accountsToUpdate.size} accounts`
      );
    }

    res.json({
      success: true,
      message: `${leads.length} leads converted to contacts successfully`,
      convertedCount: leads.length,
      data: {
        contactsCreated: createdContacts.length,
        accountsCreated: 0, // No accounts created in contact-only conversion
        accountsUpdated: accountsToUpdate.size, // Number of accounts whose contacts counter was updated
      },
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

// Bulk convert leads to accounts ONLY (no contact creation)
const bulkConvertLeadsToAccount = async (req, res) => {
  try {
    const { leadIds } = req.body;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No lead IDs provided",
      });
    }

    // Get leads that are not converted to accounts
    const leads = await Lead.find({
      _id: { $in: leadIds },
      convertedToAccountId: { $exists: false }, // Not already converted to account
    });

    if (leads.length === 0) {
      return res.json({
        success: true,
        message: "No leads found that can be converted to accounts",
        convertedCount: 0,
      });
    }

    const conversionDate = new Date();
    const conversionPromises = [];
    const createdAccounts = [];

    // Process each lead - account conversion ONLY
    for (const lead of leads) {
      // Parse annual revenue from lead
      let annualRevenue = 0;
      if (lead.annualRevenue !== undefined && lead.annualRevenue !== null) {
        if (typeof lead.annualRevenue === "string") {
          // Remove all non-numeric characters except decimal point
          const cleanRevenue = lead.annualRevenue.replace(/[^\d.]/g, "");
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

      // Count existing contacts for this lead (if any were created previously)
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
        contacts: existingContactsCount, // Only count if contact already exists
        employees: employees,
        annualRevenue: annualRevenue,
        description:
          lead.description ||
          `Converted from lead: ${lead.firstName} ${lead.lastName}`,
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

      // Create account
      const account = new Account(accountData);
      const saveAccountPromise = account.save();
      createdAccounts.push(account);

      // Update lead - account conversion ONLY
      // DO NOT create a contact - this is account-only conversion
      const updateLeadPromise = Lead.findByIdAndUpdate(lead._id, {
        isConverted: true,
        convertedToAccountId: account._id.toString(),
        accountConversionDate: conversionDate,
        lastSyncedToAccount: conversionDate,
        // Only set conversionDate if this is the first conversion
        conversionDate: lead.conversionDate
          ? lead.conversionDate
          : conversionDate,
      });

      conversionPromises.push(saveAccountPromise, updateLeadPromise);
    }

    // Execute all promises
    await Promise.all(conversionPromises);

    res.json({
      success: true,
      message: `${leads.length} leads converted to accounts successfully`,
      convertedCount: leads.length,
      data: {
        accountsCreated: createdAccounts.length,
        contactsCreated: 0, // No contacts created in account-only conversion
      },
    });
  } catch (error) {
    console.error("Bulk convert leads to account error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during bulk conversion to accounts",
      error: error.message,
    });
  }
};

module.exports = {
  bulkConvertLeads,
  bulkConvertLeadsToAccount,
};
