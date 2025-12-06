// server/controllers/file/sales/leads/leadController.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Import split controller modules
const createLead = require("./createLead");
const readLead = require("./readLead");
const updateLead = require("./updateLead");
const deleteLead = require("./deleteLead");
const advancedOperations = require("./advancedOperations");

// Import NEW split modules
const leadToContactConversion = require("./leadToContactConversion");
const leadToAccountConversion = require("./leadToAccountConversion");
const leadApproval = require("./leadApproval");
const bulkLeadConversion = require("./bulkLeadConversion");
const bulkLeadOperations = require("./bulkLeadOperations");

// Configure multer for file uploads (Keep this in main file as it's shared)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/leads/";
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "lead-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Export all controller functions as a single object
module.exports = {
  // Import all functions from split modules
  getLeads: readLead.getLeads,
  getLead: readLead.getLead,
  createLead: [upload.single("image"), createLead.createLead],
  updateLead: [upload.single("image"), updateLead.updateLead],
  deleteLead: deleteLead.deleteLead,

  // Bulk operations from new split modules
  bulkUpdateLeads: bulkLeadOperations.bulkUpdateLeads,
  bulkDeleteLeads: bulkLeadOperations.bulkDeleteLeads,
  bulkConvertLeads: bulkLeadConversion.bulkConvertLeads,
  bulkConvertLeadsToAccount: bulkLeadConversion.bulkConvertLeadsToAccount,
  manageLeadTags: bulkLeadOperations.manageLeadTags,

  // Conversion operations from new split modules
  convertLead: leadToContactConversion.convertLead,
  convertLeadToAccount: leadToAccountConversion.convertLeadToAccount,
  syncLeadToContact: leadToContactConversion.syncLeadToContact,
  syncLeadToAccount: leadToAccountConversion.syncLeadToAccount,
  approveLeads: leadApproval.approveLeads,

  // Advanced operations (unchanged)
  deduplicateLeads: advancedOperations.deduplicateLeads,
  addLeadsToCampaign: advancedOperations.addLeadsToCampaign,

  // Export upload middleware separately if needed
  upload,
};
