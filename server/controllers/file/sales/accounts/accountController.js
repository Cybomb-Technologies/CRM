const { createAccount } = require("./createAccount");
const {
  getAllAccounts,
  getAccountById,
  getAccountsCount,
} = require("./readAccount");
const { updateAccount, updateAccountContactCount } = require("./updateAccount");
const { deleteAccount, hardDeleteAccount } = require("./deleteAccount");
const {
  bulkDeleteAccounts,
  bulkUpdateAccounts,
  bulkCreateAccounts,
} = require("./bulkOperations");

module.exports = {
  // Create
  createAccount,

  // Read
  getAllAccounts,
  getAccountById,
  getAccountsCount,

  // Update
  updateAccount,
  updateAccountContactCount,

  // Delete
  deleteAccount,
  hardDeleteAccount,

  // Bulk Operations
  bulkDeleteAccounts,
  bulkUpdateAccounts,
  bulkCreateAccounts,
};
