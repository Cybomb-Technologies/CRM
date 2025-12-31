const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
    productId: { type: String },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 }
});

const invoiceSchema = new mongoose.Schema({
    // Invoice Information
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    subject: {
        type: String,
        required: true
    },
    invoiceDate: { type: Date, default: Date.now },
    dueDate: { type: Date },

    // Customer Info
    contactName: { type: String },
    accountName: { type: String, required: true },
    customerId: { type: String },
    customerEmail: { type: String },
    customerPhone: { type: String },

    // Statuses
    status: {
        type: String,
        enum: ['Draft', 'Sent', 'Paid', 'Partial', 'Overdue', 'Cancelled', 'Void'],
        default: 'Draft'
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
    items: [invoiceItemSchema],

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
    purchaseOrderNumber: { type: String },
    salesOrderNumber: { type: String },

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

// Generate Invoice number before validation
invoiceSchema.pre('validate', async function (next) {
    if (!this.invoiceNumber) {
        const count = await this.constructor.countDocuments();
        const year = new Date().getFullYear();
        const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
        const sequence = (count + 1).toString().padStart(4, '0');
        this.invoiceNumber = `INV-${year}${month}-${sequence}`;
    }

    // Calculate totals
    if (this.items && this.items.length > 0) {
        this.subTotal = this.items.reduce((sum, item) => sum + (item.amount || 0), 0);

        const itemsDiscount = this.items.reduce((sum, item) => sum + (item.discount || 0), 0);
        // We can simply set discountTotal to itemsDiscount for now, or if there is a global discount field, handle it.
        // Assuming the structure matches SalesOrder where discountTotal tracks item discounts.
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

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
