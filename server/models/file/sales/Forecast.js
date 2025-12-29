const mongoose = require('mongoose');

const forecastSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quotas: {
    monthly: {
      type: Number,
      default: 14000000 // Default 1.4Cr
    },
    quarterly: {
      type: Number,
      default: 42000000 // Default 4.2Cr
    },
    yearly: {
      type: Number,
      default: 168000000 // Default 16.8Cr
    }
  },
  settings: {
    probabilityThreshold: {
      type: Number,
      default: 70
    },
    includeClosedLost: {
      type: Boolean,
      default: false
    },
    autoRefresh: {
      type: Boolean,
      default: true
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one forecast config per user
forecastSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('Forecast', forecastSchema);
