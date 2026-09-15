/**
 * Crypto Compass — Portfolio Controller (Phase 11)
 *
 * Exposes authenticated endpoints for reading user's simulated portfolio composition.
 * Discards any client-supplied user identity or price manipulation parameters.
 */

const portfolioService = require('../services/portfolioService');

/**
 * GET /api/portfolio
 * Returns authenticated user's portfolio composition.
 */
async function getPortfolio(req, res, next) {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required to view portfolio.',
        code: 'UNAUTHORIZED',
      });
    }

    // Call server-authoritative portfolio service
    const portfolioData = await portfolioService.getPortfolio(userId);

    return res.status(200).json({
      success: true,
      data: portfolioData,
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({
        success: false,
        error: err.message,
        code: err.code || 'PORTFOLIO_ERROR',
      });
    }
    next(err);
  }
}

module.exports = {
  getPortfolio,
};
