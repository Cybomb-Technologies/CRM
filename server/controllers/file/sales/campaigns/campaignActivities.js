// server/controllers/file/sales/campaigns/campaignActivities.js
const Campaign = require("../../../../models/file/sales/Campaign");

// Add activity to campaign
const addActivityToCampaign = async (req, res) => {
  try {
    const { id } = req.params; // Note: changed from campaignId to id to match route parameter
    const activityData = req.body;

    console.log("=== BACKEND DEBUG ===");
    console.log("Campaign ID from params:", id);
    console.log("Activity data received:", activityData);
    console.log("User:", req.user);
    console.log("=== END DEBUG ===");

    // Validate campaign ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Campaign ID is required",
      });
    }

    // Try to find the campaign
    const campaign = await Campaign.findById(id);

    if (!campaign) {
      console.log("Campaign not found with ID:", id);
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    console.log("Campaign found:", campaign.campaignName);

    // Generate a unique ID for the activity
    const activityId = `activity_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const newActivity = {
      id: activityId,
      ...activityData,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: req.user?.id || "System",
      // Ensure status is set
      status: activityData.status || "Pending",
    };

    console.log("New activity to add:", newActivity);

    // Add the activity to the campaign
    campaign.activities.push(newActivity);
    campaign.updatedBy = req.user?.id || "System";
    campaign.updatedAt = new Date();

    // Save the campaign
    await campaign.save();

    console.log("Campaign saved successfully");

    res.json({
      success: true,
      message: "Activity added to campaign",
      data: campaign,
    });
  } catch (error) {
    console.error("Add activity to campaign error:", error);
    console.error("Error stack:", error.stack);

    // Check for specific Mongoose errors
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid campaign ID format: ${error.message}`,
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while adding activity to campaign",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update activity in campaign
const updateActivityInCampaign = async (req, res) => {
  try {
    const { id, activityId } = req.params; // Changed from campaignId to id
    const updateData = req.body;

    console.log("=== UPDATE ACTIVITY DEBUG ===");
    console.log("Campaign ID:", id);
    console.log("Activity ID:", activityId);
    console.log("Update data:", updateData);
    console.log("=== END DEBUG ===");

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    // Find the activity by id
    const activity = campaign.activities.find((a) => a.id === activityId);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found in campaign",
      });
    }

    // Update the activity
    Object.assign(activity, {
      ...updateData,
      updatedAt: new Date(),
    });

    campaign.updatedBy = req.user?.id || "System";
    campaign.updatedAt = new Date();
    await campaign.save();

    res.json({
      success: true,
      message: "Activity updated",
      data: campaign,
    });
  } catch (error) {
    console.error("Update activity in campaign error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating activity in campaign",
    });
  }
};

// Delete activity from campaign
const deleteActivityFromCampaign = async (req, res) => {
  try {
    const { id, activityId } = req.params; // Changed from campaignId to id

    console.log("=== DELETE ACTIVITY DEBUG ===");
    console.log("Campaign ID:", id);
    console.log("Activity ID:", activityId);
    console.log("=== END DEBUG ===");

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    // Filter out the activity to delete
    const initialLength = campaign.activities.length;
    campaign.activities = campaign.activities.filter(
      (activity) => activity.id !== activityId
    );

    const finalLength = campaign.activities.length;

    if (initialLength === finalLength) {
      return res.status(404).json({
        success: false,
        message: "Activity not found in campaign",
      });
    }

    campaign.updatedBy = req.user?.id || "System";
    campaign.updatedAt = new Date();
    await campaign.save();

    res.json({
      success: true,
      message: "Activity deleted from campaign",
      data: campaign,
    });
  } catch (error) {
    console.error("Delete activity from campaign error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while deleting activity from campaign",
    });
  }
};

// Get campaign activities with filters
const getCampaignActivities = async (req, res) => {
  try {
    const { id } = req.params; // Changed from campaignId to id
    const { type, status, priority, search } = req.query;

    console.log("=== GET ACTIVITIES DEBUG ===");
    console.log("Campaign ID:", id);
    console.log("Query params:", { type, status, priority, search });
    console.log("=== END DEBUG ===");

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    let activities = campaign.activities || [];

    // Apply filters
    if (type) {
      activities = activities.filter((activity) => activity.type === type);
    }

    if (status) {
      activities = activities.filter((activity) => activity.status === status);
    }

    if (priority) {
      activities = activities.filter(
        (activity) => activity.priority === priority
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      activities = activities.filter(
        (activity) =>
          activity.title?.toLowerCase().includes(searchLower) ||
          activity.description?.toLowerCase().includes(searchLower) ||
          activity.assignedTo?.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      data: activities,
      total: activities.length,
    });
  } catch (error) {
    console.error("Get campaign activities error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid campaign ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while fetching campaign activities",
    });
  }
};

module.exports = {
  addActivityToCampaign,
  updateActivityInCampaign,
  deleteActivityFromCampaign,
  getCampaignActivities,
};
