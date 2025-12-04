const Contact = require("../../../../models/file/sales/Contact");

const getContacts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search,
      account,
      department,
      leadSource,
      dateRange,
      view = "all",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    // Apply search filter
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { accountName: searchRegex },
        { title: searchRegex },
      ];
    }

    // Apply account filter
    if (account && account !== "All Accounts") {
      query.accountName = account;
    }

    // Apply department filter
    if (department && department !== "All Departments") {
      query.department = department;
    }

    // Apply lead source filter
    if (leadSource && leadSource !== "All Sources") {
      query.leadSource = leadSource;
    }

    // Apply view filters
    switch (view) {
      case "converted":
        query.convertedFromLead = { $exists: true, $ne: null };
        break;
      case "recently-created":
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        query.createdAt = { $gte: oneWeekAgo };
        break;
      case "recently-modified":
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        query.updatedAt = { $gte: twoDaysAgo };
        break;
      case "today":
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        query.createdAt = { $gte: today, $lt: tomorrow };
        break;
    }

    // Apply date range filter
    if (dateRange) {
      const now = new Date();
      let startDate;

      switch (dateRange) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          query.createdAt = { $gte: startDate };
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

    // Sort configuration
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const contacts = await Contact.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("accountId", "name website industry")
      .lean();

    const total = await Contact.countDocuments(query);

    // Get unique values for filters
    const uniqueAccounts = await Contact.distinct("accountName", {
      accountName: { $ne: null, $ne: "" },
    });
    const uniqueDepartments = await Contact.distinct("department", {
      department: { $ne: null, $ne: "" },
    });
    const uniqueLeadSources = await Contact.distinct("leadSource", {
      leadSource: { $ne: null, $ne: "" },
    });

    res.status(200).json({
      success: true,
      contacts,
      total,
      pages: Math.ceil(total / limit),
      page: parseInt(page),
      limit: parseInt(limit),
      filters: {
        accounts: uniqueAccounts,
        departments: uniqueDepartments,
        leadSources: uniqueLeadSources,
      },
    });
  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
      error: error.message,
    });
  }
};

const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate("accountId", "name website industry phone email")
      .populate(
        "convertedFromLead",
        "firstName lastName company email leadStatus"
      )
      .lean();

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error("Get contact by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact",
      error: error.message,
    });
  }
};

module.exports = { getContacts, getContactById };
