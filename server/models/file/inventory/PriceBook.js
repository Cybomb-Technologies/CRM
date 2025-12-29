const mongoose = require('mongoose');

const priceBookSchema = new mongoose.Schema({
  // Price Book Information
  priceBookOwner: {
    type: String,
    required: true,
    default: 'DEVASHREE SALUNKE'
  },
  active: {
    type: Boolean,
    default: true
  },
  priceBookName: {
    type: String,
    required: [true, 'Price Book Name is required'],
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  pricingModel: {
    type: String,
    enum: ['standard', 'tiered', 'volume', 'subscription', 'custom', ''],
    default: ''
  },
  
  // Company Information (if applicable)
  company: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  
  // Description Information
  description: {
    type: String,
    trim: true
  },
  
  // Status and Metadata
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Active'
  },
  source: {
    type: String,
    enum: ['Website', 'Partner', 'Direct', 'Reseller', 'Government', ''],
    default: ''
  },
  flags: {
    type: String,
    enum: ['Default', 'Premium', 'Standard', 'Volume', 'Special', 'Restricted', ''],
    default: ''
  },
  
  // Products Information
  products: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  created: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save middleware to ensure name matches priceBookName
priceBookSchema.pre('save', function(next) {
  if (this.priceBookName && !this.name) {
    this.name = this.priceBookName;
  }
  this.updatedAt = Date.now();
  next();
});

// Indexes for better query performance
priceBookSchema.index({ priceBookName: 1 });
priceBookSchema.index({ status: 1 });
priceBookSchema.index({ created: -1 });
priceBookSchema.index({ company: 1 });
priceBookSchema.index({ flags: 1 });

const PriceBook = mongoose.model('PriceBook', priceBookSchema);

module.exports = PriceBook;