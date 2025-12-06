const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    // Lead Information
    leadOwner: {
      type: String,
      required: true,
      default: "System",
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    title: String,
    company: {
      type: String,
      required: true,
    },
    email: String,
    phone: String,
    mobile: String,
    fax: String,
    website: String,
    leadSource: {
      type: String,
      default: "None",
    },
    industry: {
      type: String,
      default: "None",
    },
    leadStatus: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Unqualified"],
      default: "New",
    },
    numberOfEmployees: Number,
    annualRevenue: Number,
    rating: {
      type: String,
      default: "None",
    },
    emailOptOut: {
      type: Boolean,
      default: false,
    },
    skypeID: String,
    secondaryEmail: String,
    twitter: String,

    // Address Information
    streetAddress: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    latitude: String,
    longitude: String,

    // Description
    description: String,

    // Image handling - store as base64 or file path
    image: {
      data: Buffer,
      contentType: String,
      filename: String,
    },
    imageUrl: String,

    // Flags and Status
    isConverted: {
      type: Boolean,
      default: false,
    },
    isJunk: {
      type: Boolean,
      default: false,
    },
    isQualified: {
      type: Boolean,
      default: false,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    isUnsubscribed: {
      type: Boolean,
      default: false,
    },
    isUnread: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },

    // Contact Conversion Information
    convertedToContactId: String,
    convertedToAccountId: String, // For account conversion
    conversionDate: Date,
    approvedAt: Date,
    approvedBy: String,

    // Account Conversion Tracking
    accountConversionDate: Date, // When lead was converted to account
    lastSyncedToAccount: Date, // When lead data was last synced to account

    // Tags
    tags: [String],

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
leadSchema.index({ email: 1 });
leadSchema.index({ company: 1 });
leadSchema.index({ leadStatus: 1 });
leadSchema.index({ isConverted: 1 });
leadSchema.index({ convertedToAccountId: 1 });

// Virtual for getting image URL
leadSchema.virtual("imagePath").get(function () {
  if (this.image && this.image.data) {
    return `data:${this.image.contentType};base64,${this.image.data.toString(
      "base64"
    )}`;
  }
  return this.imageUrl || null;
});

module.exports = mongoose.model("Lead", leadSchema);
