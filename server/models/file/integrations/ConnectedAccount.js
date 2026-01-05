const mongoose = require('mongoose');

const ConnectedAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  provider: {
    type: String, // gmail, outlook, smtp
    required: true
  },
  status: {
    type: String,
    enum: ['connected', 'disconnected', 'error'],
    default: 'connected'
  },
  accessToken: String,
  refreshToken: String,
  credentials: {
    host: String,
    port: Number,
    secure: Boolean,
    user: String,
    pass: String
  },
  lastSync: Date
}, { timestamps: true });

module.exports = mongoose.model('ConnectedAccount', ConnectedAccountSchema);
