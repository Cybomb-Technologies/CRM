const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    country: { type: String, default: "" },
  },
  { _id: false }
);

const accountSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true, trim: true },
  website: { type: String, default: "", trim: true },
  phone: { type: String, default: "", trim: true },
  email: { type: String, default: "", trim: true },
  industry: { type: String, default: "" },
  type: {
    type: String,
    default: "Customer",
    enum: ["Customer", "Partner", "Vendor", "Prospect", "Other"],
  },

  // Business Information
  contacts: { type: Number, default: 0 },
  employees: { type: Number, default: 0 },
  annualRevenue: { type: Number, default: 0 },

  // Address Information
  billingAddress: { type: addressSchema, default: () => ({}) },
  shippingAddress: { type: addressSchema, default: () => ({}) },

  // Description
  description: { type: String, default: "" },

  // System Fields
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: String, default: "system" },
  updatedBy: { type: String, default: "system" },
  isActive: { type: Boolean, default: true },
});

// Update timestamp before save
accountSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for better query performance
accountSchema.index({ name: 1 });
accountSchema.index({ industry: 1 });
accountSchema.index({ type: 1 });
accountSchema.index({ createdAt: -1 });
accountSchema.index({ annualRevenue: -1 });
accountSchema.index({ name: "text", website: "text", email: "text" });

module.exports = mongoose.model("Account", accountSchema);
