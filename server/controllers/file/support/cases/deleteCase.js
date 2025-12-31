// server/controllers/file/support/cases/deleteCase.js
const Case = require("../../../../models/file/support/Case");

// Delete case
const deleteCase = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCase = await Case.findByIdAndDelete(id);

        if (!deletedCase) {
            return res.status(404).json({
                success: false,
                message: "Case not found",
            });
        }

        res.json({
            success: true,
            message: "Case deleted successfully",
        });
    } catch (error) {
        console.error("Delete case error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting case",
        });
    }
};

// Bulk delete cases
const bulkDeleteCases = async (req, res) => {
    try {
        const { caseIds } = req.body;

        if (!caseIds || !Array.isArray(caseIds) || caseIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No case IDs provided",
            });
        }

        const result = await Case.deleteMany({ _id: { $in: caseIds } });

        res.json({
            success: true,
            message: `${result.deletedCount} cases deleted successfully`,
        });
    } catch (error) {
        console.error("Bulk delete cases error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting cases",
        });
    }
};

module.exports = {
    deleteCase,
    bulkDeleteCases,
};
