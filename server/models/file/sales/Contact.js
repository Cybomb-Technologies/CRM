const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    // Contact Information
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
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
    title: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
      default: "None",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    assistant: {
      type: String,
      trim: true,
    },
    assistantPhone: {
      type: String,
      trim: true,
    },
    leadSource: {
      type: String,
      trim: true,
      default: "None",
    },
    reportsTo: {
      type: String,
      trim: true,
    },
    emailOptOut: {
      type: Boolean,
      default: false,
    },

    // Address Information
    mailingAddress: {
      street: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, default: "" },
      state: { type: String, trim: true, default: "" },
      zipCode: { type: String, trim: true, default: "" },
      country: { type: String, trim: true, default: "" },
    },
    otherAddress: {
      street: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, default: "" },
      state: { type: String, trim: true, default: "" },
      zipCode: { type: String, trim: true, default: "" },
      country: { type: String, trim: true, default: "" },
    },

    // Description
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // Lead Conversion Information
    convertedFromLead: {
      type: String,
      trim: true,
    },
    leadConversionDate: {
      type: Date,
    },
    lastSyncedFromLead: {
      type: Date,
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

// Virtual for full name
contactSchema.virtual("name").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Indexes for better performance
contactSchema.index({ firstName: 1, lastName: 1 });
contactSchema.index({ email: 1 });
contactSchema.index({ accountId: 1 });
contactSchema.index({ convertedFromLead: 1 });
contactSchema.index({ createdAt: -1 });

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
