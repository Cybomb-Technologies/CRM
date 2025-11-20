const express = require("express");
const router = express.Router();
const taskController = require("../../../controllers/file/activities/taskController");

// Get all tasks
router.get("/", taskController.getTasks);

// Get single task
router.get("/:id", taskController.getTask);

// Create new task
router.post("/", taskController.createTask);

// Update task
router.put("/:id", taskController.updateTask);

// Delete task
router.delete("/:id", taskController.deleteTask);

// Mark task as complete
router.patch("/:id/complete", taskController.completeTask);

module.exports = router;
