const createContact = require("./createContact");
const { getContacts, getContactById } = require("./readContact");
const updateContact = require("./updateContact");
const deleteContact = require("./deleteContact");
const { bulkUpdateContacts, bulkDeleteContacts } = require("./bulkOperations");

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  bulkUpdateContacts,
  bulkDeleteContacts,
};
