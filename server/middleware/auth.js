const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Use consistent JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_only';

const authMiddleware = async (req, res, next) => {
  try {
    console.log('\n🔐 ===== AUTH MIDDLEWARE START =====');
    console.log('📝 Request to:', req.originalUrl);
    console.log('📝 Method:', req.method);
    console.log('📝 Full URL:', req.protocol + '://' + req.get('host') + req.originalUrl);
    
    const authHeader = req.header('Authorization');
    console.log('🔑 Authorization Header:', authHeader ? authHeader.substring(0, 50) + '...' : 'NOT FOUND');
    
    // Check for token in cookies as fallback
    const tokenFromCookie = req.cookies?.token || req.cookies?.jwt;
    console.log('🍪 Token from cookies:', tokenFromCookie ? 'Found' : 'Not found');
    
    if (!authHeader && !tokenFromCookie) {
      console.log('❌ No Authorization header or cookie found');
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required. Please login.',
        code: 'NO_TOKEN'
      });
    }
    
    // Get token from header or cookie
    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '');
      console.log('🔑 Token from Authorization header');
    } else if (tokenFromCookie) {
      token = tokenFromCookie;
      console.log('🔑 Token from cookie');
    } else {
      console.log('❌ Invalid Authorization format or empty token');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid Authorization format. Use: Bearer <token>',
        code: 'INVALID_FORMAT'
      });
    }
    
    console.log('🔑 Token length:', token.length);
    console.log('🔑 Token first 30 chars:', token.substring(0, 30) + '...');
    
    // Validate token
    if (!token || token === 'null' || token === 'undefined' || token === 'Bearer') {
      console.log('❌ Token is empty or invalid');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token',
        code: 'EMPTY_TOKEN'
      });
    }

    console.log('🔐 JWT_SECRET from env:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
    console.log('🔐 Using JWT_SECRET:', JWT_SECRET.substring(0, 5) + '***');
    
    // Decode without verification to inspect
    try {
      const decodedWithoutVerify = jwt.decode(token);
      console.log('🔍 Token payload (decoded):', {
        userId: decodedWithoutVerify?.userId,
        iat: decodedWithoutVerify?.iat,
        exp: decodedWithoutVerify?.exp,
        email: decodedWithoutVerify?.email
      });
      
      if (!decodedWithoutVerify?.userId) {
        console.log('❌ Token missing userId');
        return res.status(401).json({ 
          success: false,
          message: 'Invalid token structure',
          code: 'INVALID_TOKEN_STRUCTURE'
        });
      }
    } catch (decodeError) {
      console.log('❌ Could not decode token:', decodeError.message);
    }
    
    // Verify token
    console.log('🔑 Verifying token...');
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('✅ Token verified successfully!');
    } catch (verifyError) {
      console.error('❌ Token verification failed:', verifyError.name, '-', verifyError.message);
      
      if (verifyError.name === 'TokenExpiredError') {
        console.error('❌ Token expired at:', new Date(verifyError.expiredAt).toISOString());
        return res.status(401).json({ 
          success: false,
          message: 'Session expired. Please login again.',
          code: 'TOKEN_EXPIRED',
          expiredAt: verifyError.expiredAt
        });
      }
      
      if (verifyError.name === 'JsonWebTokenError') {
        console.error('❌ JWT Error:', verifyError.message);
        return res.status(401).json({ 
          success: false,
          message: 'Invalid token signature',
          code: 'INVALID_SIGNATURE'
        });
      }
      
      throw verifyError;
    }
    
    console.log('👤 User ID from token:', decoded.userId);
    console.log('📅 Token issued at:', new Date(decoded.iat * 1000).toISOString());
    console.log('📅 Token expires at:', decoded.exp ? new Date(decoded.exp * 1000).toISOString() : 'No expiration');
    
    // Fetch user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('❌ User not found in database for ID:', decoded.userId);
      return res.status(401).json({ 
        success: false,
        message: 'User account not found or has been deleted',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if user is active
    if (user.status && user.status !== 'active') {
      console.log('❌ User account is not active:', user.status);
      return res.status(401).json({ 
        success: false,
        message: 'Your account is not active. Please contact support.',
        code: 'ACCOUNT_INACTIVE',
        status: user.status
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = decoded.userId;
    req.token = token;
    
    console.log('✅ User authenticated:', {
      email: user.email,
      id: user._id,
      role: user.role || 'user'
    });
    console.log('===== AUTH MIDDLEWARE END =====\n');
    next();
  } catch (error) {
    console.error('\n❌ ===== AUTH MIDDLEWARE ERROR =====');
    console.error('❌ Error type:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Stack trace:', error.stack);
    
    // Handle specific error types
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid authentication token',
        code: 'JWT_ERROR',
        details: error.message
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Your session has expired',
        code: 'SESSION_EXPIRED'
      });
    }
    
    // Database or other errors
    console.error('❌ Unexpected error in auth middleware:', error);
    res.status(500).json({ 
      success: false,
      message: 'Authentication server error',
      code: 'SERVER_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = authMiddleware;