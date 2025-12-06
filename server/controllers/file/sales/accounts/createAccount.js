// server/controllers/file/sales/accounts/createAccount.js
const Account = require("../../../../models/file/sales/Account");

const createAccount = async (req, res) => {
  try {
    console.log("Received account data:", req.body);

    // Create a CLEAN object - remove ALL possible id fields
    const accountData = { ...req.body };

    // Force remove ANY id fields
    delete accountData.id;
    delete accountData._id;
    delete accountData.__v;

    // Parse numeric fields to ensure correct type
    if (accountData.employees !== undefined) {
      accountData.employees = parseInt(accountData.employees, 10) || 0;
    }

    if (accountData.annualRevenue !== undefined) {
      // Handle string input with commas, currency symbols, etc.
      if (typeof accountData.annualRevenue === "string") {
        // Remove all non-numeric characters except decimal point
        const cleanRevenue = accountData.annualRevenue.replace(/[^\d.]/g, "");
        accountData.annualRevenue = parseFloat(cleanRevenue) || 0;
      } else {
        accountData.annualRevenue = parseFloat(accountData.annualRevenue) || 0;
      }
    }

    if (accountData.contacts !== undefined) {
      accountData.contacts = parseInt(accountData.contacts, 10) || 0;
    }

    // Ensure numeric fields default to 0
    accountData.employees = accountData.employees || 0;
    accountData.annualRevenue = accountData.annualRevenue || 0;
    accountData.contacts = accountData.contacts || 0;

    // Add required system fields
    accountData.createdBy = "system";
    accountData.updatedBy = "system";
    accountData.isActive = true;

    // Ensure address objects exist
    accountData.billingAddress = accountData.billingAddress || {};
    accountData.shippingAddress = accountData.shippingAddress || {};

    console.log("Creating account with CLEAN data:", accountData);
    console.log(
      "Annual revenue after processing:",
      accountData.annualRevenue,
      "Type:",
      typeof accountData.annualRevenue
    );

    // Create new account - let MongoDB auto-generate _id
    const newAccount = new Account(accountData);
    const savedAccount = await newAccount.save();

    console.log("Account created successfully:", savedAccount._id);
    console.log("Saved account annual revenue:", savedAccount.annualRevenue);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: savedAccount,
    });
  } catch (error) {
    console.error("Error creating account:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      console.log("Duplicate key error:", error.keyValue);
      return res.status(400).json({
        success: false,
        message: "Duplicate entry found. Please use different account details.",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create account",
      error: error.message,
    });
  }
};

module.exports = { createAccount };
