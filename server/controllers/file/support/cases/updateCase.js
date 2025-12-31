// server/controllers/file/support/cases/updateCase.js
const Case = require("../../../../models/file/support/Case");

// Update case
const updateCase = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if case exists
        const existingCase = await Case.findById(id);
        if (!existingCase) {
            return res.status(404).json({
                success: false,
                message: "Case not found",
            });
        }

        const updatedCase = await Case.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: "Case updated successfully",
            data: updatedCase,
        });
    } catch (error) {
        console.error("Update case error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: Object.values(error.errors).map((err) => err.message),
            });
        }

        res.status(500).json({
            success: false,
            message: "Server error while updating case",
        });
    }
};

// Bulk update cases
const bulkUpdateCases = async (req, res) => {
    try {
        const { caseIds, updates } = req.body;

        if (!caseIds || !Array.isArray(caseIds) || caseIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No case IDs provided",
            });
        }

        const result = await Case.updateMany(
            { _id: { $in: caseIds } },
            { $set: updates }
        );

        res.json({
            success: true,
            message: `${result.modifiedCount} cases updated successfully`,
            data: result,
        });
    } catch (error) {
        console.error("Bulk update cases error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while updating cases",
        });
    }
};

module.exports = {
    updateCase,
    bulkUpdateCases,
};
