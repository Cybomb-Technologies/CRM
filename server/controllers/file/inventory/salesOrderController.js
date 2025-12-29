const SalesOrder = require('../../../models/file/inventory/SalesOrder');

// @desc    Create a new sales order
// @route   POST /api/file/inventory/sales-orders
// @access  Private
const createSalesOrder = async (req, res) => {
    try {
        const {
            subject, accountName, contactName, customerEmail, customerPhone,
            status, orderDate, dueDate, items, billingAddress, shippingAddress,
            subTotal, discountTotal, taxTotal, shippingCost, adjustment, grandTotal,
            termsAndConditions, description, notes, isUrgent, tags
        } = req.body;

        const salesOrder = new SalesOrder({
            subject,
            accountName,
            contactName,
            customerEmail,
            customerPhone,
            status,
            orderDate,
            dueDate,
            items,
            billingAddress,
            shippingAddress,
            subTotal,
            discountTotal,
            taxTotal,
            shippingCost,
            adjustment,
            grandTotal,
            termsAndConditions,
            description,
            notes,
            isUrgent,
            tags,
            createdBy: req.user ? req.user._id : null // Assuming auth middleware adds user
        });

        const createdSalesOrder = await salesOrder.save();
        res.status(201).json(createdSalesOrder);
    } catch (error) {
        console.error('Error creating sales order:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all sales orders with filtering
// @route   GET /api/file/inventory/sales-orders
// @access  Private
const getSalesOrders = async (req, res) => {
    try {
        const { status, paymentStatus, page, limit } = req.query;

        // Build query
        let query = {};
        if (status) query.status = status;
        if (paymentStatus) query.paymentStatus = paymentStatus;

        // Pagination
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;
        const skip = (pageNum - 1) * limitNum;

        const count = await SalesOrder.countDocuments(query);
        const salesOrders = await SalesOrder.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        res.json({
            salesOrders,
            page: pageNum,
            pages: Math.ceil(count / limitNum),
            total: count
        });
    } catch (error) {
        console.error('Error fetching sales orders:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single sales order
// @route   GET /api/file/inventory/sales-orders/:id
// @access  Private
const getSalesOrderById = async (req, res) => {
    try {
        const salesOrder = await SalesOrder.findById(req.params.id);

        if (salesOrder) {
            res.json(salesOrder);
        } else {
            res.status(404).json({ message: 'Sales Order not found' });
        }
    } catch (error) {
        console.error('Error fetching sales order:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update sales order
// @route   PUT /api/file/inventory/sales-orders/:id
// @access  Private
const updateSalesOrder = async (req, res) => {
    try {
        const salesOrder = await SalesOrder.findById(req.params.id);

        if (salesOrder) {
            // Update fields
            Object.assign(salesOrder, req.body);
            salesOrder.updatedBy = req.user ? req.user._id : null;

            const updatedSalesOrder = await salesOrder.save();
            res.json(updatedSalesOrder);
        } else {
            res.status(404).json({ message: 'Sales Order not found' });
        }
    } catch (error) {
        console.error('Error updating sales order:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete sales order
// @route   DELETE /api/file/inventory/sales-orders/:id
// @access  Private
const deleteSalesOrder = async (req, res) => {
    try {
        const salesOrder = await SalesOrder.findById(req.params.id);

        if (salesOrder) {
            await salesOrder.deleteOne();
            res.json({ message: 'Sales Order removed' });
        } else {
            res.status(404).json({ message: 'Sales Order not found' });
        }
    } catch (error) {
        console.error('Error deleting sales order:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createSalesOrder,
    getSalesOrders,
    getSalesOrderById,
    updateSalesOrder,
    deleteSalesOrder
};
