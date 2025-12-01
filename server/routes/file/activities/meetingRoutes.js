const express = require("express");
const router = express.Router();
const meetingController = require("../../../controllers/file/activities/meetingController");

// Get all meetings
router.get("/", meetingController.getMeetings);

// Get single meeting
router.get("/:id", meetingController.getMeeting);

// Create new meeting
router.post("/", meetingController.createMeeting);

// Update meeting
router.put("/:id", meetingController.updateMeeting);

// Delete meeting
router.delete("/:id", meetingController.deleteMeeting);

// Mark meeting as complete
router.patch("/:id/complete", meetingController.completeMeeting);

module.exports = router;
