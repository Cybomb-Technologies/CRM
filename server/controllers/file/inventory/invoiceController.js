const Invoice = require('../../../models/file/inventory/Invoice');

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Private
const createInvoice = async (req, res) => {
    try {
        console.log('📝 [Invoice] Create Request Body:', JSON.stringify(req.body, null, 2));

        const invoiceData = {
            ...req.body,
            createdBy: req.user ? req.user._id : null
        };

        const invoice = await Invoice.create(invoiceData);
        console.log('✅ [Invoice] Created Successfully:', invoice._id);

        res.status(201).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        console.error('❌ [Invoice] Creation Error:', error); // Log the full error object
        console.error('❌ [Invoice] Validation Errors:', error.errors); // Log specific validation errors if any

        res.status(400).json({
            success: false,
            message: error.message,
            details: error.errors // detailed Mongoose validation errors
        });
    }
};

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({})
            .sort({ createdAt: -1 }); // Newest first

        res.status(200).json({
            success: true,
            count: invoices.length,
            data: invoices
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private
const updateInvoice = async (req, res) => {
    try {
        let invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedBy: req.user ? req.user._id : null },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private
const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        await invoice.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice
};
