const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/cloudcrm';

// Fix MongoDB connection options
mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// User Schema (for MongoDB)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Add password comparison method to the schema
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

const User = mongoose.model('User', userSchema);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('📝 Registration attempt:', { name, email });

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    // Return user data (without password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    console.log('✅ User registered successfully:', userResponse.email);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('🚨 Registration error:', error);
    
    // Handle duplicate key error (in case unique constraint fails)
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration' 
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt:', { email });

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    console.log('👤 Found user:', user ? user.email : 'No user found');

    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check password using the schema method
    const isPasswordValid = await user.comparePassword(password);
    console.log('🔑 Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', user.email);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    // Return user data (without password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    console.log('✅ Login successful for:', userResponse.email);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('🚨 Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
});

// Debug endpoint to get all users
app.get('/api/auth/debug/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email createdAt').sort({ createdAt: -1 });
    console.log('📋 Found users:', users.length);
    
    // Log each user for debugging
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.name})`);
    });
    
    res.json(users);
  } catch (error) {
    console.error('Debug users error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching users' 
    });
  }
});

// Get current user profile
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true,
      user 
    });
  } catch (error) {
    console.error('Get me error:', error);
    
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
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
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
  console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Using fallback'}`);
});