const express = require("express");
const mongoose = require("mongoose");

const app = express();

// MongoDB connection
const MONGODB_URI = "mongodb://localhost:27017/cloudcrm";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Simple origin check middleware
app.use((req, res, next) => {
  const allowedOrigin = "http://localhost:3000";
  const requestOrigin = req.headers.origin;
  console.log(requestOrigin);
  // Only set CORS headers if request comes from allowed origin
  if (requestOrigin === allowedOrigin) {
    res.header("Access-Control-Allow-Origin", allowedOrigin);
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  }

  next();
});

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/file/activities/taskRoutes"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});
// Sales Order Schema
const salesOrderSchema = new mongoose.Schema({
  salesOrderOwner: {
    type: String,
    required: true,
    default: 'DEVASHREE SALUNKE'
  },
  subject: {
    type: String,
    required: true
  },
  customerNo: String,
  quoteName: String,
  pending: String,
  carrier: {
    type: String,
    default: 'FedEX'
  },
  salesCommission: Number,
  accountName: String,
  dealName: String,
  purchaseOrder: String,
  dueDate: Date,
  contactName: String,
  exciseDuty: Number,
  status: {
    type: String,
    default: 'Created'
  },
  billingAddress: {
    country: String,
    building: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    latitude: String,
    longitude: String
  },
  shippingAddress: {
    country: String,
    building: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    latitude: String,
    longitude: String
  },
  items: [{
    productName: String,
    quantity: Number,
    listPrice: Number,
    amount: Number,
    discount: Number,
    tax: Number,
    total: Number,
    description: String
  }],
  subTotal: Number,
  totalDiscount: Number,
  totalTax: Number,
  grandTotal: Number,
  termsAndConditions: String,
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const SalesOrder = mongoose.model('SalesOrder', salesOrderSchema);

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = await User.findById(decoded.userId).select('-password');
    
    if (!req.user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// Sales Order Routes

// Create Sales Order
app.post('/api/sales-orders', authMiddleware, async (req, res) => {
  try {
    const {
      subject,
      customerNo,
      quoteName,
      pending,
      carrier,
      salesCommission,
      accountName,
      dealName,
      purchaseOrder,
      dueDate,
      contactName,
      exciseDuty,
      status,
      billingAddress,
      shippingAddress,
      items,
      termsAndConditions,
      description
    } = req.body;

    console.log('📝 Creating sales order for user:', req.user.email);

    // Validation
    if (!subject) {
      return res.status(400).json({
        success: false,
        message: 'Subject is required'
      });
    }

    // Calculate totals
    const subTotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const totalDiscount = items.reduce((sum, item) => sum + (parseFloat(item.discount) || 0), 0);
    const totalTax = items.reduce((sum, item) => sum + (parseFloat(item.tax) || 0), 0);
    const grandTotal = subTotal - totalDiscount + totalTax;

    // Create sales order
    const salesOrder = new SalesOrder({
      salesOrderOwner: 'DEVASHREE SALUNKE', // You can make this dynamic based on logged-in user
      subject,
      customerNo,
      quoteName,
      pending,
      carrier: carrier || 'FedEX',
      salesCommission: parseFloat(salesCommission) || 0,
      accountName,
      dealName,
      purchaseOrder,
      dueDate: dueDate ? new Date(dueDate) : null,
      contactName,
      exciseDuty: parseFloat(exciseDuty) || 0,
      status: status || 'Created',
      billingAddress: billingAddress || {},
      shippingAddress: shippingAddress || {},
      items: items.map(item => ({
        productName: item.productName,
        quantity: parseFloat(item.quantity) || 0,
        listPrice: parseFloat(item.listPrice) || 0,
        amount: parseFloat(item.amount) || 0,
        discount: parseFloat(item.discount) || 0,
        tax: parseFloat(item.tax) || 0,
        total: parseFloat(item.total) || 0,
        description: item.description
      })),
      subTotal,
      totalDiscount,
      totalTax,
      grandTotal,
      termsAndConditions,
      description,
      createdBy: req.user._id
    });

    await salesOrder.save();

    // Populate the createdBy field for response
    await salesOrder.populate('createdBy', 'name email');

    console.log('✅ Sales order created successfully:', salesOrder._id);

    res.status(201).json({
      success: true,
      message: 'Sales order created successfully',
      salesOrder
    });

  } catch (error) {
    console.error('🚨 Sales order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during sales order creation'
    });
  }
});

// Get All Sales Orders
app.get('/api/sales-orders', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    
    const query = { createdBy: req.user._id };
    
    // Add search filter
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { accountName: { $regex: search, $options: 'i' } },
        { contactName: { $regex: search, $options: 'i' } },
        { customerNo: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add status filter
    if (status) {
      query.status = status;
    }

    const salesOrders = await SalesOrder.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SalesOrder.countDocuments(query);

    console.log(`📋 Found ${salesOrders.length} sales orders for user:`, req.user.email);

    res.json({
      success: true,
      salesOrders,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error('🚨 Get sales orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sales orders'
    });
  }
});

// Get Single Sales Order
app.get('/api/sales-orders/:id', authMiddleware, async (req, res) => {
  try {
    const salesOrder = await SalesOrder.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    }).populate('createdBy', 'name email');

    if (!salesOrder) {
      return res.status(404).json({
        success: false,
        message: 'Sales order not found'
      });
    }

    res.json({
      success: true,
      salesOrder
    });

  } catch (error) {
    console.error('🚨 Get sales order error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Sales order not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sales order'
    });
  }
});

// Update Sales Order
app.put('/api/sales-orders/:id', authMiddleware, async (req, res) => {
  try {
    const {
      subject,
      customerNo,
      quoteName,
      pending,
      carrier,
      salesCommission,
      accountName,
      dealName,
      purchaseOrder,
      dueDate,
      contactName,
      exciseDuty,
      status,
      billingAddress,
      shippingAddress,
      items,
      termsAndConditions,
      description
    } = req.body;

    const salesOrder = await SalesOrder.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!salesOrder) {
      return res.status(404).json({
        success: false,
        message: 'Sales order not found'
      });
    }

    // Calculate totals
    const subTotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const totalDiscount = items.reduce((sum, item) => sum + (parseFloat(item.discount) || 0), 0);
    const totalTax = items.reduce((sum, item) => sum + (parseFloat(item.tax) || 0), 0);
    const grandTotal = subTotal - totalDiscount + totalTax;

    // Update sales order
    salesOrder.subject = subject;
    salesOrder.customerNo = customerNo;
    salesOrder.quoteName = quoteName;
    salesOrder.pending = pending;
    salesOrder.carrier = carrier;
    salesOrder.salesCommission = parseFloat(salesCommission) || 0;
    salesOrder.accountName = accountName;
    salesOrder.dealName = dealName;
    salesOrder.purchaseOrder = purchaseOrder;
    salesOrder.dueDate = dueDate ? new Date(dueDate) : null;
    salesOrder.contactName = contactName;
    salesOrder.exciseDuty = parseFloat(exciseDuty) || 0;
    salesOrder.status = status;
    salesOrder.billingAddress = billingAddress || {};
    salesOrder.shippingAddress = shippingAddress || {};
    salesOrder.items = items.map(item => ({
      productName: item.productName,
      quantity: parseFloat(item.quantity) || 0,
      listPrice: parseFloat(item.listPrice) || 0,
      amount: parseFloat(item.amount) || 0,
      discount: parseFloat(item.discount) || 0,
      tax: parseFloat(item.tax) || 0,
      total: parseFloat(item.total) || 0,
      description: item.description
    }));
    salesOrder.subTotal = subTotal;
    salesOrder.totalDiscount = totalDiscount;
    salesOrder.totalTax = totalTax;
    salesOrder.grandTotal = grandTotal;
    salesOrder.termsAndConditions = termsAndConditions;
    salesOrder.description = description;

    await salesOrder.save();
    await salesOrder.populate('createdBy', 'name email');

    console.log('✅ Sales order updated successfully:', salesOrder._id);

    res.json({
      success: true,
      message: 'Sales order updated successfully',
      salesOrder
    });

  } catch (error) {
    console.error('🚨 Update sales order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during sales order update'
    });
  }
});

// Delete Sales Order
app.delete('/api/sales-orders/:id', authMiddleware, async (req, res) => {
  try {
    const salesOrder = await SalesOrder.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!salesOrder) {
      return res.status(404).json({
        success: false,
        message: 'Sales order not found'
      });
    }

    console.log('🗑️ Sales order deleted successfully:', req.params.id);

    res.json({
      success: true,
      message: 'Sales order deleted successfully'
    });

  } catch (error) {
    console.error('🚨 Delete sales order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during sales order deletion'
    });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Using MongoDB: ${MONGODB_URI}`);
  console.log(
    `🔑 JWT Secret: ${process.env.JWT_SECRET ? "Set" : "Using fallback"}`
  );
  console.log(`🌐 Allowing requests from: http://localhost:3000`);
});
