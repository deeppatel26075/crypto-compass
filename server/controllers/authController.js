const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const VirtualAccess = require('../models/VirtualAccess');
const walletService = require('../services/walletService');
const accessService = require('../services/accessService');
const { VIRTUAL_ACCESS_PRICE_PAISE, ACCESS_STATUS } = require('../constants/access');
const { generateToken, setAuthCookie, clearAuthCookie } = require('../utils/jwt');

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

/**
 * Validate password requirements:
 * At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
const validatePasswordComplexity = (password) => {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 8) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasUpper && hasLower && hasNumber;
};

/**
 * Register a new user account
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Field validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full name must be at least 2 characters long.',
      });
    }

    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (!validatePasswordComplexity(password)) {
      return res.status(400).json({
        success: false,
        message:
          'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.',
      });
    }

    // 2. Check database connectivity
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message:
          'Database service is currently unavailable. Please verify MongoDB is running or configure MONGODB_URI.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 3. Check for existing user
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in instead.',
      });
    }

    // 4. Hash password with bcryptjs
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // 5. Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    // 6. Initialize Virtual Access Record (LOCKED by default, requires coupon CRYPTO100 on /access)
    try {
      await VirtualAccess.create({
        user: user._id,
        status: ACCESS_STATUS.LOCKED,
        pricePaise: VIRTUAL_ACCESS_PRICE_PAISE,
        discountPaise: 0,
        finalAmountPaise: VIRTUAL_ACCESS_PRICE_PAISE,
        couponCode: null,
        unlockSource: null,
      });
    } catch (accessError) {
      // Safe rollback: delete the newly created user if access record initialization fails
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        success: false,
        message: 'Could not initialize your virtual account access. Please try again.',
      });
    }

    // 7. Generate JWT and set HttpOnly cookie
    const token = generateToken(user._id);
    setAuthCookie(res, token);

    // 8. Return safe user info with access details
    const safeUser = user.toSafeJSON();
    safeUser.access = await accessService.checkAccess(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Log in existing user
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email address and password.',
      });
    }

    // 2. Check database connectivity
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message:
          'Database service is currently unavailable. Please verify MongoDB is running or configure MONGODB_URI.',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // 3. Find user and explicitly select passwordHash (since select: false)
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
      });
    }

    // 4. Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
      });
    }

    // 5. Generate JWT & set HttpOnly cookie
    const token = generateToken(user._id);
    setAuthCookie(res, token);

    // 6. Return safe user info with access status
    const safeUser = user.toSafeJSON();
    safeUser.access = await accessService.checkAccess(user._id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
const me = async (req, res, next) => {
  try {
    // req.user was attached by requireAuth middleware
    const safeUser = req.user.toSafeJSON();
    safeUser.access = await accessService.checkAccess(req.user._id);

    return res.status(200).json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Log out user by clearing HttpOnly auth cookie
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  clearAuthCookie(res);
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

module.exports = {
  register,
  login,
  me,
  logout,
};
