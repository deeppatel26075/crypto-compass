const mongoose = require('mongoose');
const User = require('../models/User');
const { verifyToken, clearAuthCookie } = require('../utils/jwt');

/**
 * Authentication middleware: ensures the incoming request has a valid JWT in an HttpOnly cookie.
 */
const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to continue.',
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      clearAuthCookie(res);
      return res.status(401).json({
        success: false,
        message: 'Session has expired or is invalid. Please log in again.',
      });
    }

    // Verify database connectivity
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database service is currently unavailable. Please verify MongoDB is running.',
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      clearAuthCookie(res);
      return res.status(401).json({
        success: false,
        message: 'User account associated with this session no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = requireAuth;
