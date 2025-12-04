const Account = require("../../../../models/file/sales/Account");

const bulkDeleteAccounts = async (req, res) => {
  try {
    const { accountIds } = req.body;

    if (!accountIds || !Array.isArray(accountIds) || accountIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No account IDs provided",
      });
    }

    // Soft delete multiple accounts
    const result = await Account.updateMany(
      { _id: { $in: accountIds } },
      {
        isActive: false,
        updatedAt: Date.now(),
        updatedBy: req.body.updatedBy || "system",
      }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} accounts deleted successfully`,
      data: {
        deletedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    console.error("Error bulk deleting accounts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to bulk delete accounts",
      error: error.message,
    });
  }
};

const bulkUpdateAccounts = async (req, res) => {
  try {
    const { accountIds, updates } = req.body;

    if (!accountIds || !Array.isArray(accountIds) || accountIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No account IDs provided",
      });
    }

    if (!updates || typeof updates !== "object") {
      return res.status(400).json({
        success: false,
        message: "No updates provided",
      });
    }

    // Add update metadata
    const updateData = {
      ...updates,
      updatedAt: Date.now(),
      updatedBy: req.body.updatedBy || "system",
    };

    // Remove fields that shouldn't be bulk updated
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.createdBy;

    const result = await Account.updateMany(
      { _id: { $in: accountIds } },
      { $set: updateData }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} accounts updated successfully`,
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    console.error("Error bulk updating accounts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to bulk update accounts",
      error: error.message,
    });
  }
};

const bulkCreateAccounts = async (req, res) => {
  try {
    const { accounts } = req.body;

    if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No accounts data provided",
      });
    }

    // Add system fields to each account
    const accountsWithMetadata = accounts.map((account) => ({
      ...account,
      createdBy: "system",
      updatedBy: "system",
      isActive: true,
    }));

    const createdAccounts = await Account.insertMany(accountsWithMetadata);

    res.status(201).json({
      success: true,
      message: `${createdAccounts.length} accounts created successfully`,
      data: createdAccounts,
    });
  } catch (error) {
    console.error("Error bulk creating accounts:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate accounts found",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to bulk create accounts",
      error: error.message,
    });
  }
};

module.exports = { bulkDeleteAccounts, bulkUpdateAccounts, bulkCreateAccounts };
