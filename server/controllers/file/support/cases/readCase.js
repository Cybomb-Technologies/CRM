// server/controllers/file/support/cases/readCase.js
const Case = require("../../../../models/file/support/Case");

// Get all cases with filtering and pagination
const getCases = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            status,
            priority,
            type,
        } = req.query;

        const query = {};

        // Search filter
        if (search) {
            query.$or = [
                { subject: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { caseNumber: { $regex: search, $options: "i" } },
                { accountName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        // Status filter
        if (status && status !== "All Cases") {
            query.status = status;
        }

        // Priority filter
        if (priority) {
            query.priority = priority;
        }

        // Type filter
        if (type) {
            query.type = type;
        }

        const cases = await Case.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Case.countDocuments(query);

        res.json({
            success: true,
            data: cases,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error("Get cases error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching cases",
        });
    }
};

// Get single case
const getCase = async (req, res) => {
    try {
        const caseData = await Case.findById(req.params.id);

        if (!caseData) {
            return res.status(404).json({
                success: false,
                message: "Case not found",
            });
        }

        res.json({
            success: true,
            data: caseData,
        });
    } catch (error) {
        console.error("Get case error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching case",
        });
    }
};

module.exports = {
    getCases,
    getCase,
};
