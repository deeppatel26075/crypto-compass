const requireAuth = require('./requireAuth');
const accessService = require('../services/accessService');

/**
 * Entitlement middleware: verifies that the incoming request is authenticated
 * and the user has unlocked virtual trading access.
 * Automatically runs requireAuth first if req.user is not yet populated.
 */
const requireAccess = async (req, res, next) => {
  // If req.user is not present, authenticate first
  if (!req.user) {
    return requireAuth(req, res, async (authErr) => {
      if (authErr) return next(authErr);
      return evaluateAccess(req, res, next);
    });
  }

  return evaluateAccess(req, res, next);
};

const evaluateAccess = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to continue.',
      });
    }

    const access = await accessService.checkAccess(req.user._id);

    if (!access || !access.unlocked) {
      return res.status(403).json({
        success: false,
        code: 'ACCESS_LOCKED',
        message: 'Virtual trading access required. Please claim your virtual access pass.',
      });
    }

    req.access = access;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = requireAccess;
