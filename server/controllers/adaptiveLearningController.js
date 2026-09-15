/**
 * Crypto Compass — Adaptive Learning Controller (Phase 18)
 *
 * Handles HTTP requests for adaptive learning recommendations.
 *
 * Security & Data Invariants:
 * - Strictly server-authoritative authentication context (req.user._id).
 * - Ignores and strips any client-provided userId in query or body.
 * - Read-only operation: zero database writes, zero wallet/trade/XP mutations.
 */

const { getAdaptiveRecommendations } = require('../services/adaptiveLearningService');

/**
 * GET /api/learning/recommendations
 * Returns personalized deterministic educational recommendations.
 */
async function getRecommendations(req, res, next) {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Authentication is required to access adaptive learning recommendations.',
        },
      });
    }

    const data = await getAdaptiveRecommendations(userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    if (error.status && error.status < 500) {
      return res.status(error.status).json({
        success: false,
        error: {
          code: error.code || 'BAD_REQUEST',
          message: error.message,
        },
      });
    }
    return next(error);
  }
}

module.exports = {
  getRecommendations,
};
