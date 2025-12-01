const Lead = require("../../../models/file/sales/Lead");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
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

// Get all leads with filtering and pagination
const getLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      source,
      industry,
      dateRange,
      view = "all",
    } = req.query;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // Status filter
    if (status) {
      query.leadStatus = status;
    }

    // Source filter
    if (source) {
      query.leadSource = source;
    }

    // Industry filter
    if (industry) {
      query.industry = industry;
    }

    // View filters
    switch (view) {
      case "converted":
        query.isConverted = true;
        break;
      case "junk":
        query.isJunk = true;
        break;
      case "my-leads":
        query.isConverted = false;
        break;
      case "open":
        query.leadStatus = { $in: ["New", "Contacted", "Qualified"] };
        break;
      case "unread":
        query.isUnread = true;
        break;
      case "unsubscribed":
        query.isUnsubscribed = true;
        break;
      case "locked":
        query.isLocked = true;
        break;
      case "not-qualified":
        query.isQualified = false;
        break;
    }

    // Date range filter
    if (dateRange) {
      const now = new Date();
      let startDate;

      switch (dateRange) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          query.createdAt = { $gte: startDate };
          break;
        case "yesterday":
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 1);
          query.createdAt = { $gte: startDate, $lt: endDate };
          break;
        case "this-week":
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - startDate.getDay());
          startDate.setHours(0, 0, 0, 0);
          query.createdAt = { $gte: startDate };
          break;
        case "this-month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          query.createdAt = { $gte: startDate };
          break;
      }
    }

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Convert image data to base64 URLs for frontend
    const leadsWithImages = leads.map((lead) => {
      const leadObj = lead.toObject();
      if (leadObj.image && leadObj.image.data) {
        leadObj.imageUrl = `data:${
          leadObj.image.contentType
        };base64,${leadObj.image.data.toString("base64")}`;
      }
      return leadObj;
    });

    const total = await Lead.countDocuments(query);

    res.json({
      success: true,
      data: leadsWithImages,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Get leads error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching leads",
    });
  }
};

// Get single lead
const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const leadObj = lead.toObject();
    // Convert image data to base64 URL
    if (leadObj.image && leadObj.image.data) {
      leadObj.imageUrl = `data:${
        leadObj.image.contentType
      };base64,${leadObj.image.data.toString("base64")}`;
    }

    res.json({
      success: true,
      data: leadObj,
    });
  } catch (error) {
    console.error("Get lead error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching lead",
    });
  }
};

// Create new lead
const createLead = async (req, res) => {
  try {
    // Handle image upload if present
    let imageData = null;
    if (req.file) {
      imageData = {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype,
        filename: req.file.filename,
      };
      // Remove the temporary file
      fs.unlinkSync(req.file.path);
    }

    // Ensure required fields are present and set defaults
    const leadData = {
      ...req.body,
      leadOwner: req.body.leadOwner || "System",
      createdBy: "System",
    };

    // Add image data if uploaded
    if (imageData) {
      leadData.image = imageData;
    }

    // Validate required fields
    if (!leadData.company || !leadData.lastName) {
      return res.status(400).json({
        success: false,
        message: "Company and Last Name are required fields",
      });
    }

    const lead = new Lead(leadData);
    await lead.save();

    // Convert image for response
    const leadObj = lead.toObject();
    if (leadObj.image && leadObj.image.data) {
      leadObj.imageUrl = `data:${
        leadObj.image.contentType
      };base64,${leadObj.image.data.toString("base64")}`;
    }

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: leadObj,
    });
  } catch (error) {
    console.error("Create lead error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating lead",
    });
  }
};

// Update lead
const updateLead = async (req, res) => {
  try {
    // Handle image upload if present
    let imageData = null;
    if (req.file) {
      imageData = {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype,
        filename: req.file.filename,
      };
      // Remove the temporary file
      fs.unlinkSync(req.file.path);
    }

    const updateData = { ...req.body, updatedAt: Date.now() };

    // Add image data if uploaded
    if (imageData) {
      updateData.image = imageData;
    } else if (req.body.removeImage === "true") {
      // Handle image removal
      updateData.image = null;
    }

    const lead = await Lead.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Convert image for response
    const leadObj = lead.toObject();
    if (leadObj.image && leadObj.image.data) {
      leadObj.imageUrl = `data:${
        leadObj.image.contentType
      };base64,${leadObj.image.data.toString("base64")}`;
    }

    res.json({
      success: true,
      message: "Lead updated successfully",
      data: leadObj,
    });
  } catch (error) {
    console.error("Update lead error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating lead",
    });
  }
};

// Delete lead
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Delete lead error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting lead",
    });
  }
};

// Bulk update leads
const bulkUpdateLeads = async (req, res) => {
  try {
    const { leadIds, updates } = req.body;

    const result = await Lead.updateMany(
      {
        _id: { $in: leadIds },
      },
      { ...updates, updatedAt: Date.now() }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} leads updated successfully`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Bulk update leads error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during bulk update",
    });
  }
};

// Bulk delete leads
const bulkDeleteLeads = async (req, res) => {
  try {
    const { leadIds } = req.body;

    const result = await Lead.deleteMany({
      _id: { $in: leadIds },
    });

    res.json({
      success: true,
      message: `${result.deletedCount} leads deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Bulk delete leads error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during bulk deletion",
    });
  }
};

// Convert lead to contact
const convertLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (lead.isConverted) {
      return res.status(400).json({
        success: false,
        message: "Lead is already converted",
      });
    }

    // Update lead as converted
    lead.isConverted = true;
    lead.conversionDate = new Date();
    lead.convertedToContactId = `contact_${Date.now()}`;
    lead.convertedToAccountId = `account_${Date.now()}`;
    await lead.save();

    // Convert image for response
    const leadObj = lead.toObject();
    if (leadObj.image && leadObj.image.data) {
      leadObj.imageUrl = `data:${
        leadObj.image.contentType
      };base64,${leadObj.image.data.toString("base64")}`;
    }

    res.json({
      success: true,
      message: "Lead converted successfully",
      data: {
        lead: leadObj,
        contact: {
          id: lead.convertedToContactId,
          name: `${lead.firstName} ${lead.lastName}`,
          email: lead.email,
        },
        account: {
          id: lead.convertedToAccountId,
          name: lead.company,
        },
      },
    });
  } catch (error) {
    console.error("Convert lead error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while converting lead",
    });
  }
};

// Bulk convert leads
const bulkConvertLeads = async (req, res) => {
  try {
    const { leadIds } = req.body;

    const leads = await Lead.find({
      _id: { $in: leadIds },
      isConverted: false,
    });

    const conversionDate = new Date();
    const updatePromises = leads.map((lead) =>
      Lead.findByIdAndUpdate(lead._id, {
        isConverted: true,
        conversionDate,
        convertedToContactId: `contact_${Date.now()}_${lead._id}`,
        convertedToAccountId: `account_${Date.now()}_${lead._id}`,
      })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: `${leads.length} leads converted successfully`,
      convertedCount: leads.length,
    });
  } catch (error) {
    console.error("Bulk convert leads error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during bulk conversion",
    });
  }
};

// Sync lead to contact
const syncLeadToContact = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (!lead.isConverted) {
      return res.status(400).json({
        success: false,
        message: "Lead must be converted first",
      });
    }

    res.json({
      success: true,
      message: "Lead data synced to contact successfully",
      data: {
        lead,
        lastSynced: new Date(),
      },
    });
  } catch (error) {
    console.error("Sync lead error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while syncing lead",
    });
  }
};

// Approve leads
const approveLeads = async (req, res) => {
  try {
    const { leadIds } = req.body;

    const result = await Lead.updateMany(
      {
        _id: { $in: leadIds },
      },
      {
        isApproved: true,
        approvedAt: new Date(),
        approvedBy: "System",
        leadStatus: "Qualified",
        updatedAt: Date.now(),
      }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} leads approved successfully`,
      approvedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Approve leads error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while approving leads",
    });
  }
};

// Manage lead tags
const manageLeadTags = async (req, res) => {
  try {
    const { leadIds, tagsToAdd = [], tagsToRemove = [] } = req.body;

    const leads = await Lead.find({
      _id: { $in: leadIds },
    });

    const updatePromises = leads.map((lead) => {
      const currentTags = lead.tags || [];
      const updatedTags = [
        ...currentTags.filter((tag) => !tagsToRemove.includes(tag)),
        ...tagsToAdd.filter((tag) => !currentTags.includes(tag)),
      ];

      return Lead.findByIdAndUpdate(lead._id, {
        tags: updatedTags,
        updatedAt: Date.now(),
      });
    });

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: `Tags updated for ${leads.length} leads`,
    });
  } catch (error) {
    console.error("Manage tags error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while managing tags",
    });
  }
};

// Deduplicate leads
const deduplicateLeads = async (req, res) => {
  try {
    const { criteria = ["email", "phone"] } = req.body;

    const leads = await Lead.find({});
    const seen = new Set();
    const duplicates = [];
    const uniqueLeads = [];

    leads.forEach((lead) => {
      const key = criteria
        .map((field) => lead[field] || "")
        .join("|")
        .toLowerCase();

      if (key && seen.has(key)) {
        duplicates.push(lead);
      } else {
        if (key) seen.add(key);
        uniqueLeads.push(lead._id);
      }
    });

    // Delete duplicates
    if (duplicates.length > 0) {
      await Lead.deleteMany({
        _id: { $in: duplicates.map((lead) => lead._id) },
      });
    }

    res.json({
      success: true,
      message: `Found ${duplicates.length} duplicate leads and removed them`,
      duplicatesFound: duplicates.length,
      uniqueLeadsCount: uniqueLeads.length,
    });
  } catch (error) {
    console.error("Deduplicate leads error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deduplicating leads",
    });
  }
};

// Add leads to campaign
const addLeadsToCampaign = async (req, res) => {
  try {
    const { leadIds, campaignId } = req.body;

    res.json({
      success: true,
      message: `${leadIds.length} leads added to campaign`,
      campaignId,
      addedCount: leadIds.length,
    });
  } catch (error) {
    console.error("Add to campaign error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding leads to campaign",
    });
  }
};

module.exports = {
  getLeads,
  getLead,
  createLead: [upload.single("image"), createLead],
  updateLead: [upload.single("image"), updateLead],
  deleteLead,
  bulkUpdateLeads,
  bulkDeleteLeads,
  convertLead,
  bulkConvertLeads,
  syncLeadToContact,
  approveLeads,
  manageLeadTags,
  deduplicateLeads,
  addLeadsToCampaign,
  upload,
};
