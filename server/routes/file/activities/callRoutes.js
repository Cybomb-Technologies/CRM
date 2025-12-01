const express = require("express");
const router = express.Router();
const callController = require("../../../controllers/file/activities/callController");

// Get all calls
router.get("/", callController.getCalls);

// Get single call
router.get("/:id", callController.getCall);

// Create new call
router.post("/", callController.createCall);

// Update call
router.put("/:id", callController.updateCall);

// Delete call
router.delete("/:id", callController.deleteCall);

// Mark call as complete
router.patch("/:id/complete", callController.completeCall);

module.exports = router;
