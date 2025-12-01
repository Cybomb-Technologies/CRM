//callController.js
const Call = require("../../../models/file/activities/Call");

// Get all calls with filtering
exports.getCalls = async (req, res) => {
  try {
    const { search, status, priority, callType } = req.query;

    let filter = {};

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
        { outcome: { $regex: search, $options: "i" } },
      ];
    }

    // Status filter
    if (status && status !== "all") {
      filter.status = status;
    }

    // Priority filter
    if (priority && priority !== "all") {
      filter.priority = priority;
    }

    // Call type filter
    if (callType && callType !== "all") {
      filter.callType = callType;
    }

    const calls = await Call.find(filter).sort({ scheduledTime: 1 });

    res.json({
      success: true,
      data: calls,
      count: calls.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching calls",
      error: error.message,
    });
  }
};

// Get single call
exports.getCall = async (req, res) => {
  try {
    const call = await Call.findById(req.params.id);

    if (!call) {
      return res.status(404).json({
        success: false,
        message: "Call not found",
      });
    }

    res.json({
      success: true,
      data: call,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching call",
      error: error.message,
    });
  }
};

// Create new call
exports.createCall = async (req, res) => {
  try {
    const callData = {
      ...req.body,
      createdBy: req.user?.id || "system", // Using actual user ID from auth middleware
    };

    const call = await Call.create(callData);

    res.status(201).json({
      success: true,
      message: "Call created successfully",
      data: call,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating call",
      error: error.message,
    });
  }
};

// Update call
exports.updateCall = async (req, res) => {
  try {
    const call = await Call.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!call) {
      return res.status(404).json({
        success: false,
        message: "Call not found",
      });
    }

    res.json({
      success: true,
      message: "Call updated successfully",
      data: call,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating call",
      error: error.message,
    });
  }
};

// Delete call
exports.deleteCall = async (req, res) => {
  try {
    const call = await Call.findByIdAndDelete(req.params.id);

    if (!call) {
      return res.status(404).json({
        success: false,
        message: "Call not found",
      });
    }

    res.json({
      success: true,
      message: "Call deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting call",
      error: error.message,
    });
  }
};

// Mark call as complete
exports.completeCall = async (req, res) => {
  try {
    const call = await Call.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );

    if (!call) {
      return res.status(404).json({
        success: false,
        message: "Call not found",
      });
    }

    res.json({
      success: true,
      message: "Call marked as complete",
      data: call,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error completing call",
      error: error.message,
    });
  }
};
