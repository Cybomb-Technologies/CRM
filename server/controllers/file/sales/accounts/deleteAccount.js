const Account = require("../../../../models/file/sales/Account");

const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete (mark as inactive)
    const deletedAccount = await Account.findByIdAndUpdate(
      id,
      {
        isActive: false,
        updatedAt: Date.now(),
        updatedBy: req.body.updatedBy || "system",
      },
      { new: true }
    );

    if (!deletedAccount) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    // Delete associated contacts (if needed)
    // const Contact = require('../../../../../models/file/sales/Contact');
    // await Contact.updateMany(
    //   { accountId: id },
    //   { isActive: false, updatedAt: Date.now() }
    // );

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
      data: deletedAccount,
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
      error: error.message,
    });
  }
};

// Hard delete (permanent removal)
const hardDeleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAccount = await Account.findByIdAndDelete(id);

    if (!deletedAccount) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Account permanently deleted",
      data: deletedAccount,
    });
  } catch (error) {
    console.error("Error hard deleting account:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
      error: error.message,
    });
  }
};

module.exports = { deleteAccount, hardDeleteAccount };
