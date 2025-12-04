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
