const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Meeting title is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  startTime: {
    type: Date,
    required: [true, "Start time is required"],
  },
  endTime: {
    type: Date,
    required: [true, "End time is required"],
  },
  location: {
    type: String,
    trim: true,
  },
  duration: {
    type: Number, // in minutes
    default: 60,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  status: {
    type: String,
    enum: ["scheduled", "in-progress", "completed", "cancelled"],
    default: "scheduled",
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  meetingLink: {
    type: String,
    trim: true,
  },
  attendees: [
    {
      name: String,
      email: String,
      status: {
        type: String,
        enum: ["accepted", "declined", "tentative", "pending"],
        default: "pending",
      },
    },
  ],
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
meetingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Meeting", meetingSchema);
