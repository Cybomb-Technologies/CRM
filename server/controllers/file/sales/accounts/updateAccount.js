// server/controllers/file/sales/accounts/updateAccount.js
const Account = require("../../../../models/file/sales/Account");

const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: req.body.updatedBy || "system",
      updatedAt: Date.now(),
    };

    // Remove fields that shouldn't be updated
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.createdBy;

    // Parse numeric fields to ensure correct type
    if (updateData.employees !== undefined) {
      updateData.employees = parseInt(updateData.employees, 10) || 0;
    }

    if (updateData.annualRevenue !== undefined) {
      // Handle string input with commas, currency symbols, etc.
      if (typeof updateData.annualRevenue === "string") {
        // Remove all non-numeric characters except decimal point
        const cleanRevenue = updateData.annualRevenue.replace(/[^\d.]/g, "");
        updateData.annualRevenue = parseFloat(cleanRevenue) || 0;
      } else {
        updateData.annualRevenue = parseFloat(updateData.annualRevenue) || 0;
      }
    }

    if (updateData.contacts !== undefined) {
      updateData.contacts = parseInt(updateData.contacts, 10) || 0;
    }

    console.log("Updating account with data:", updateData);
    console.log(
      "Annual revenue after processing:",
      updateData.annualRevenue,
      "Type:",
      typeof updateData.annualRevenue
    );

    const updatedAccount = await Account.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedAccount) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    console.log(
      "Account updated successfully. Annual revenue:",
      updatedAccount.annualRevenue
    );

    res.status(200).json({
      success: true,
      message: "Account updated successfully",
      data: updatedAccount,
    });
  } catch (error) {
    console.error("Error updating account:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update account",
      error: error.message,
    });
  }
};

const updateAccountContactCount = async (accountId) => {
  try {
    const Contact = require("../../../../../models/file/sales/Contact");
    const contactCount = await Contact.countDocuments({
      accountId,
      isActive: true,
    });

    await Account.findByIdAndUpdate(accountId, {
      contacts: contactCount,
      updatedAt: Date.now(),
    });

    return contactCount;
  } catch (error) {
    console.error("Error updating account contact count:", error);
    throw error;
  }
};

module.exports = { updateAccount, updateAccountContactCount };
