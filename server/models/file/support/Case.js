const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
    {
        // Case Information
        caseOwner: {
            type: String,
            required: true,
            default: "System",
        },
        caseNumber: {
            type: String,
            unique: true,
            default: () => "CASE-" + Date.now(), // Simple auto-generation
        },
        productName: String,
        status: {
            type: String,
            enum: ["New", "In Progress", "Waiting on Customer", "Resolved", "Closed"],
            default: "New",
        },
        type: {
            type: String,
            enum: ["-None-", "Problem", "Feature Request", "Question"],
            default: "-None-",
        },
        priority: {
            type: String,
            enum: ["-None-", "High", "Medium", "Low"],
            default: "-None-",
        },
        caseOrigin: {
            type: String,
            enum: ["-None-", "Email", "Phone", "Web", "Social Media"],
            default: "-None-",
        },
        caseReason: {
            type: String,
            enum: [
                "-None-",
                "Complex Functionality",
                "New Problem",
                "Instructions Not Clear",
            ],
            default: "-None-",
        },

        // Related To
        relatedTo: String,
        relatedToType: {
            type: String,
            enum: ["account", "contact", "deal"],
            default: "account",
        },
        accountName: String,
        reportedBy: String,
        dealName: String,
        email: String,
        phone: String,

        // Case Details
        subject: {
            type: String,
            required: true,
        },
        description: String,
        internalComments: String,
        solution: String,

        // System Information
        createdBy: {
            type: String,
            default: "System",
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
caseSchema.index({ status: 1 });
caseSchema.index({ priority: 1 });
caseSchema.index({ subject: "text" });
caseSchema.index({ email: 1 });
caseSchema.index({ accountName: 1 });

module.exports = mongoose.model("Case", caseSchema);
