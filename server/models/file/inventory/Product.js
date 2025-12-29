const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Product Information
  productOwner: {
    type: String,
    default: 'DEVASHREE SALUNKE'
  },
  productCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  productCategory: {
    type: String,
    trim: true
  },
  productActive: {
    type: Boolean,
    default: true
  },
  
  // Company Information
  vendorName: {
    type: String,
    trim: true
  },
  manufacturer: {
    type: String,
    trim: true
  },
  companyEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  companyPhone: {
    type: String,
    trim: true
  },
  
  // Dates
  salesStartDate: {
    type: Date
  },
  salesEndDate: {
    type: Date
  },
  supportStartDate: {
    type: Date
  },
  supportEndDate: {
    type: Date
  },
  
  // Price Information
  unitPrice: {
    type: Number,
    default: 0
  },
  tax: {
    type: String,
    enum: ['None', 'GST', 'VAT', 'Sales Tax'],
    default: 'None'
  },
  taxable: {
    type: Boolean,
    default: false
  },
  commissionRate: {
    type: Number,
    default: 0
  },
  
  // Stock Information
  usageUnit: {
    type: String,
    enum: ['Box', 'Piece', 'Kg', 'Liter', 'Meter', 'Unit'],
    default: 'Unit'
  },
  quantityInStock: {
    type: Number,
    default: 0
  },
  handler: {
    type: String,
    default: 'None'
  },
  qtyOrdered: {
    type: Number,
    default: 0
  },
  reorderLevel: {
    type: Number,
    default: 0
  },
  quantityInDemand: {
    type: Number,
    default: 0
  },
  
  // Description
  description: {
    type: String,
    trim: true
  },
  
  // Image
  productImage: {
    type: String,
    default: null
  },
  
  // Status
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Active'
  },
  
  // Source
  source: {
    type: String,
    enum: ['Website', 'Partner', 'Direct', 'Reseller'],
    default: 'Direct'
  },
  
  // Flags
  flags: {
    type: String,
    enum: ['Featured', 'New', 'Sale', 'Best Seller', 'Limited Stock', ''],
    default: ''
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sku: {
    type: String,
    unique: true,
    trim: true
  },
  stock: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    trim: true
  },
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for display name (compatibility with frontend)
productSchema.virtual('name').get(function() {
  return this.productName;
});

// Pre-save middleware to set compatible fields
productSchema.pre('save', function(next) {
  if (!this.sku) {
    this.sku = this.productCode;
  }
  if (!this.name) {
    this.name = this.productName;
  }
  if (!this.price) {
    this.price = this.unitPrice;
  }
  if (!this.stock) {
    this.stock = this.quantityInStock;
  }
  if (!this.category) {
    this.category = this.productCategory;
  }
  if (!this.company) {
    this.company = this.vendorName;
  }
  if (!this.email) {
    this.email = this.companyEmail;
  }
  if (!this.phone) {
    this.phone = this.companyPhone;
  }
  
  next();
});

module.exports = mongoose.model('Product', productSchema);