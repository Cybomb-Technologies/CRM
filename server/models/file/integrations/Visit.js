const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, // Format: HH:mm
    required: true,
  },
  endTime: {
    type: String, // Format: HH:mm
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: Number,
    lng: Number,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'in-progress', 'overdue', 'cancelled'],
    default: 'scheduled',
  },
  type: {
    type: String,
    enum: ['on-site', 'online'],
    default: 'on-site',
  },
  relatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedModel',
  },
  relatedModel: {
    type: String,
    enum: ['Lead', 'Contact', 'Deal', 'Account'],
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  checkInTime: Date,
  checkOutTime: Date,
  notes: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Visit', visitSchema);
