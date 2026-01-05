const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Eventually should be required
  },
  connectedAccountId: {
    type: String, // Or ObjectId if referencing ConnectedAccount model
    required: true
  },
  messageId: {
    type: String,
    unique: true
  },
  threadId: String,
  from: {
    name: String,
    email: {
      type: String,
      required: true
    }
  },
  to: [{
    name: String,
    email: String
  }],
  subject: String,
  snippet: String,
  body: String, // HMTL or Text
  date: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  },
  important: {
    type: Boolean,
    default: false
  },
  folder: {
    type: String,
    default: 'inbox', // inbox, sent, drafts, trash, spam
    enum: ['inbox', 'sent', 'drafts', 'trash', 'spam', 'archive']
  },
  labels: [String],
  hasAttachment: {
    type: Boolean,
    default: false
  },
  attachments: [{
    filename: String,
    path: String,
    contentType: String,
    size: Number
  }],
  relatedTo: {
    type: {
        type: String,
        enum: ['lead', 'contact', 'deal', 'account', 'none'],
        default: 'none'
    },
    id: String,
    name: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Email', EmailSchema);
