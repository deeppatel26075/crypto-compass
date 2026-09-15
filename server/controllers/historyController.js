/**
 * Crypto Compass — Trading History Controller (Phase 12)
 *
 * Exposes server-authoritative, read-only endpoints for viewing executed simulated paper trades.
 * User identity is strictly derived from req.user._id authenticated session.
 */

const historyService = require('../services/historyService');

/**
 * GET /api/history
 * Returns paginated, filtered trade history for authenticated user.
 */
async function getTrades(req, res, next) {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required to view trading history.',
        code: 'UNAUTHORIZED',
      });
    }

    const { page, limit, side, symbol, sortBy } = req.query || {};

    const historyData = await historyService.getUserTradeHistory(userId, {
      page,
      limit,
      side,
      symbol,
      sortBy,
    });

    return res.status(200).json({
      success: true,
      data: historyData,
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({
        success: false,
        error: err.message,
        code: err.code || 'HISTORY_ERROR',
      });
    }
    next(err);
  }
}

module.exports = {
  getTrades,
};
