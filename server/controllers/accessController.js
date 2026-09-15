const accessService = require('../services/accessService');

/**
 * GET /api/access/status
 * Fetches current virtual access entitlement and pricing breakdown for the authenticated user.
 * Strictly read-only; zero database writes.
 */
const getStatus = async (req, res, next) => {
  try {
    const access = await accessService.checkAccess(req.user._id);
    return res.status(200).json({
      success: true,
      data: access,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/access/redeem
 * Validates promo coupon (CRYPTO100), unlocks virtual access, and provisions initial virtual wallet.
 * Resilient, sequential, and idempotent.
 */
const redeem = async (req, res, next) => {
  try {
    const { couponCode } = req.body;
    const access = await accessService.redeemAndUnlock(req.user._id, couponCode);
    return res.status(200).json({
      success: true,
      message: 'Virtual access unlocked successfully.',
      data: access,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStatus,
  redeem,
};
