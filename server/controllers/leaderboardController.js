/**
 * Crypto Compass — Leaderboard Controller (Phase 20)
 *
 * Handles HTTP requests for the educational leaderboard.
 */

const { getLeaderboard } = require('../services/leaderboardService');

/**
 * GET /api/leaderboard
 * Returns ranked leaderboard list and caller's exact rank
 */
async function getLeaderboardData(req, res, next) {
  try {
    const currentUserId = req.user?._id;
    const { limit } = req.query;

    const data = await getLeaderboard({
      currentUserId,
      limit: limit ? parseInt(limit, 10) : 50,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getLeaderboardData,
};
