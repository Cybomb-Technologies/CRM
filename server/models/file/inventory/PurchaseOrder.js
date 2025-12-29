// models/PurchaseOrder.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  listPrice: {
    type: Number,
    required: [true, 'List price is required'],
    min: [0, 'List price cannot be negative']
  },
  amount: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  }
});

const totalsSchema = new mongoose.Schema({
  amount: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  }
});

const purchaseOrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: [true, 'Order number is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  vendorName: {
    type: String,
    required: [true, 'Vendor name is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Created', 'Approved', 'Sent', 'Received', 'Partially Received', 'Closed', 'Cancelled'],
    default: 'Created'
  },
  poDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date
  },
  totals: totalsSchema,
  items: [itemSchema],
  poOwner: {
    type: String,
    required: [true, 'PO owner is required'],
    trim: true
  },
  requisitionNumber: {
    type: String,
    trim: true
  },
  contactName: {
    type: String,
    trim: true
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  carrier: {
    type: String,
    enum: ['FedEX', 'UPS', 'DHL', 'USPS', 'BlueDart', 'DTDC', ''],
    default: ''
  },
  
  // Additional fields from your form
  exciseDuty: {
    type: Number,
    default: 0,
    min: [0, 'Excise duty cannot be negative']
  },
  salesCommission: {
    type: Number,
    default: 0,
    min: [0, 'Sales commission cannot be negative']
  },
  
  // Address information
  billingAddress: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    code: { type: String, trim: true },
    country: { type: String, trim: true }
  },
  shippingAddress: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    code: { type: String, trim: true },
    country: { type: String, trim: true }
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate totals
purchaseOrderSchema.pre('save', function(next) {
  // Calculate item amounts
  this.items.forEach(item => {
    item.amount = item.quantity * item.listPrice;
    const discountAmount = (item.amount * item.discount) / 100;
    const amountAfterDiscount = item.amount - discountAmount;
    item.tax = (amountAfterDiscount * 18) / 100; // 18% GST
    item.total = amountAfterDiscount + item.tax;
  });

  // Calculate totals
  const totals = this.items.reduce((acc, item) => ({
    amount: acc.amount + item.amount,
    discount: acc.discount + ((item.amount * item.discount) / 100),
    tax: acc.tax + item.tax,
    total: acc.total + item.total
  }), { amount: 0, discount: 0, tax: 0, total: 0 });

  this.totals = totals;
  
  // Add additional charges to total if needed
  // this.totals.total += (this.exciseDuty || 0) + (this.salesCommission || 0);
  
  next();
});

// Method to soft delete
purchaseOrderSchema.methods.softDelete = function() {
  this.isDeleted = true;
  return this.save();
};

// Static method to generate PO number
purchaseOrderSchema.statics.generatePONumber = async function() {
  const year = new Date().getFullYear();
  const prefix = `PO-${year}-`;
  
  const lastPO = await this.findOne({ 
    orderNumber: { $regex: `^${prefix}` } 
  }).sort({ orderNumber: -1 });
  
  if (!lastPO) {
    return `${prefix}001`;
  }
  
  const lastNumber = parseInt(lastPO.orderNumber.split('-').pop());
  const nextNumber = (lastNumber + 1).toString().padStart(3, '0');
  return `${prefix}${nextNumber}`;
};

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);
module.exports = PurchaseOrder;