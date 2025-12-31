// server/routes/file/support/casesRoutes.js
const express = require("express");
const router = express.Router();
const caseController = require("../../../controllers/file/support/cases/caseController");

// GET Routes
router.get("/", caseController.getCases);
router.get("/:id", caseController.getCase);

// POST Routes
router.post("/", caseController.createCase);
router.post("/bulk-update", caseController.bulkUpdateCases);
router.post("/bulk-delete", caseController.bulkDeleteCases);

// PUT Routes
router.put("/:id", caseController.updateCase);

// DELETE Routes
router.delete("/:id", caseController.deleteCase);

module.exports = router;
