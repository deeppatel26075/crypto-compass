const analysisService = require('../services/analysisService');

/**
 * Crypto Compass — Mistake Analyzer Controller (Phase 17)
 *
 * GET /api/analysis/summary
 * Returns educational behavioral observations and factual metrics derived
 * deterministically from the authenticated user's historical trades.
 */
async function getAnalysisSummary(req, res, next) {
  try {
    // Strictly derive user identity from the verified JWT context
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required to access trade analysis.',
        code: 'UNAUTHENTICATED',
      });
    }

    const data = await analysisService.getUserTradeAnalysis(userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({
        success: false,
        error: err.message,
        code: err.code || 'ANALYSIS_ERROR',
      });
    }
    next(err);
  }
}

/**
 * Crypto Compass — Advanced Behavioral Analytics Controller (Phase 23)
 *
 * GET /api/analysis/behavior
 * Returns detailed factual historical behavioral analytics.
 */
async function getBehavioralAnalytics(req, res, next) {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required to access behavioral analytics.',
        code: 'UNAUTHENTICATED',
      });
    }

    const data = await analysisService.getUserBehavioralAnalytics(userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({
        success: false,
        error: err.message,
        code: err.code || 'ANALYSIS_ERROR',
      });
    }
    next(err);
  }
}

module.exports = {
  getAnalysisSummary,
  getBehavioralAnalytics,
};
