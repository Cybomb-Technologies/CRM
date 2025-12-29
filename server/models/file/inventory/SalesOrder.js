const mongoose = require('mongoose');

const salesOrderItemSchema = new mongoose.Schema({
    productId: { type: String }, // Optional, link to product if exists
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 }, // Changed from listPrice to unitPrice to match frontend mocks often
    amount: { type: Number, required: true, min: 0 }, // usually quantity * unitPrice
    discount: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 }
});

const salesOrderSchema = new mongoose.Schema({
    // Order Information
    salesOrderNumber: {
        type: String,
        required: true,
        unique: true
    },
    subject: {
        type: String,
        required: true
    },
    orderDate: { type: Date, default: Date.now },
    dueDate: { type: Date },

    // Customer Info
    contactName: { type: String },
    accountName: { type: String, required: true },
    customerId: { type: String }, // Link to customer if you have one
    customerEmail: { type: String },
    customerPhone: { type: String },

    // Statuses
    status: {
        type: String,
        enum: ['Draft', 'Pending Approval', 'Approved', 'In Progress', 'Shipped', 'Completed', 'Cancelled', 'On Hold'],
        default: 'Draft'
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Partial', 'Pending', 'Unpaid'],
        default: 'Unpaid'
    },

    // Shipping & Billing
    billingAddress: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        code: { type: String },
        country: { type: String }
    },
    shippingAddress: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        code: { type: String },
        country: { type: String }
    },

    // Items
    items: [salesOrderItemSchema],

    // Totals
    subTotal: { type: Number, default: 0 },
    discountTotal: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    adjustment: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },

    // Additional Info
    termsAndConditions: { type: String },
    description: { type: String },
    notes: { type: String },
    carrier: { type: String },
    poNumber: { type: String },
    orderType: { type: String, default: 'Standard' },
    isUrgent: { type: Boolean, default: false },
    tags: [{ type: String }],

    // Meta
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

// Generate Sales Order number before validation to satisfy required check
salesOrderSchema.pre('validate', async function (next) {
    if (!this.salesOrderNumber) {
        const count = await this.constructor.countDocuments();
        const year = new Date().getFullYear();
        const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
        const sequence = (count + 1).toString().padStart(4, '0');
        this.salesOrderNumber = `SO-${year}${month}-${sequence}`;
    }

    // Calculate totals
    if (this.items && this.items.length > 0) {
        this.subTotal = this.items.reduce((sum, item) => sum + (item.amount || 0), 0);
        // discountTotal is usually sum of item discounts or a global discount. 
        // If items have individual discount, sum them up. 
        const itemsDiscount = this.items.reduce((sum, item) => sum + (item.discount || 0), 0);
        // Assuming discountTotal field might be an override or sum. Let's assume sum of items for now or separate.
        // For simplicity, let's say discountTotal is calculated from items if not set explicitly, or handled by logic.
        // But usually frontend sends calculated totals. 
        // Let's recalculate strictly to be safe.
        this.discountTotal = itemsDiscount;

        this.taxTotal = this.items.reduce((sum, item) => sum + (item.tax || 0), 0);

        this.grandTotal = (this.subTotal || 0)
            - (this.discountTotal || 0)
            + (this.taxTotal || 0)
            + (this.shippingCost || 0)
            + (this.adjustment || 0);
    }

    next();
});

const SalesOrder = mongoose.model('SalesOrder', salesOrderSchema);
module.exports = SalesOrder;
