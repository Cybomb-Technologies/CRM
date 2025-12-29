// controllers/file/sales/quoteController.js
const Quote = require('../../../models/file/inventory/Quote');

// Helper function to format response
const formatQuoteResponse = (quote) => ({
    id: quote._id,
    quoteNumber: quote.quoteNumber,
    subject: quote.subject,
    quoteOwner: quote.quoteOwner,
    quoteStage: quote.quoteStage,
    team: quote.team,
    carrier: quote.carrier,
    dealName: quote.dealName,
    validUntil: quote.validUntil,
    contactName: quote.contactName,
    accountName: quote.accountName,

    // Addresses
    billingStreet: quote.billingStreet,
    billingCity: quote.billingCity,
    billingState: quote.billingState,
    billingCode: quote.billingCode,
    billingCountry: quote.billingCountry,
    shippingStreet: quote.shippingStreet,
    shippingCity: quote.shippingCity,
    shippingState: quote.shippingState,
    shippingCode: quote.shippingCode,
    shippingCountry: quote.shippingCountry,

    // Items
    items: quote.items,

    // Totals
    subTotal: quote.subTotal,
    discountTotal: quote.discountTotal,
    taxTotal: quote.taxTotal,
    adjustment: quote.adjustment,
    grandTotal: quote.grandTotal,

    // Additional fields
    termsAndConditions: quote.termsAndConditions,
    description: quote.description,
    status: quote.status,
    date: quote.date,
    expiryDate: quote.expiryDate,
    createdAt: quote.createdAt,
    updatedAt: quote.updatedAt
});

// Create a new quote
exports.createQuote = async (req, res) => {
    try {
        const quoteData = req.body;

        // Add createdBy if user is authenticated
        if (req.user) {
            quoteData.createdBy = req.user._id;
        }

        const quote = new Quote(quoteData);
        await quote.save();

        res.status(201).json({
            success: true,
            message: 'Quote created successfully',
            data: formatQuoteResponse(quote)
        });
    } catch (error) {
        console.error('❌ Error creating quote:', error);
        console.error('Stack:', error.stack);
        console.error('Request Body:', JSON.stringify(req.body, null, 2));
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating quote',
            details: error.errors // Mongoose validation errors
        });
    }
};

// Get all quotes with filters
exports.getAllQuotes = async (req, res) => {
    try {
        const {
            search,
            status,
            quoteStage,
            carrier,
            startDate,
            endDate,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            page = 1,
            limit = 10
        } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Build filter
        const filter = {};

        if (search) {
            filter.$or = [
                { quoteNumber: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { accountName: { $regex: search, $options: 'i' } },
                { contactName: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) filter.status = status;
        if (quoteStage) filter.quoteStage = quoteStage;
        if (carrier) filter.carrier = carrier;

        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        // Get total count
        const total = await Quote.countDocuments(filter);

        // Get paginated quotes
        const quotes = await Quote.find(filter)
            .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(limitNum);

        // Format response
        const formattedQuotes = quotes.map(formatQuoteResponse);

        res.status(200).json({
            success: true,
            data: formattedQuotes,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error('Error fetching quotes:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching quotes'
        });
    }
};

// Get single quote by ID
exports.getQuoteById = async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);

        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Quote not found'
            });
        }

        res.status(200).json({
            success: true,
            data: formatQuoteResponse(quote)
        });
    } catch (error) {
        console.error('Error fetching quote:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching quote'
        });
    }
};

// Update quote
exports.updateQuote = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Add updatedBy if user is authenticated
        if (req.user) {
            updateData.updatedBy = req.user._id;
        }

        const quote = await Quote.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Quote not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Quote updated successfully',
            data: formatQuoteResponse(quote)
        });
    } catch (error) {
        console.error('Error updating quote:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating quote'
        });
    }
};

// Delete quote
exports.deleteQuote = async (req, res) => {
    try {
        const { id } = req.params;

        const quote = await Quote.findByIdAndDelete(id);

        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Quote not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Quote deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting quote:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting quote'
        });
    }
};

// Bulk delete quotes
exports.bulkDeleteQuotes = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No quote IDs provided'
            });
        }

        const result = await Quote.deleteMany({ _id: { $in: ids } });

        res.status(200).json({
            success: true,
            message: `Successfully deleted ${result.deletedCount} quotes`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error bulk deleting quotes:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error bulk deleting quotes'
        });
    }
};

// Send quote (update status to Sent)
exports.sendQuote = async (req, res) => {
    try {
        const { id } = req.params;

        const quote = await Quote.findByIdAndUpdate(
            id,
            {
                quoteStage: 'Sent',
                status: 'Sent',
                updatedBy: req.user?._id
            },
            { new: true }
        );

        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Quote not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Quote sent successfully',
            data: formatQuoteResponse(quote)
        });
    } catch (error) {
        console.error('Error sending quote:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error sending quote'
        });
    }
};

// Duplicate quote
exports.duplicateQuote = async (req, res) => {
    try {
        const { id } = req.params;

        const originalQuote = await Quote.findById(id);

        if (!originalQuote) {
            return res.status(404).json({
                success: false,
                message: 'Quote not found'
            });
        }

        // Create new quote with copied data
        const quoteData = originalQuote.toObject();
        delete quoteData._id;
        delete quoteData.quoteNumber;
        delete quoteData.createdAt;
        delete quoteData.updatedAt;

        // Update status to Draft
        quoteData.quoteStage = 'Draft';
        quoteData.status = 'Draft';
        quoteData.date = new Date();

        if (req.user) {
            quoteData.createdBy = req.user._id;
        }

        const newQuote = new Quote(quoteData);
        await newQuote.save();

        res.status(201).json({
            success: true,
            message: 'Quote duplicated successfully',
            data: formatQuoteResponse(newQuote)
        });
    } catch (error) {
        console.error('Error duplicating quote:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error duplicating quote'
        });
    }
};

// Get quote statistics
exports.getQuoteStats = async (req, res) => {
    try {
        const stats = await Quote.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalValue: { $sum: '$grandTotal' }
                }
            }
        ]);

        // Get total count
        const totalQuotes = await Quote.countDocuments();
        const totalValue = await Quote.aggregate([
            { $group: { _id: null, total: { $sum: '$grandTotal' } } }
        ]);

        // Format stats
        const formattedStats = {
            totalQuotes,
            totalValue: totalValue[0]?.total || 0,
            byStatus: stats.reduce((acc, stat) => {
                acc[stat._id] = {
                    count: stat.count,
                    value: stat.totalValue
                };
                return acc;
            }, {})
        };

        res.status(200).json({
            success: true,
            data: formattedStats
        });
    } catch (error) {
        console.error('Error fetching quote stats:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching quote statistics'
        });
    }
};