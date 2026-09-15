/**
 * Crypto Compass — Achievement Controller (Phase 21)
 *
 * Handles HTTP requests for long-term achievements and progression.
 * Invariants:
 * - getProgress is strictly READ-ONLY.
 * - postEvaluate performs atomic evaluation and awards XP once.
 */

const {
  getAchievementCatalog,
  getUserAchievementProgress,
  evaluateAchievements,
} = require('../services/achievementService');

/**
 * GET /api/achievements/catalog
 * Returns static list of all active achievements
 */
async function getCatalog(req, res, next) {
  try {
    const achievements = getAchievementCatalog();
    return res.status(200).json({
      success: true,
      data: {
        achievements,
        total: achievements.length,
      },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/achievements/progress
 * Strictly READ-ONLY: Returns current achievement progression without mutating DB
 */
async function getProgress(req, res, next) {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication is required to view achievement progress.',
        },
      });
    }

    const progress = await getUserAchievementProgress(userId);
    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/achievements/evaluate
 * MUTATING & ATOMIC: Server-authoritatively evaluates database state and unlocks eligible achievements
 */
async function postEvaluate(req, res, next) {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication is required to evaluate achievements.',
        },
      });
    }

    const result = await evaluateAchievements(userId);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getCatalog,
  getProgress,
  postEvaluate,
};
