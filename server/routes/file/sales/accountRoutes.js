//accountRoutes.js
const express = require("express");
const router = express.Router();
const accountController = require("../../../controllers/file/sales/accounts/accountController");
// GET Routes
router.get("/", accountController.getAllAccounts);
router.get("/count", accountController.getAccountsCount);
router.get("/:id", accountController.getAccountById);

// POST Routes
router.post("/", accountController.createAccount);
router.post("/bulk-create", accountController.bulkCreateAccounts);
router.post("/bulk-delete", accountController.bulkDeleteAccounts);

// PUT Routes
router.put("/:id", accountController.updateAccount);
router.put("/bulk-update", accountController.bulkUpdateAccounts);

// DELETE Routes
router.delete("/:id", accountController.deleteAccount);
router.delete("/:id/hard", accountController.hardDeleteAccount);

module.exports = router;
