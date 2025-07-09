const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // Check for JWT_SECRET
  if (!process.env.JWT_SECRET) {
    console.error('CRITICAL ERROR: JWT_SECRET environment variable is not set!');
    return res.status(500).json({ 
      message: 'Server configuration error: JWT_SECRET is not set',
      details: 'Contact administrator - environment variables are not properly configured'
    });
  }

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      // Check if user exists
      if (!req.user) {
        console.error(`User not found for token ID: ${decoded.id}`);
        return res.status(401).json({ 
          message: 'Not authorized, user not found',
          action: 'logout',
          details: 'User account may have been deleted'
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.name, '-', error.message);
      
      // Handle specific JWT errors
      if (error.name === 'JsonWebTokenError') {
        if (error.message === 'invalid signature') {
          return res.status(401).json({ 
            message: 'Authentication failed: Token signature invalid',
            action: 'logout',
            details: 'Please try logging in again'
          });
        } else if (error.message === 'jwt malformed') {
          return res.status(401).json({ 
            message: 'Authentication failed: Invalid token format',
            action: 'logout',
            details: 'Please try clearing browser cache and logging in again'
          });
        }
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Authentication failed: Token has expired',
          action: 'logout',
          details: 'Your session has expired, please log in again'
        });
      }
      
      return res.status(401).json({ 
        message: 'Not authorized, token validation failed',
        action: 'logout',
        details: 'Please try logging in again'
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      message: 'Not authorized, no token',
      details: 'Please log in to access this resource'
    });
  }
};

// Admin only middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

// Business only middleware
const business = (req, res, next) => {
  if (req.user && (req.user.role === 'business' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as a business' });
  }
};

module.exports = { protect, admin, business }; 