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

  // Enhanced JWT_SECRET validation - avoid common issues with empty strings or malformed secrets
  if (process.env.JWT_SECRET.trim() === '') {
    console.error('CRITICAL ERROR: JWT_SECRET environment variable is empty!');
    return res.status(500).json({ 
      message: 'Server configuration error: JWT_SECRET is empty',
      details: 'Contact administrator - JWT_SECRET must not be an empty string'
    });
  }

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Check for empty token
      if (!token || token.trim() === '') {
        return res.status(401).json({ 
          message: 'Not authorized, empty token provided',
          details: 'Please log in again with valid credentials'
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if decoded id exists
      if (!decoded.id) {
        return res.status(401).json({
          message: 'Invalid token format - missing user identifier',
          action: 'logout',
          details: 'Please log in again'
        });
      }

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
        } else if (error.message.includes('Unexpected token')) {
          return res.status(401).json({
            message: 'Authentication failed: Malformed token',
            action: 'logout',
            details: 'Please clear browser data and log in again'
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
        details: `Error: ${error.name} - Please try logging in again`
      });
    }
  } else if (req.headers.authorization) {
    // Authorization header exists but in wrong format
    return res.status(401).json({
      message: 'Invalid authorization format',
      details: 'Authorization header must start with "Bearer"'
    });
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