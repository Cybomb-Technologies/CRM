// server/models/file/sales/Campaign.js
const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    // Basic Campaign Information
    campaignOwner: {
      type: String,
      required: true,
      default: "Current User",
    },
    campaignName: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "Email",
        "Telemarketing",
        "Webinar",
        "Conference",
        "Trade Show",
        "Advertisement",
        "Social Media",
        "Direct Mail",
        "Partnership",
        "Other",
      ],
      default: "Email",
    },
    status: {
      type: String,
      enum: ["Planning", "Active", "Completed", "Inactive", "Cancelled"],
      default: "Planning",
    },

    // Dates
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },

    // Financial Information
    budgetedCost: {
      type: Number,
      default: 0,
    },
    actualCost: {
      type: Number,
      default: 0,
    },
    expectedRevenue: {
      type: Number,
      default: 0,
    },
    expectedResponse: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    numbersSent: {
      type: Number,
      default: 0,
    },

    // Campaign Details
    goal: {
      type: String,
      trim: true,
    },
    targetAudience: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    // Members (Leads/Contacts in campaign)
    members: [
      {
        id: String, // Lead or Contact ID
        name: String,
        email: String,
        type: String, // 'lead' or 'contact'
        company: String,
        addedDate: {
          type: Date,
          default: Date.now,
        },
        responded: {
          type: Boolean,
          default: false,
        },
        respondedDate: Date,
        converted: {
          type: Boolean,
          default: false,
        },
        convertedDate: Date,
        notes: String,
      },
    ],

    // Activities (Emails, Calls, Meetings, Tasks)
    activities: [
      {
        id: String,
        title: String,
        type: {
          type: String,
          enum: ["Email", "Call", "Meeting", "Task", "Note"],
          default: "Email",
        },
        status: {
          type: String,
          enum: ["Pending", "In Progress", "Completed", "Cancelled"],
          default: "Pending",
        },
        priority: {
          type: String,
          enum: ["Low", "Medium", "High"],
          default: "Medium",
        },
        description: String,
        assignedTo: String,
        dueDate: Date,
        relatedTo: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        createdBy: String,
        outcome: String,
        duration: Number, // in minutes
      },
    ],

    // Analytics Tracking
    totalResponses: {
      type: Number,
      default: 0,
    },
    totalConversions: {
      type: Number,
      default: 0,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },

    // System Information
    createdBy: {
      type: String,
      default: "System",
    },
    updatedBy: {
      type: String,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
campaignSchema.index({ campaignName: "text", description: "text" });
campaignSchema.index({ status: 1 });
campaignSchema.index({ type: 1 });
campaignSchema.index({ startDate: 1, endDate: 1 });
campaignSchema.index({ "members.id": 1 });

// Virtual for ROI calculation
campaignSchema.virtual("roi").get(function () {
  const revenue = this.expectedRevenue || 0;
  const cost = this.actualCost || this.budgetedCost || 0;
  if (cost === 0) return 0;
  return ((revenue - cost) / cost) * 100;
});

// Virtual for campaign duration
campaignSchema.virtual("duration").get(function () {
  if (!this.startDate || !this.endDate) return 0;
  const diffTime = Math.abs(this.endDate - this.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // days
});

// Ensure virtuals are included in JSON output
campaignSchema.set("toJSON", { virtuals: true });
campaignSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Campaign", campaignSchema);