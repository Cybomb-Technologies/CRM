// server/controllers/file/sales/campaigns/readCampaign.js
const Campaign = require("../../../../models/file/sales/Campaign");

// Get all campaigns with filtering and pagination
const getCampaigns = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      type,
      dateRange,
      view = "all",
    } = req.query;

    const query = { isArchived: false };

    // Search filter
    if (search) {
      query.$or = [
        { campaignName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { goal: { $regex: search, $options: "i" } },
        { targetAudience: { $regex: search, $options: "i" } },
      ];
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Type filter
    if (type) {
      query.type = type;
    }

    // View filters
    switch (view) {
      case "active":
        query.status = "Active";
        break;
      case "planning":
        query.status = "Planning";
        break;
      case "completed":
        query.status = "Completed";
        break;
      case "inactive":
        query.status = "Inactive";
        break;
      case "cancelled":
        query.status = "Cancelled";
        break;
      case "archived":
        query.isArchived = true;
        break;
    }

    // Date range filter
    if (dateRange) {
      const now = new Date();
      let startDate;

      switch (dateRange) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          query.startDate = { $gte: startDate };
          break;
        case "this-week":
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - startDate.getDay());
          startDate.setHours(0, 0, 0, 0);
          query.startDate = { $gte: startDate };
          break;
        case "this-month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          query.startDate = { $gte: startDate };
          break;
        case "upcoming":
          query.startDate = { $gte: now };
          break;
        case "past":
          query.endDate = { $lt: now };
          break;
      }
    }

    const campaigns = await Campaign.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Campaign.countDocuments(query);

    res.json({
      success: true,
      data: campaigns,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Get campaigns error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching campaigns",
    });
  }
};

// Get single campaign
const getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    console.error("Get campaign error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching campaign",
    });
  }
};

module.exports = {
  getCampaigns,
  getCampaign,
};
