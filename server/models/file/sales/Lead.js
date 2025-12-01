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
    imageUrl: String, // Alternative: store URL if using file system

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

    // Conversion Information
    convertedToContactId: String,
    convertedToAccountId: String,
    conversionDate: Date,
    approvedAt: Date,
    approvedBy: String,

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
