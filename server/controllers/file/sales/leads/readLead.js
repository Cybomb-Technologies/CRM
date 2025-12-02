// server/controllers/file/sales/leads/readLead.js
const Lead = require("../../../../models/file/sales/Lead");

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

module.exports = {
  getLeads,
  getLead,
};
