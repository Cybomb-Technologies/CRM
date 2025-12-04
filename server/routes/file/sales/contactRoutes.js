const express = require("express");
const router = express.Router();
const {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  bulkUpdateContacts,
  bulkDeleteContacts,
} = require("../../../controllers/file/sales/contacts/contactController");

// ADD THIS INSTEAD (dummy user for testing):
// router.use((req, res, next) => {
//   // For testing, add a dummy user object
//   req.user = {
//     id: "6578a1b2c3d4e5f6a7b8c9d0",
//     name: "Test User",
//     email: "test@example.com",
//   };
//   next();
// });

// GET /api/contacts - Get all contacts with filters
router.get("/", getContacts);

// GET /api/contacts/:id - Get single contact
router.get("/:id", getContactById);

// POST /api/contacts - Create new contact
router.post("/", createContact);

// PUT /api/contacts/:id - Update contact
router.put("/:id", updateContact);

// DELETE /api/contacts/:id - Delete contact
router.delete("/:id", deleteContact);

// PUT /api/contacts/bulk/update - Bulk update contacts
router.put("/bulk/update", bulkUpdateContacts);

// DELETE /api/contacts/bulk/delete - Bulk delete contacts
router.delete("/bulk/delete", bulkDeleteContacts);

module.exports = router;
