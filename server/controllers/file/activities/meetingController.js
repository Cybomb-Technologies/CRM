const Meeting = require("../../../models/file/activities/Meeting");

// Get all meetings with filtering
exports.getMeetings = async (req, res) => {
  try {
    const { search, status, priority } = req.query;

    let filter = {};

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
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

    const meetings = await Meeting.find(filter).sort({ startTime: 1 });

    res.json({
      success: true,
      data: meetings,
      count: meetings.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching meetings",
      error: error.message,
    });
  }
};

// Get single meeting
exports.getMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.json({
      success: true,
      data: meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching meeting",
      error: error.message,
    });
  }
};

// Create new meeting
exports.createMeeting = async (req, res) => {
  try {
    const meetingData = {
      ...req.body,
      createdBy: req.user?.id || "system", // Using actual user ID from auth middleware
    };

    const meeting = await Meeting.create(meetingData);

    res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      data: meeting,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating meeting",
      error: error.message,
    });
  }
};

// Update meeting
exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.json({
      success: true,
      message: "Meeting updated successfully",
      data: meeting,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating meeting",
      error: error.message,
    });
  }
};

// Delete meeting
exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.json({
      success: true,
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting meeting",
      error: error.message,
    });
  }
};

// Mark meeting as complete
exports.completeMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.json({
      success: true,
      message: "Meeting marked as complete",
      data: meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error completing meeting",
      error: error.message,
    });
  }
};
