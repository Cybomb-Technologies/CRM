const PriceBook = require('../../../models/file/inventory/PriceBook');

// @desc    Get all price books
// @route   GET /api/price-books
// @access  Private
exports.getPriceBooks = async (req, res) => {
  try {
    const {
      search,
      status,
      source,
      flags,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { priceBookName: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by source
    if (source) {
      query.source = source;
    }

    // Filter by flags
    if (flags) {
      query.flags = flags;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const priceBooks = await PriceBook.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await PriceBook.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: priceBooks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error fetching price books:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single price book
// @route   GET /api/price-books/:id
// @access  Private
exports.getPriceBook = async (req, res) => {
  try {
    const priceBook = await PriceBook.findById(req.params.id);

    if (!priceBook) {
      return res.status(404).json({
        success: false,
        message: 'Price book not found'
      });
    }

    res.json({
      success: true,
      data: priceBook
    });
  } catch (error) {
    console.error('Error fetching price book:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid price book ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create price book
// @route   POST /api/price-books
// @access  Private
exports.createPriceBook = async (req, res) => {
  try {
    const {
      priceBookName,
      description,
      pricingModel,
      company,
      email,
      phone,
      status = 'Active',
      source = '',
      flags = '',
      active = true,
      priceBookOwner = 'DEVASHREE SALUNKE'
    } = req.body;

    // Required field validation
    if (!priceBookName) {
      return res.status(400).json({
        success: false,
        message: 'Price Book Name is required'
      });
    }

    // Create price book
    const priceBook = await PriceBook.create({
      priceBookName,
      name: priceBookName, // Ensure name is set
      description,
      pricingModel,
      company,
      email,
      phone,
      status,
      source,
      flags,
      active,
      priceBookOwner,
      created: new Date(),
      products: 0
    });

    res.status(201).json({
      success: true,
      message: 'Price book created successfully',
      data: priceBook
    });
  } catch (error) {
    console.error('Error creating price book:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update price book
// @route   PUT /api/price-books/:id
// @access  Private
exports.updatePriceBook = async (req, res) => {
  try {
    const priceBook = await PriceBook.findById(req.params.id);

    if (!priceBook) {
      return res.status(404).json({
        success: false,
        message: 'Price book not found'
      });
    }

    // Update fields
    const updates = req.body;
    
    // Ensure name stays in sync with priceBookName
    if (updates.priceBookName && !updates.name) {
      updates.name = updates.priceBookName;
    }

    // Set updated timestamp
    updates.updatedAt = Date.now();

    // Update the price book
    Object.assign(priceBook, updates);
    await priceBook.save();

    res.json({
      success: true,
      message: 'Price book updated successfully',
      data: priceBook
    });
  } catch (error) {
    console.error('Error updating price book:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid price book ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete price book
// @route   DELETE /api/price-books/:id
// @access  Private
exports.deletePriceBook = async (req, res) => {
  try {
    const priceBook = await PriceBook.findById(req.params.id);

    if (!priceBook) {
      return res.status(404).json({
        success: false,
        message: 'Price book not found'
      });
    }

    await priceBook.deleteOne();

    res.json({
      success: true,
      message: 'Price book deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting price book:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid price book ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Bulk delete price books
// @route   DELETE /api/price-books/bulk/delete
// @access  Private
exports.bulkDeletePriceBooks = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of price book IDs to delete'
      });
    }

    const result = await PriceBook.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} price book(s)`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error bulk deleting price books:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Bulk update price books
// @route   PUT /api/price-books/bulk/update
// @access  Private
exports.bulkUpdatePriceBooks = async (req, res) => {
  try {
    const { ids, updates } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of price book IDs to update'
      });
    }

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Please provide updates object'
      });
    }

    // Add updated timestamp
    updates.updatedAt = Date.now();

    const result = await PriceBook.updateMany(
      { _id: { $in: ids } },
      { $set: updates }
    );

    res.json({
      success: true,
      message: `Successfully updated ${result.modifiedCount} price book(s)`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error bulk updating price books:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Export price books to CSV
// @route   GET /api/price-books/export/csv
// @access  Private
exports.exportPriceBooksCSV = async (req, res) => {
  try {
    const priceBooks = await PriceBook.find({}).lean();

    // Convert to CSV format
    const headers = [
      'Name',
      'Company',
      'Email',
      'Phone',
      'Description',
      'Status',
      'Source',
      'Flags',
      'Products',
      'Created',
      'Price Book Owner',
      'Pricing Model',
      'Active'
    ];

    const csvRows = priceBooks.map(book => [
      `"${book.name || ''}"`,
      `"${book.company || ''}"`,
      `"${book.email || ''}"`,
      `"${book.phone || ''}"`,
      `"${book.description || ''}"`,
      `"${book.status || ''}"`,
      `"${book.source || ''}"`,
      `"${book.flags || ''}"`,
      `"${book.products || 0}"`,
      `"${book.created ? new Date(book.created).toISOString().split('T')[0] : ''}"`,
      `"${book.priceBookOwner || ''}"`,
      `"${book.pricingModel || ''}"`,
      `"${book.active ? 'Yes' : 'No'}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=price-books-export-${Date.now()}.csv`);
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting price books:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting price books',
      error: error.message
    });
  }
};

// @desc    Get price books statistics
// @route   GET /api/price-books/stats
// @access  Private
exports.getPriceBooksStats = async (req, res) => {
  try {
    const total = await PriceBook.countDocuments();
    const active = await PriceBook.countDocuments({ status: 'Active' });
    const inactive = await PriceBook.countDocuments({ status: 'Inactive' });
    const pending = await PriceBook.countDocuments({ status: 'Pending' });
    
    // Group by source
    const sourceStats = await PriceBook.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Group by flags
    const flagsStats = await PriceBook.aggregate([
      { $group: { _id: '$flags', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        active,
        inactive,
        pending,
        sourceStats,
        flagsStats
      }
    });
  } catch (error) {
    console.error('Error fetching price books stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};