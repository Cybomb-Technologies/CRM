const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    // Deal Information
    title: {
      type: String,
      required: [true, "Deal title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },

    // Contact Information
    contactId: {
      type: String,
      trim: true,
    },
    contactName: {
      type: String,
      trim: true,
    },
    accountId: {
      type: String,
      trim: true,
    },
    accountName: {
      type: String,
      trim: true,
    },

    // Deal Details
    value: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Deal value cannot be negative"],
    },
    probability: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Probability cannot be less than 0"],
      max: [100, "Probability cannot exceed 100"],
    },
    stage: {
      type: String,
      required: true,
      enum: [
        "qualification",
        "needs-analysis",
        "value-proposition",
        "identify-decision-makers",
        "proposal-price-quote",
        "negotiation-review",
        "closed-won",
        "closed-lost",
        "closed-lost-to-competition",
      ],
      default: "qualification",
    },
    closeDate: {
      type: Date,
      required: true,
    },
    owner: {
      type: String,
      trim: true,
      default: "Unassigned",
    },

    // Description & Details
    description: {
      type: String,
      trim: true,
      default: "",
    },
    leadSource: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },

    // Tags
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // Lead Conversion Information
    sourceLeadId: {
      type: String,
      trim: true,
    },

    // Lost Information (for closed-lost stages)
    lostReason: {
      type: String,
      trim: true,
    },
    competitor: {
      type: String,
      trim: true,
    },

    // System Fields
    createdBy: {
      type: String,
      trim: true,
    },
    updatedBy: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for weighted value
dealSchema.virtual("weightedValue").get(function () {
  return ((this.value || 0) * (this.probability || 0)) / 100;
});

// Indexes for better performance
dealSchema.index({ title: 1 });
dealSchema.index({ company: 1 });
dealSchema.index({ contactId: 1 });
dealSchema.index({ stage: 1 });
dealSchema.index({ owner: 1 });
dealSchema.index({ closeDate: 1 });
dealSchema.index({ value: 1 });
dealSchema.index({ probability: 1 });
dealSchema.index({ createdAt: -1 });

const Deal = mongoose.model("Deal", dealSchema);

module.exports = Deal;
