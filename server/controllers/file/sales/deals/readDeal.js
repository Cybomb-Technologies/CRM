// controllers/file/sales/deals/readDeal.js
const Deal = require("../../../../models/file/sales/Deal");

const getDeals = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search,
      stage,
      owner,
      company,
      probability,
      valueRange,
      view = "all",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    console.log("🔍 Filter parameters:", {
      search,
      stage,
      owner,
      company,
      probability,
      valueRange,
      view,
    });

    const query = {};

    // Apply search filter
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { contactName: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    // Apply stage filter - FIXED: Handle exact stage matching
    if (stage && stage !== "all-stages" && stage !== "all") {
      query.stage = stage;
    }

    // Apply owner filter - FIXED: Handle partial matching
    if (owner && owner !== "all-owners" && owner !== "all") {
      if (owner === "Current User") {
        query.owner = owner; // Exact match for "Current User"
      } else {
        query.owner = new RegExp(owner.trim(), "i"); // Partial match for other owners
      }
    }

    // Apply company filter - FIXED: Handle partial matching
    if (company && company.trim() !== "") {
      query.company = new RegExp(company.trim(), "i");
    }

    // Apply probability filter - FIXED: Handle numeric ranges correctly
    if (
      probability &&
      probability !== "all-probabilities" &&
      probability !== "all"
    ) {
      switch (probability) {
        case "high":
          query.probability = { $gte: 70 };
          break;
        case "medium":
          query.probability = { $gte: 30, $lt: 70 };
          break;
        case "low":
          query.probability = { $lt: 30 };
          break;
        default:
          // Handle specific numeric probability
          const probNum = parseInt(probability);
          if (!isNaN(probNum)) {
            query.probability = probNum;
          }
          break;
      }
    }

    // Apply value range filter - FIXED: Handle currency ranges correctly
    if (valueRange && valueRange !== "all-values" && valueRange !== "all") {
      switch (valueRange) {
        case "0-500000":
          query.value = { $gte: 0, $lte: 500000 };
          break;
        case "500000-2500000":
          query.value = { $gt: 500000, $lte: 2500000 };
          break;
        case "2500000-5000000":
          query.value = { $gt: 2500000, $lte: 5000000 };
          break;
        case "5000000+":
          query.value = { $gt: 5000000 };
          break;
        default:
          // Handle custom range like "100000-500000"
          const rangeMatch = valueRange.match(/^(\d+)-(\d+)$/);
          if (rangeMatch) {
            const min = parseInt(rangeMatch[1]);
            const max = parseInt(rangeMatch[2]);
            if (!isNaN(min) && !isNaN(max)) {
              query.value = { $gte: min, $lte: max };
            }
          }
          break;
      }
    }

    // Apply view filters
    switch (view) {
      case "my-deals":
        query.owner = "Current User";
        break;
      case "high-value":
        query.value = { $gte: 5000000 }; // ₹50L+
        break;
      case "closing-this-month":
        const now = new Date();
        const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        query.closeDate = {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          $lte: thisMonthEnd,
        };
        break;
      case "stuck-deals":
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        query.updatedAt = { $lt: thirtyDaysAgo };
        break;
      case "qualification-stage":
        query.stage = "qualification";
        break;
      case "proposal-stage":
        query.stage = "proposal-price-quote";
        break;
      case "negotiation-stage":
        query.stage = "negotiation-review";
        break;
      case "closed-won":
        query.stage = "closed-won";
        break;
      case "closed-lost":
        query.$or = [
          { stage: "closed-lost" },
          { stage: "closed-lost-to-competition" },
        ];
        break;
    }

    console.log("🔍 Final query:", JSON.stringify(query, null, 2));

    // Sort configuration
    const sort = {};
    if (sortBy === "value") {
      sort.value = sortOrder === "desc" ? -1 : 1;
    } else if (sortBy === "probability") {
      sort.probability = sortOrder === "desc" ? -1 : 1;
    } else if (sortBy === "closeDate") {
      sort.closeDate = sortOrder === "desc" ? -1 : 1;
    } else {
      sort.createdAt = sortOrder === "desc" ? -1 : 1;
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const deals = await Deal.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Deal.countDocuments(query);

    // Calculate totals
    const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    const weightedValue = deals.reduce(
      (sum, deal) => sum + ((deal.value || 0) * (deal.probability || 0)) / 100,
      0
    );

    // Get unique values for filters
    const uniqueStages = await Deal.distinct("stage");
    const uniqueOwners = await Deal.distinct("owner", {
      owner: { $ne: null, $ne: "" },
    });
    const uniqueCompanies = await Deal.distinct("company", {
      company: { $ne: null, $ne: "" },
    });

    // Get probability distribution
    const probabilityStats = {
      high: await Deal.countDocuments({ probability: { $gte: 70 } }),
      medium: await Deal.countDocuments({ probability: { $gte: 30, $lt: 70 } }),
      low: await Deal.countDocuments({ probability: { $lt: 30 } }),
    };

    // Get value range distribution
    const valueStats = {
      "0-500000": await Deal.countDocuments({
        value: { $gte: 0, $lte: 500000 },
      }),
      "500000-2500000": await Deal.countDocuments({
        value: { $gt: 500000, $lte: 2500000 },
      }),
      "2500000-5000000": await Deal.countDocuments({
        value: { $gt: 2500000, $lte: 5000000 },
      }),
      "5000000+": await Deal.countDocuments({ value: { $gt: 5000000 } }),
    };

    res.status(200).json({
      success: true,
      deals,
      total,
      totalValue,
      weightedValue,
      pages: Math.ceil(total / limit),
      page: parseInt(page),
      limit: parseInt(limit),
      filters: {
        stages: uniqueStages,
        owners: uniqueOwners,
        companies: uniqueCompanies,
        probabilityStats,
        valueStats,
      },
      appliedFilters: {
        search,
        stage,
        owner,
        company,
        probability,
        valueRange,
        view,
      },
    });
  } catch (error) {
    console.error("Get deals error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch deals",
      error: error.message,
    });
  }
};

const getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id).lean();

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    // Calculate weighted value
    deal.weightedValue = ((deal.value || 0) * (deal.probability || 0)) / 100;

    // Calculate days until close
    if (deal.closeDate) {
      const closeDate = new Date(deal.closeDate);
      const today = new Date();
      const diffTime = closeDate - today;
      deal.daysUntilClose = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    res.status(200).json({
      success: true,
      deal,
    });
  } catch (error) {
    console.error("Get deal by ID error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid deal ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch deal",
      error: error.message,
    });
  }
};

const getAllDeals = async (req, res) => {
  try {
    const deals = await Deal.find({}).lean();

    // Group deals by stage
    const dealsByStage = {};
    const uniqueStages = await Deal.distinct("stage");

    uniqueStages.forEach((stage) => {
      dealsByStage[stage] = deals.filter((deal) => deal.stage === stage);
    });

    res.status(200).json({
      success: true,
      deals,
      dealsByStage,
      total: deals.length,
    });
  } catch (error) {
    console.error("Get all deals error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all deals",
      error: error.message,
    });
  }
};

module.exports = { getDeals, getDealById, getAllDeals };
