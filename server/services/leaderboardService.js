/**
 * Crypto Compass — Leaderboard Service (Phase 20)
 *
 * Deterministic educational leaderboard based on legitimate progression.
 * Invariants:
 * - Ranked strictly by Total XP (Quiz XP + Challenge XP)
 * - Deterministic tie-breakers: challengesCount DESC, lessonsCount DESC, _id ASC
 * - Zero ranking by portfolio value, P&L, simulated wealth, or win rates
 * - Zero fabricated level calculations
 * - Strict privacy: NO emails, wallet balances, trades, or holdings exposed
 */

const mongoose = require('mongoose');
const User = require('../models/User');

/**
 * Retrieves the global educational leaderboard and the calling user's exact rank.
 *
 * @param {Object} options
 * @param {string|mongoose.Types.ObjectId} options.currentUserId
 * @param {number} [options.limit=50]
 */
async function getLeaderboard({ currentUserId, limit = 50 } = {}) {
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
  const currentObjId = currentUserId ? new mongoose.Types.ObjectId(currentUserId) : null;

  // 1. Efficient aggregation pipeline across progression collections
  const pipeline = [
    {
      $match: {
        // Only include users who completed onboarding or all registered users
        'onboarding.completed': true,
      },
    },
    // Join QuizProgress
    {
      $lookup: {
        from: 'quizprogresses',
        localField: '_id',
        foreignField: 'user',
        as: 'quizProgress',
      },
    },
    {
      $unwind: {
        path: '$quizProgress',
        preserveNullAndEmptyArrays: true,
      },
    },
    // Join ChallengeProgress
    {
      $lookup: {
        from: 'challengeprogresses',
        localField: '_id',
        foreignField: 'user',
        as: 'challengeProgress',
      },
    },
    {
      $unwind: {
        path: '$challengeProgress',
        preserveNullAndEmptyArrays: true,
      },
    },
    // Join LearningProgress
    {
      $lookup: {
        from: 'learningprogresses',
        localField: '_id',
        foreignField: 'user',
        as: 'learningProgress',
      },
    },
    {
      $unwind: {
        path: '$learningProgress',
        preserveNullAndEmptyArrays: true,
      },
    },
    // Join AchievementProgress (Phase 21)
    {
      $lookup: {
        from: 'achievementprogresses',
        localField: '_id',
        foreignField: 'user',
        as: 'achievementProgress',
      },
    },
    {
      $unwind: {
        path: '$achievementProgress',
        preserveNullAndEmptyArrays: true,
      },
    },
    // Project and calculate safe metrics
    {
      $project: {
        _id: 1,
        name: 1,
        quizXp: { $ifNull: ['$quizProgress.totalXp', 0] },
        challengeXp: { $ifNull: ['$challengeProgress.totalChallengeXp', 0] },
        achievementXp: { $ifNull: ['$achievementProgress.totalAchievementXp', 0] },
        quizzesCount: {
          $size: { $ifNull: ['$quizProgress.completedQuizzes', []] },
        },
        challengesCount: {
          $size: { $ifNull: ['$challengeProgress.completedChallenges', []] },
        },
        lessonsCount: {
          $size: { $ifNull: ['$learningProgress.completedLessons', []] },
        },
        achievementsCount: {
          $size: { $ifNull: ['$achievementProgress.unlockedAchievements', []] },
        },
      },
    },
    {
      $addFields: {
        totalXp: { $add: ['$quizXp', '$challengeXp', '$achievementXp'] },
      },
    },
    // Deterministic ordering: Total XP DESC, challengesCount DESC, lessonsCount DESC, _id ASC
    {
      $sort: {
        totalXp: -1,
        challengesCount: -1,
        lessonsCount: -1,
        _id: 1,
      },
    },
  ];

  const allRankedUsers = await User.aggregate(pipeline);

  let currentUserStats = null;
  let currentUserRank = null;

  // 2. Assign deterministic 1-based ranks and map safe public payloads
  const formattedLeaderboard = [];

  for (let i = 0; i < allRankedUsers.length; i++) {
    const entry = allRankedUsers[i];
    const rank = i + 1;
    const isCurrentUser = currentObjId && entry._id.equals(currentObjId);

    const safeItem = {
      rank,
      userId: entry._id.toString(),
      displayName: entry.name,
      totalXp: entry.totalXp,
      quizXp: entry.quizXp,
      challengeXp: entry.challengeXp,
      achievementXp: entry.achievementXp,
      challengesCount: entry.challengesCount,
      lessonsCount: entry.lessonsCount,
      quizzesCount: entry.quizzesCount,
      achievementsCount: entry.achievementsCount,
      isCurrentUser: Boolean(isCurrentUser),
    };

    if (isCurrentUser) {
      currentUserRank = rank;
      currentUserStats = safeItem;
    }

    if (i < parsedLimit) {
      formattedLeaderboard.push(safeItem);
    }
  }

  // If current user has not completed onboarding or has no entries yet
  if (currentObjId && !currentUserStats) {
    const callingUser = await User.findById(currentObjId).lean();
    if (callingUser) {
      currentUserStats = {
        rank: allRankedUsers.length + 1,
        userId: callingUser._id.toString(),
        displayName: callingUser.name,
        totalXp: 0,
        quizXp: 0,
        challengeXp: 0,
        challengesCount: 0,
        lessonsCount: 0,
        quizzesCount: 0,
        isCurrentUser: true,
      };
    }
  }

  return {
    leaderboard: formattedLeaderboard,
    totalParticipants: allRankedUsers.length,
    currentUser: currentUserStats,
  };
}

module.exports = {
  getLeaderboard,
};
