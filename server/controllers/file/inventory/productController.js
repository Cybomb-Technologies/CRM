const Product = require('../../../models/file/inventory/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'public/uploads/products/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
}).single('productImage');

// Upload middleware
const uploadImage = (req, res, next) => {
  upload(req, res, function(err) {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};

// @desc    Get all products
// @route   GET /api/products
// @access  Private
exports.getAllProducts = async (req, res) => {
  try {
    const {
      search,
      status,
      category,
      source,
      flags,
      page = 1,
      limit = 20,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { productCode: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { vendorName: { $regex: search, $options: 'i' } },
        { productCategory: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (category) {
      filter.productCategory = category;
    }

    if (source) {
      filter.source = source;
    }

    if (flags) {
      filter.flags = flags;
    }

    // Execute query
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;
    
    const products = await Product.find(filter)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments(filter);

    // Format response for frontend compatibility
    const formattedProducts = products.map(product => ({
      id: product._id,
      name: product.productName,
      sku: product.sku || product.productCode,
      price: product.unitPrice,
      stock: product.quantityInStock,
      category: product.productCategory,
      status: product.status,
      company: product.vendorName || product.company,
      email: product.companyEmail || product.email,
      phone: product.companyPhone || product.phone,
      source: product.source,
      flags: product.flags,
      created: product.createdAt.toISOString().split('T')[0],
      description: product.description,
      productOwner: product.productOwner,
      vendorName: product.vendorName,
      manufacturer: product.manufacturer,
      unitPrice: product.unitPrice,
      quantityInStock: product.quantityInStock,
      qtyOrdered: product.qtyOrdered,
      reorderLevel: product.reorderLevel,
      quantityInDemand: product.quantityInDemand,
      productImage: product.productImage,
      productActive: product.productActive,
      productCode: product.productCode,
      productCategory: product.productCategory
    }));

    res.json({
      success: true,
      data: formattedProducts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Format response
    const formattedProduct = {
      id: product._id,
      name: product.productName,
      sku: product.sku || product.productCode,
      price: product.unitPrice,
      stock: product.quantityInStock,
      category: product.productCategory,
      status: product.status,
      company: product.vendorName || product.company,
      email: product.companyEmail || product.email,
      phone: product.companyPhone || product.phone,
      source: product.source,
      flags: product.flags,
      created: product.createdAt.toISOString().split('T')[0],
      description: product.description,
      productOwner: product.productOwner,
      vendorName: product.vendorName,
      manufacturer: product.manufacturer,
      unitPrice: product.unitPrice,
      quantityInStock: product.quantityInStock,
      qtyOrdered: product.qtyOrdered,
      reorderLevel: product.reorderLevel,
      quantityInDemand: product.quantityInDemand,
      productImage: product.productImage,
      productActive: product.productActive,
      productCode: product.productCode,
      productCategory: product.productCategory,
      salesStartDate: product.salesStartDate,
      salesEndDate: product.salesEndDate,
      supportStartDate: product.supportStartDate,
      supportEndDate: product.supportEndDate,
      tax: product.tax,
      commissionRate: product.commissionRate,
      taxable: product.taxable,
      usageUnit: product.usageUnit,
      handler: product.handler
    };

    res.json({
      success: true,
      data: formattedProduct
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private
exports.createProduct = async (req, res) => {
  try {
    // Handle image upload
    let productImage = null;
    if (req.file) {
      productImage = `/uploads/products/${req.file.filename}`;
    }

    // Prepare product data
    const productData = {
      ...req.body,
      productImage
    };

    // Convert string values to appropriate types
    if (productData.unitPrice) productData.unitPrice = parseFloat(productData.unitPrice);
    if (productData.quantityInStock) productData.quantityInStock = parseInt(productData.quantityInStock);
    if (productData.qtyOrdered) productData.qtyOrdered = parseInt(productData.qtyOrdered);
    if (productData.reorderLevel) productData.reorderLevel = parseInt(productData.reorderLevel);
    if (productData.quantityInDemand) productData.quantityInDemand = parseInt(productData.quantityInDemand);
    if (productData.commissionRate) productData.commissionRate = parseFloat(productData.commissionRate);
    
    // Convert boolean strings to booleans
    if (typeof productData.productActive === 'string') {
      productData.productActive = productData.productActive === 'true';
    }
    if (typeof productData.taxable === 'string') {
      productData.taxable = productData.taxable === 'true';
    }

    // Set status based on productActive
    if (productData.productActive === false) {
      productData.status = 'Inactive';
    } else {
      productData.status = productData.status || 'Active';
    }

    // Set sku if not provided
    if (!productData.sku) {
      productData.sku = productData.productCode;
    }

    // Set createdBy from authenticated user
    if (req.user) {
      productData.createdBy = req.user._id;
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        id: product._id,
        name: product.productName,
        sku: product.sku,
        price: product.unitPrice,
        stock: product.quantityInStock,
        category: product.productCategory,
        status: product.status,
        created: product.createdAt.toISOString().split('T')[0]
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `Product with this ${field} already exists`
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Handle image upload
    if (req.file) {
      // Delete old image if exists
      if (product.productImage) {
        const oldImagePath = path.join(__dirname, '..', 'public', product.productImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      req.body.productImage = `/uploads/products/${req.file.filename}`;
    }

    // Convert string values to appropriate types
    if (req.body.unitPrice) req.body.unitPrice = parseFloat(req.body.unitPrice);
    if (req.body.quantityInStock) req.body.quantityInStock = parseInt(req.body.quantityInStock);
    if (req.body.qtyOrdered) req.body.qtyOrdered = parseInt(req.body.qtyOrdered);
    if (req.body.reorderLevel) req.body.reorderLevel = parseInt(req.body.reorderLevel);
    if (req.body.quantityInDemand) req.body.quantityInDemand = parseInt(req.body.quantityInDemand);
    if (req.body.commissionRate) req.body.commissionRate = parseFloat(req.body.commissionRate);
    
    // Convert boolean strings to booleans
    if (typeof req.body.productActive === 'string') {
      req.body.productActive = req.body.productActive === 'true';
    }
    if (typeof req.body.taxable === 'string') {
      req.body.taxable = req.body.taxable === 'true';
    }

    // Update product
    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    // Format response
    const formattedProduct = {
      id: product._id,
      name: product.productName,
      sku: product.sku,
      price: product.unitPrice,
      stock: product.quantityInStock,
      category: product.productCategory,
      status: product.status,
      company: product.vendorName,
      email: product.companyEmail,
      phone: product.companyPhone,
      source: product.source,
      flags: product.flags,
      created: product.createdAt.toISOString().split('T')[0],
      description: product.description,
      productOwner: product.productOwner,
      vendorName: product.vendorName,
      manufacturer: product.manufacturer,
      unitPrice: product.unitPrice,
      quantityInStock: product.quantityInStock,
      qtyOrdered: product.qtyOrdered,
      reorderLevel: product.reorderLevel,
      quantityInDemand: product.quantityInDemand,
      productImage: product.productImage,
      productActive: product.productActive,
      productCode: product.productCode,
      productCategory: product.productCategory
    };

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: formattedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `Product with this ${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete product image if exists
    if (product.productImage) {
      const imagePath = path.join(__dirname, '..', 'public', product.productImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Bulk delete products
// @route   DELETE /api/products/bulk
// @access  Private
exports.bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs are required'
      });
    }

    // Find products to delete their images
    const products = await Product.find({ _id: { $in: ids } });
    
    // Delete images
    products.forEach(product => {
      if (product.productImage) {
        const imagePath = path.join(__dirname, '..', 'public', product.productImage);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    });

    // Delete products
    const result = await Product.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `${result.deletedCount} products deleted successfully`
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Import products from CSV
// @route   POST /api/products/import
// @access  Private
exports.importProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Products data is required'
      });
    }

    // Process and save products
    const savedProducts = [];
    const errors = [];

    for (const productData of products) {
      try {
        // Map CSV fields to product schema
        const product = {
          productName: productData.Name,
          productCode: productData.SKU,
          vendorName: productData.Company,
          productCategory: productData.Category,
          unitPrice: parseFloat(productData.Price) || 0,
          quantityInStock: parseInt(productData.Stock) || 0,
          status: productData.Status || 'Active',
          source: productData.Source || 'Direct',
          flags: productData.Flags || '',
          description: productData.Description || ''
        };

        // Set derived fields
        product.sku = product.productCode;
        product.price = product.unitPrice;
        product.stock = product.quantityInStock;
        product.category = product.productCategory;
        product.company = product.vendorName;
        product.productOwner = 'DEVASHREE SALUNKE';

        const savedProduct = await Product.create(product);
        savedProducts.push(savedProduct);
      } catch (error) {
        errors.push({
          product: productData.Name || 'Unknown',
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `Imported ${savedProducts.length} products successfully`,
      data: {
        imported: savedProducts.length,
        failed: errors.length,
        errors
      }
    });
  } catch (error) {
    console.error('Import products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Export products to CSV
// @route   GET /api/products/export
// @access  Private
exports.exportProducts = async (req, res) => {
  try {
    const products = await Product.find({}).lean();

    // Convert to CSV format
    const csvData = products.map(product => ({
      Name: product.productName,
      SKU: product.productCode,
      Company: product.vendorName,
      Category: product.productCategory,
      Price: product.unitPrice,
      Stock: product.quantityInStock,
      Status: product.status,
      Source: product.source,
      Flags: product.flags,
      Description: product.description,
      'Created At': new Date(product.createdAt).toISOString().split('T')[0]
    }));

    res.json({
      success: true,
      data: csvData
    });
  } catch (error) {
    console.error('Export products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Export upload middleware
exports.uploadImage = uploadImage;