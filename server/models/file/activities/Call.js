const mongoose = require("mongoose");

const callSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Call title is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  scheduledTime: {
    type: Date,
    required: [true, "Scheduled time is required"],
  },
  duration: {
    type: Number, // in minutes
    default: 30,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  status: {
    type: String,
    enum: ["scheduled", "completed", "missed", "cancelled"],
    default: "scheduled",
  },
  callType: {
    type: String,
    enum: ["inbound", "outbound"],
    required: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  outcome: {
    type: String,
    trim: true,
  },
  callRecording: {
    type: String, // URL to call recording
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  relatedTo: {
    type: {
      type: String,
      enum: ["deal", "account", "contact", "lead"],
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  assignedTo: {
    type: String,
    required: [true, "Assigned to is required"],
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
callSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Call", callSchema);
