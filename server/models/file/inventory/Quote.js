// models/file/sales/Quote.js
const mongoose = require('mongoose');

const quoteItemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  listPrice: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 }
});

const quoteSchema = new mongoose.Schema({
  // Quote Information
  quoteNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  subject: { 
    type: String, 
    required: true 
  },
  quoteOwner: { 
    type: String, 
    required: true 
  },
  quoteStage: { 
    type: String, 
    enum: ['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'],
    default: 'Draft'
  },
  team: { type: String },
  carrier: { 
    type: String, 
    enum: ['FedEX', 'UPS', 'DHL', 'USPS', 'Other'],
    default: 'FedEX'
  },
  dealName: { type: String },
  validUntil: { type: Date },
  contactName: { type: String },
  accountName: { type: String, required: true },
  
  // Billing Address
  billingStreet: { type: String },
  billingCity: { type: String },
  billingState: { type: String },
  billingCode: { type: String },
  billingCountry: { type: String },
  
  // Shipping Address
  shippingStreet: { type: String },
  shippingCity: { type: String },
  shippingState: { type: String },
  shippingCode: { type: String },
  shippingCountry: { type: String },
  
  // Quoted Items
  items: [quoteItemSchema],
  
  // Totals
  subTotal: { type: Number, default: 0 },
  discountTotal: { type: Number, default: 0 },
  taxTotal: { type: Number, default: 0 },
  adjustment: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
  
  // Terms and Conditions
  termsAndConditions: { type: String },
  
  // Description
  description: { type: String },
  
  // Metadata
  status: { 
    type: String, 
    enum: ['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'],
    default: 'Draft'
  },
  date: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  
  // Created/Updated info
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  updatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, {
  timestamps: true
});

// Generate quote number before saving
quoteSchema.pre('save', async function(next) {
  if (!this.quoteNumber) {
    const count = await this.constructor.countDocuments();
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const sequence = (count + 1).toString().padStart(4, '0');
    this.quoteNumber = `QT-${year}${month}-${sequence}`;
  }
  
  // Calculate totals
  if (this.items && this.items.length > 0) {
    this.subTotal = this.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    this.discountTotal = this.items.reduce((sum, item) => sum + (item.discount || 0), 0);
    this.taxTotal = this.items.reduce((sum, item) => sum + (item.tax || 0), 0);
    this.grandTotal = this.subTotal - this.discountTotal + this.taxTotal + (this.adjustment || 0);
  }
  
  next();
});

// Update status based on quoteStage
quoteSchema.pre('save', function(next) {
  this.status = this.quoteStage;
  next();
});

const Quote = mongoose.model('Quote', quoteSchema);
module.exports = Quote;