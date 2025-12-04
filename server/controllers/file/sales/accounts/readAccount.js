const Account = require("../../../../models/file/sales/Account");

const getAllAccounts = async (req, res) => {
  try {
    const {
      search,
      industry,
      type,
      dateRange,
      page = 1,
      limit = 50,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    let query = { isActive: true };
    let sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { website: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { industry: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by industry
    if (industry && industry !== "all") {
      query.industry = industry;
    }

    // Filter by type
    if (type && type !== "all") {
      query.type = type;
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

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const accounts = await Account.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination info
    const total = await Account.countDocuments(query);

    res.status(200).json({
      success: true,
      data: accounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch accounts",
      error: error.message,
    });
  }
};

const getAccountById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    res.status(200).json({
      success: true,
      data: account,
    });
  } catch (error) {
    console.error("Error fetching account:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch account",
      error: error.message,
    });
  }
};

const getAccountsCount = async (req, res) => {
  try {
    const total = await Account.countDocuments({ isActive: true });
    const customers = await Account.countDocuments({
      type: "Customer",
      isActive: true,
    });
    const partners = await Account.countDocuments({
      type: "Partner",
      isActive: true,
    });
    const vendors = await Account.countDocuments({
      type: "Vendor",
      isActive: true,
    });
    const prospects = await Account.countDocuments({
      type: "Prospect",
      isActive: true,
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        customers,
        partners,
        vendors,
        prospects,
      },
    });
  } catch (error) {
    console.error("Error fetching account count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch account count",
      error: error.message,
    });
  }
};

module.exports = { getAllAccounts, getAccountById, getAccountsCount };
