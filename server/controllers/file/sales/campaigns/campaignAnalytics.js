// server/controllers/file/sales/campaigns/campaignAnalytics.js
const Campaign = require("../../../../models/file/sales/Campaign");

// Get campaign analytics
const getCampaignAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("=== ANALYTICS DEBUG ===");
    console.log("Fetching analytics for campaign ID:", id);

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      console.log("Campaign not found for analytics");
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    console.log("Campaign found:", campaign.campaignName);
    console.log("Total members:", campaign.members?.length || 0);

    // Parse members to ensure we have proper objects
    const members = campaign.members || [];
    const activities = campaign.activities || [];

    // Parse members from JSON strings if needed
    const parsedMembers = members.map((member) => {
      if (typeof member === "string") {
        try {
          return JSON.parse(member);
        } catch (error) {
          console.error("Failed to parse member:", member);
          return {
            id: member,
            name: "Unknown Member",
            type: "unknown",
            responded: false,
            converted: false,
          };
        }
      }
      return member;
    });

    console.log("Parsed members count:", parsedMembers.length);
    console.log("First member:", parsedMembers[0]);

    // Calculate metrics from parsed members
    const totalMembers = parsedMembers.length;
    const respondedMembers = parsedMembers.filter(
      (m) => m.responded === true
    ).length;
    const convertedMembers = parsedMembers.filter(
      (m) => m.converted === true
    ).length;

    console.log("Responded members:", respondedMembers);
    console.log("Converted members:", convertedMembers);

    const responseRate =
      totalMembers > 0 ? (respondedMembers / totalMembers) * 100 : 0;
    const conversionRate =
      respondedMembers > 0 ? (convertedMembers / respondedMembers) * 100 : 0;

    console.log("Response rate:", responseRate);
    console.log("Conversion rate:", conversionRate);

    const revenue = campaign.expectedRevenue || 0;
    const cost = campaign.actualCost || campaign.budgetedCost || 0;
    const roi = cost > 0 ? ((revenue - cost) / cost) * 100 : 0;

    // Activities metrics
    const totalActivities = activities.length;
    const completedActivities = activities.filter(
      (a) => a.status === "Completed"
    ).length;
    const pendingActivities = activities.filter(
      (a) => a.status === "Pending"
    ).length;
    const activityCompletionRate =
      totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

    // Response data for charts
    const responseData = [
      { name: "Responded", value: respondedMembers },
      { name: "Not Responded", value: totalMembers - respondedMembers },
    ];

    const conversionData = [
      { name: "Converted", value: convertedMembers },
      { name: "Not Converted", value: totalMembers - convertedMembers },
    ];

    const typeData = [
      {
        name: "Leads",
        value: parsedMembers.filter((m) => m.type === "lead").length,
      },
      {
        name: "Contacts",
        value: parsedMembers.filter((m) => m.type === "contact").length,
      },
    ];

    // Activities data for charts
    const activityStatusData = [
      {
        name: "Completed",
        value: activities.filter((a) => a.status === "Completed").length,
      },
      {
        name: "In Progress",
        value: activities.filter((a) => a.status === "In Progress").length,
      },
      {
        name: "Pending",
        value: activities.filter((a) => a.status === "Pending").length,
      },
      {
        name: "Cancelled",
        value: activities.filter((a) => a.status === "Cancelled").length,
      },
    ];

    const activityTypeData = [
      {
        name: "Email",
        value: activities.filter((a) => a.type === "Email").length,
      },
      {
        name: "Call",
        value: activities.filter((a) => a.type === "Call").length,
      },
      {
        name: "Meeting",
        value: activities.filter((a) => a.type === "Meeting").length,
      },
      {
        name: "Task",
        value: activities.filter((a) => a.type === "Task").length,
      },
      {
        name: "Note",
        value: activities.filter((a) => a.type === "Note").length,
      },
    ];

    const analyticsData = {
      // Basic metrics
      totalMembers,
      respondedMembers,
      convertedMembers,
      responseRate,
      conversionRate,
      roi,
      totalActivities,
      completedActivities,
      pendingActivities,
      activityCompletionRate,

      // Financial metrics
      budgetedCost: campaign.budgetedCost || 0,
      actualCost: campaign.actualCost || 0,
      expectedRevenue: campaign.expectedRevenue || 0,

      // Chart data
      responseData,
      conversionData,
      typeData,
      activityStatusData,
      activityTypeData,

      // Performance vs target
      performanceData: [
        {
          metric: "Total Members",
          value: totalMembers,
          target: campaign.numbersSent || 100,
        },
        {
          metric: "Response Rate",
          value: responseRate,
          target: campaign.expectedResponse || 20,
        },
        {
          metric: "Conversion Rate",
          value: conversionRate,
          target: 10,
        },
        {
          metric: "ROI",
          value: roi,
          target: 50,
        },
        {
          metric: "Activities Completed",
          value: activityCompletionRate,
          target: 75,
        },
      ],

      // Activity metrics
      activityMetrics: [
        { name: "Total Activities", value: totalActivities },
        { name: "Completed", value: completedActivities },
        { name: "Pending", value: pendingActivities },
        { name: "Completion Rate", value: activityCompletionRate },
      ],
    };

    console.log("=== ANALYTICS DATA SENT ===");
    console.log("Response Rate:", analyticsData.responseRate);
    console.log("Conversion Rate:", analyticsData.conversionRate);
    console.log("=== END DEBUG ===");

    res.json({
      success: true,
      data: analyticsData,
    });
  } catch (error) {
    console.error("Get campaign analytics error:", error);
    console.error("Error stack:", error.stack);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid campaign ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while fetching campaign analytics",
    });
  }
};

module.exports = {
  getCampaignAnalytics,
};
