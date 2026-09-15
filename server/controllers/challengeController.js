/**
 * Crypto Compass — Challenge Controller (Phase 20)
 *
 * Handles HTTP requests for educational challenges and progression.
 */

const {
  getChallengeCatalog,
  getUserChallengeProgress,
  claimChallenge,
} = require('../services/challengeService');

/**
 * GET /api/challenges/catalog
 * Returns static list of all active challenges
 */
async function getCatalog(req, res, next) {
  try {
    const challenges = getChallengeCatalog();
    return res.status(200).json({
      success: true,
      data: {
        challenges,
        total: challenges.length,
      },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/challenges/progress
 * Returns user's challenge progress, completed list, and eligibility
 */
async function getProgress(req, res, next) {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication is required to view challenge progress.',
        },
      });
    }

    const progress = await getUserChallengeProgress(userId);
    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/challenges/:challengeId/claim
 * Server-authoritatively validates requirements and awards XP
 */
async function postClaimChallenge(req, res, next) {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication is required to claim a challenge.',
        },
      });
    }

    const { challengeId } = req.params;
    const result = await claimChallenge(userId, challengeId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    if (err.code === 'REQUIREMENT_NOT_MET') {
      return res.status(400).json({
        success: false,
        error: {
          code: err.code,
          message: err.message,
          details: err.details,
        },
      });
    }
    if (err.code === 'INVALID_CHALLENGE_ID') {
      return res.status(404).json({
        success: false,
        error: {
          code: err.code,
          message: err.message,
        },
      });
    }
    return next(err);
  }
}

module.exports = {
  getCatalog,
  getProgress,
  postClaimChallenge,
};
