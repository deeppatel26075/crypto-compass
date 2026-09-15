/**
 * Crypto Compass — Achievement Service (Phase 21)
 *
 * Deterministic long-term achievement recognition.
 * Invariants:
 * - GET /progress is strictly READ-ONLY (never mutates the database).
 * - POST /evaluate is MUTATING & ATOMIC (evaluates real data, awards XP once).
 * - Total XP = Quiz XP + Challenge XP + Achievement XP.
 * - Zero fabricated level calculations.
 * - Full-position exit verified using exact 8-decimal crypto base units.
 */

const { ACHIEVEMENTS } = require('../constants/achievements');
const AchievementProgress = require('../models/AchievementProgress');
const QuizProgress = require('../models/QuizProgress');
const LearningProgress = require('../models/LearningProgress');
const ScenarioProgress = require('../models/ScenarioProgress');
const ChallengeProgress = require('../models/ChallengeProgress');
const Trade = require('../models/Trade');
const { parseCryptoToUnits } = require('../utils/decimalMath');

/**
 * Returns static deterministic achievement catalog
 */
function getAchievementCatalog() {
  return ACHIEVEMENTS.filter((a) => a.active !== false);
}

/**
 * Helper: Check if user has executed at least one full-position exit trade
 * Uses exact 8-decimal crypto base units / BigInt
 */
async function checkFullPositionExit(userId) {
  // 1. Direct check on persisted isFullPositionExit flag
  const directExit = await Trade.findOne({
    user: userId,
    side: 'SELL',
    status: 'EXECUTED',
    isFullPositionExit: true,
  }).lean();

  if (directExit) return true;

  // 2. Historical chronological replay per asset using exact BigInt units
  const allTrades = await Trade.find({ user: userId, status: 'EXECUTED' })
    .sort({ executedAt: 1, _id: 1 })
    .lean();

  if (!allTrades || allTrades.length === 0) return false;

  const assetBalances = new Map(); // symbol -> BigInt units

  for (const t of allTrades) {
    const sym = t.symbol.toUpperCase();
    const qtyUnits = parseCryptoToUnits(t.quantity);
    const currentUnits = assetBalances.get(sym) || 0n;

    if (t.side === 'BUY') {
      assetBalances.set(sym, currentUnits + qtyUnits);
    } else if (t.side === 'SELL') {
      // If sold entire held quantity (or more, rounding-safe), it's a full-position exit
      if (currentUnits > 0n && qtyUnits >= currentUnits) {
        return true;
      }
      const rem = currentUnits > qtyUnits ? currentUnits - qtyUnits : 0n;
      assetBalances.set(sym, rem);
    }
  }

  return false;
}

/**
 * READ-ONLY: Retrieves user's achievement progress without mutating database
 *
 * @param {string|Object} userId
 */
async function getUserAchievementProgress(userId) {
  if (!userId) {
    const err = new Error('User ID is required.');
    err.status = 401;
    throw err;
  }

  const [
    achievementProgress,
    quizProgress,
    challengeProgress,
    learningProgress,
    scenarioProgress,
    tradesCount,
    hasFullExit,
  ] = await Promise.all([
    AchievementProgress.findOne({ user: userId }).lean(),
    QuizProgress.findOne({ user: userId }).lean(),
    ChallengeProgress.findOne({ user: userId }).lean(),
    LearningProgress.findOne({ user: userId }).lean(),
    ScenarioProgress.findOne({ user: userId }).lean(),
    Trade.countDocuments({ user: userId, status: 'EXECUTED' }),
    checkFullPositionExit(userId),
  ]);

  const unlockedMap = new Map();
  (achievementProgress?.unlockedAchievements || []).forEach((item) => {
    unlockedMap.set(item.achievementId, item.unlockedAt);
  });

  const completedLessonsCount = (learningProgress?.completedLessons || []).length;
  const passedQuizzesCount = (quizProgress?.completedQuizzes || []).length;
  const completedScenariosCount = (scenarioProgress?.completedScenarios || []).length;
  const claimedChallengesCount = (challengeProgress?.completedChallenges || []).length;

  const quizXp = quizProgress?.totalXp || 0;
  const challengeXp = challengeProgress?.totalChallengeXp || 0;
  const achievementXp = achievementProgress?.totalAchievementXp || 0;
  const totalXp = quizXp + challengeXp + achievementXp;

  const evaluatedAchievements = ACHIEVEMENTS.map((ach) => {
    const isUnlocked = unlockedMap.has(ach.achievementId);
    let currentValue = 0;
    let targetValue = ach.requirement.target || 1;

    switch (ach.requirement.type) {
      case 'LESSON_COUNT':
        currentValue = completedLessonsCount;
        break;
      case 'QUIZ_PASS_COUNT':
        currentValue = passedQuizzesCount;
        break;
      case 'SCENARIO_COUNT':
        currentValue = completedScenariosCount;
        break;
      case 'TRADE_COUNT':
        currentValue = tradesCount;
        break;
      case 'CHALLENGE_COUNT':
        currentValue = claimedChallengesCount;
        break;
      case 'FULL_POSITION_EXIT':
        currentValue = hasFullExit ? 1 : 0;
        targetValue = 1;
        break;
      default:
        currentValue = 0;
        break;
    }

    return {
      achievementId: ach.achievementId,
      title: ach.title,
      description: ach.description,
      category: ach.category,
      rewardXp: ach.rewardXp,
      requirement: ach.requirement,
      isUnlocked,
      unlockedAt: unlockedMap.get(ach.achievementId) || null,
      currentValue,
      targetValue,
      progressPercent: Math.min(100, Math.round((currentValue / targetValue) * 100)),
    };
  });

  return {
    achievements: evaluatedAchievements,
    unlockedAchievements: achievementProgress?.unlockedAchievements || [],
    unlockedCount: unlockedMap.size,
    totalCount: ACHIEVEMENTS.length,
    totalXp,
    quizXp,
    challengeXp,
    achievementXp,
    metrics: {
      completedLessonsCount,
      passedQuizzesCount,
      completedScenariosCount,
      claimedChallengesCount,
      executedTradesCount: tradesCount,
      hasFullPositionExit: hasFullExit,
    },
    lastUpdatedAt: achievementProgress?.lastUpdatedAt || null,
  };
}

/**
 * MUTATING & ATOMIC: Evaluates verified database state and unlocks eligible achievements
 * Awards achievement XP strictly once per achievement ID.
 *
 * @param {string|Object} userId
 */
async function evaluateAchievements(userId) {
  if (!userId) {
    const err = new Error('User ID is required.');
    err.status = 401;
    throw err;
  }

  // 1. Gather all verified application records in parallel
  const [
    learningProgress,
    quizProgress,
    scenarioProgress,
    challengeProgress,
    tradesCount,
    hasFullExit,
  ] = await Promise.all([
    LearningProgress.findOne({ user: userId }).lean(),
    QuizProgress.findOne({ user: userId }).lean(),
    ScenarioProgress.findOne({ user: userId }).lean(),
    ChallengeProgress.findOne({ user: userId }).lean(),
    Trade.countDocuments({ user: userId, status: 'EXECUTED' }),
    checkFullPositionExit(userId),
  ]);

  const completedLessons = (learningProgress?.completedLessons || []).length;
  const passedQuizzes = (quizProgress?.completedQuizzes || []).length;
  const completedScenarios = (scenarioProgress?.completedScenarios || []).length;
  const claimedChallenges = (challengeProgress?.completedChallenges || []).length;

  // 2. Ensure progress document exists (with E11000 concurrency guard)
  let progressDoc = await AchievementProgress.findOne({ user: userId });
  if (!progressDoc) {
    try {
      progressDoc = await AchievementProgress.create({
        user: userId,
        unlockedAchievements: [],
        totalAchievementXp: 0,
      });
    } catch (createErr) {
      if (createErr.code === 11000) {
        progressDoc = await AchievementProgress.findOne({ user: userId });
      } else {
        throw createErr;
      }
    }
  }

  const existingUnlockedSet = new Set(
    (progressDoc?.unlockedAchievements || []).map((a) => a.achievementId)
  );

  // 3. Determine newly eligible achievements
  const newlyEligible = [];

  for (const ach of ACHIEVEMENTS) {
    if (existingUnlockedSet.has(ach.achievementId) || ach.active === false) {
      continue;
    }

    let isEligible = false;
    switch (ach.requirement.type) {
      case 'LESSON_COUNT':
        isEligible = completedLessons >= ach.requirement.target;
        break;
      case 'QUIZ_PASS_COUNT':
        isEligible = passedQuizzes >= ach.requirement.target;
        break;
      case 'SCENARIO_COUNT':
        isEligible = completedScenarios >= ach.requirement.target;
        break;
      case 'TRADE_COUNT':
        isEligible = tradesCount >= ach.requirement.target;
        break;
      case 'CHALLENGE_COUNT':
        isEligible = claimedChallenges >= ach.requirement.target;
        break;
      case 'FULL_POSITION_EXIT':
        isEligible = Boolean(hasFullExit);
        break;
      default:
        isEligible = false;
        break;
    }

    if (isEligible) {
      newlyEligible.push(ach);
    }
  }

  // 4. Atomically unlock each eligible achievement with condition { 'unlockedAchievements.achievementId': { $ne: achId } }
  // This guarantees that concurrent evaluation requests cannot double-award XP
  const newlyUnlockedRecords = [];

  for (const ach of newlyEligible) {
    const unlockTime = new Date();
    const updated = await AchievementProgress.findOneAndUpdate(
      {
        user: userId,
        'unlockedAchievements.achievementId': { $ne: ach.achievementId },
      },
      {
        $push: {
          unlockedAchievements: {
            achievementId: ach.achievementId,
            unlockedAt: unlockTime,
          },
        },
        $inc: { totalAchievementXp: ach.rewardXp },
        $set: { lastUpdatedAt: unlockTime },
      },
      { new: true }
    );

    if (updated) {
      newlyUnlockedRecords.push({
        achievementId: ach.achievementId,
        title: ach.title,
        rewardXp: ach.rewardXp,
        unlockedAt: unlockTime,
      });
    }
  }

  // 5. Fetch clean state and return updated progression
  const fullProgress = await getUserAchievementProgress(userId);

  return {
    ...fullProgress,
    newlyUnlocked: newlyUnlockedRecords,
    newlyUnlockedCount: newlyUnlockedRecords.length,
  };
}

module.exports = {
  getAchievementCatalog,
  getUserAchievementProgress,
  evaluateAchievements,
  checkFullPositionExit,
};
