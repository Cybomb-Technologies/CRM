// server/controllers/file/support/cases/createCase.js
const Case = require("../../../../models/file/support/Case");

// Create new case
const createCase = async (req, res) => {
    try {
        const caseData = req.body;

        // Ensure required fields are present
        if (!caseData.subject) {
            return res.status(400).json({
                success: false,
                message: "Subject is required",
            });
        }

        // Set defaults
        const finalCaseData = {
            ...caseData,
            caseOwner: caseData.caseOwner || "System",
            createdBy: "System",
        };

        const newCase = new Case(finalCaseData);
        await newCase.save();

        res.status(201).json({
            success: true,
            message: "Case created successfully",
            data: newCase,
        });
    } catch (error) {
        console.error("Create case error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: Object.values(error.errors).map((err) => err.message),
            });
        }

        res.status(500).json({
            success: false,
            message: "Server error while creating case",
        });
    }
};

module.exports = {
    createCase,
};
