// backend/middleware/authMiddleware.js
// Middleware to authenticate JWT tokens and verify user roles

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token from Authorization header
const authHandler = async (req, res, next) => {
  let token;

  // Check if Bearer token is provided in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // Extract token string after 'Bearer '
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret123');

      // Fetch user from DB and attach to req.user (excluding password)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists. Authorization denied.',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('JWT Verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please log in again.',
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'No authorization token provided. Access denied.',
    });
  }
};

// Role-based access control middleware
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not allowed to access this resource.`,
      });
    }

    next();
  };
};

module.exports = {
  authHandler,
  allowRoles,
};
