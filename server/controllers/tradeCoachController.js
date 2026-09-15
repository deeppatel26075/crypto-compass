const tradeCoachService = require('../services/tradeCoachService');

/**
 * Crypto Compass — Trade Coach Controller (Phase 10)
 *
 * Exposes server-authoritative, read-only educational analysis for proposed paper trades.
 */

/**
 * Analyze a proposed trade
 * POST /api/trade-coach/analyze
 */
async function analyzeTrade(req, res, next) {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const { symbol, side, quantity } = req.body || {};

    const analysis = await tradeCoachService.analyzeProposedTrade(userId, {
      symbol,
      side,
      quantity,
    });

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({
        success: false,
        message: err.message,
        code: err.code,
      });
    }
    next(err);
  }
}

module.exports = {
  analyzeTrade,
};
