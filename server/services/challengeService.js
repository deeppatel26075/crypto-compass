/**
 * Crypto Compass — Challenge Service (Phase 20)
 *
 * Server-authoritative educational and practice challenge evaluation.
 * Invariants:
 * - Requirements are verified independently against actual database models
 * - Client cannot forge completion
 * - Each challenge awards XP exactly once
 * - Total XP = Quiz XP + Challenge XP
 * - Zero fabricated level calculations
 */

const { CHALLENGES } = require('../constants/challenges');
const ChallengeProgress = require('../models/ChallengeProgress');
const QuizProgress = require('../models/QuizProgress');
const LearningProgress = require('../models/LearningProgress');
const ScenarioProgress = require('../models/ScenarioProgress');
const AchievementProgress = require('../models/AchievementProgress');
const Trade = require('../models/Trade');
const { checkFullPositionExit } = require('./achievementService');

/**
 * Returns static deterministic challenge catalog
 */
function getChallengeCatalog() {
  return CHALLENGES.filter((c) => c.active !== false);
}

/**
 * Returns comprehensive challenge progress and evaluates current eligibility for all challenges
 *
 * @param {string|Object} userId
 */
async function getUserChallengeProgress(userId) {
  if (!userId) {
    const err = new Error('User ID is required.');
    err.status = 401;
    throw err;
  }

  // 1. Fetch user data across collections in parallel
  const [
    challengeProgress,
    quizProgress,
    learningProgress,
    scenarioProgress,
    executedTrades,
    hasFullExit,
    achievementProgress,
  ] = await Promise.all([
    ChallengeProgress.findOne({ user: userId }),
    QuizProgress.findOne({ user: userId }),
    LearningProgress.findOne({ user: userId }),
    ScenarioProgress.findOne({ user: userId }),
    Trade.find({ user: userId, status: 'EXECUTED' }).select('symbol side isFullPositionExit quantity executedAt').lean(),
    checkFullPositionExit(userId),
    AchievementProgress.findOne({ user: userId }),
  ]);

  const executedTradesList = executedTrades || [];
  const executedTradesCount = executedTradesList.length;

  const uniqueAssetsTraded = new Set(executedTradesList.map((t) => t.symbol.toUpperCase())).size;
  const buyTradesCount = executedTradesList.filter((t) => t.side === 'BUY').length;
  const sellTradesCount = executedTradesList.filter((t) => t.side === 'SELL').length;

  const completedChallengesSet = new Set(challengeProgress?.completedChallenges || []);
  const completedLessonsCount = (learningProgress?.completedLessons || []).length;
  const completedQuizzesCount = (quizProgress?.completedQuizzes || []).length;
  const completedScenariosCount = (scenarioProgress?.completedScenarios || []).length;

  const challengeXp = challengeProgress?.totalChallengeXp || 0;
  const quizXp = quizProgress?.totalXp || 0;
  const achievementXp = achievementProgress?.totalAchievementXp || 0;
  const totalXp = quizXp + challengeXp + achievementXp;

  // 2. Evaluate status and progression metrics for each challenge in catalog
  const evaluatedChallenges = CHALLENGES.map((ch) => {
    const isCompleted = completedChallengesSet.has(ch.challengeId);
    let currentValue = 0;
    let targetValue = 1;
    let requirementsMet = false;

    switch (ch.requirements.type) {
      case 'LESSON_COUNT':
        currentValue = completedLessonsCount;
        targetValue = ch.requirements.target;
        requirementsMet = currentValue >= targetValue;
        break;

      case 'QUIZ_PASS_COUNT':
        currentValue = completedQuizzesCount;
        targetValue = ch.requirements.target;
        requirementsMet = currentValue >= targetValue;
        break;

      case 'SCENARIO_COUNT':
        currentValue = completedScenariosCount;
        targetValue = ch.requirements.target;
        requirementsMet = currentValue >= targetValue;
        break;

      case 'TRADE_COUNT':
        currentValue = executedTradesCount;
        targetValue = ch.requirements.target;
        requirementsMet = currentValue >= targetValue;
        break;

      case 'ASSET_DIVERSITY':
        currentValue = uniqueAssetsTraded;
        targetValue = ch.requirements.target;
        requirementsMet = currentValue >= targetValue;
        break;

      case 'FULL_POSITION_EXIT':
        currentValue = hasFullExit ? 1 : 0;
        targetValue = ch.requirements.target || 1;
        requirementsMet = Boolean(hasFullExit);
        break;

      case 'TWO_SIDED_TRADING': {
        const metBuys = buyTradesCount >= ch.requirements.minBuys;
        const metSells = sellTradesCount >= ch.requirements.minSells;
        requirementsMet = metBuys && metSells;
        currentValue = Math.min(buyTradesCount, ch.requirements.minBuys) + Math.min(sellTradesCount, ch.requirements.minSells);
        targetValue = ch.requirements.minBuys + ch.requirements.minSells;
        break;
      }

      case 'SCHOLAR_TRADER': {
        const metL = completedLessonsCount >= ch.requirements.minLessons;
        const metQ = completedQuizzesCount >= ch.requirements.minQuizzes;
        const metT = executedTradesCount >= ch.requirements.minTrades;
        requirementsMet = metL && metQ && metT;
        currentValue = (metL ? 1 : 0) + (metQ ? 1 : 0) + (metT ? 1 : 0);
        targetValue = 3;
        break;
      }

      case 'COMPOSITE_DISCIPLINE': {
        const metLessons = completedLessonsCount >= ch.requirements.minLessons;
        const metQuizzes = completedQuizzesCount >= ch.requirements.minQuizzes;
        const metTrades = executedTradesCount >= ch.requirements.minTrades;
        requirementsMet = metLessons && metQuizzes && metTrades;
        // Normalized progress towards composite
        currentValue =
          (metLessons ? 1 : 0) + (metQuizzes ? 1 : 0) + (metTrades ? 1 : 0);
        targetValue = 3;
        break;
      }

      default:
        requirementsMet = false;
        break;
    }

    return {
      challengeId: ch.challengeId,
      title: ch.title,
      description: ch.description,
      category: ch.category,
      objective: ch.objective,
      requirements: ch.requirements,
      rewardXp: ch.rewardXp,
      difficulty: ch.difficulty,
      isCompleted,
      canClaim: !isCompleted && requirementsMet,
      currentValue,
      targetValue,
      progressPercent: Math.min(100, Math.round((currentValue / targetValue) * 100)),
    };
  });

  return {
    challenges: evaluatedChallenges,
    completedChallenges: Array.from(completedChallengesSet),
    completedCount: completedChallengesSet.size,
    totalCount: CHALLENGES.length,
    totalXp,
    quizXp,
    challengeXp,
    metrics: {
      completedLessonsCount,
      completedQuizzesCount,
      completedScenariosCount,
      executedTradesCount,
    },
    lastUpdatedAt: challengeProgress?.lastUpdatedAt || null,
  };
}

/**
 * Server-authoritative challenge claim and atomic XP awarding
 *
 * @param {string|Object} userId
 * @param {string} challengeId
 */
async function claimChallenge(userId, challengeId) {
  if (!userId) {
    const err = new Error('User ID is required to claim challenge.');
    err.status = 401;
    throw err;
  }

  if (!challengeId || typeof challengeId !== 'string') {
    const err = new Error('Challenge ID is required.');
    err.status = 400;
    throw err;
  }

  const cleanId = challengeId.trim().toLowerCase();
  const challenge = CHALLENGES.find((c) => c.challengeId === cleanId);

  if (!challenge || challenge.active === false) {
    const err = new Error(`Challenge "${cleanId}" not found or is currently inactive.`);
    err.status = 404;
    err.code = 'INVALID_CHALLENGE_ID';
    throw err;
  }

  // 1. Check existing progress document
  let userProgress = await ChallengeProgress.findOne({ user: userId });
  if (userProgress && userProgress.completedChallenges.includes(cleanId)) {
    const quizProgress = await QuizProgress.findOne({ user: userId });
    const quizXp = quizProgress?.totalXp || 0;
    return {
      success: true,
      alreadyClaimed: true,
      message: 'Challenge already completed and claimed.',
      challengeId: cleanId,
      title: challenge.title,
      earnedXp: 0,
      totalChallengeXp: userProgress.totalChallengeXp,
      totalXp: quizXp + userProgress.totalChallengeXp,
    };
  }

  // 2. Authoritatively verify requirements against application collections
  let requirementsMet = false;
  let currentDetail = '';

  switch (challenge.requirements.type) {
    case 'LESSON_COUNT': {
      const lp = await LearningProgress.findOne({ user: userId });
      const count = (lp?.completedLessons || []).length;
      requirementsMet = count >= challenge.requirements.target;
      currentDetail = `Completed ${count}/${challenge.requirements.target} lessons`;
      break;
    }

    case 'QUIZ_PASS_COUNT': {
      const qp = await QuizProgress.findOne({ user: userId });
      const count = (qp?.completedQuizzes || []).length;
      requirementsMet = count >= challenge.requirements.target;
      currentDetail = `Passed ${count}/${challenge.requirements.target} quizzes`;
      break;
    }

    case 'SCENARIO_COUNT': {
      const sp = await ScenarioProgress.findOne({ user: userId });
      const count = (sp?.completedScenarios || []).length;
      requirementsMet = count >= challenge.requirements.target;
      currentDetail = `Completed ${count}/${challenge.requirements.target} scenarios`;
      break;
    }

    case 'TRADE_COUNT': {
      const tradeCount = await Trade.countDocuments({ user: userId, status: 'EXECUTED' });
      requirementsMet = tradeCount >= challenge.requirements.target;
      currentDetail = `Executed ${tradeCount}/${challenge.requirements.target} simulated trades`;
      break;
    }

    case 'ASSET_DIVERSITY': {
      const distinctSymbols = await Trade.distinct('symbol', { user: userId, status: 'EXECUTED' });
      const count = distinctSymbols.length;
      requirementsMet = count >= challenge.requirements.target;
      currentDetail = `Traded ${count}/${challenge.requirements.target} distinct assets (${distinctSymbols.join(', ') || 'none'})`;
      break;
    }

    case 'FULL_POSITION_EXIT': {
      const hasFullExit = await checkFullPositionExit(userId);
      requirementsMet = Boolean(hasFullExit);
      currentDetail = hasFullExit ? 'Executed at least 1 verified full-position exit trade' : 'No full-position exit trade executed yet';
      break;
    }

    case 'TWO_SIDED_TRADING': {
      const [buys, sells] = await Promise.all([
        Trade.countDocuments({ user: userId, status: 'EXECUTED', side: 'BUY' }),
        Trade.countDocuments({ user: userId, status: 'EXECUTED', side: 'SELL' }),
      ]);
      requirementsMet = buys >= challenge.requirements.minBuys && sells >= challenge.requirements.minSells;
      currentDetail = `BUY trades: ${buys}/${challenge.requirements.minBuys}, SELL trades: ${sells}/${challenge.requirements.minSells}`;
      break;
    }

    case 'SCHOLAR_TRADER': {
      const [lp, qp, tradeCount] = await Promise.all([
        LearningProgress.findOne({ user: userId }),
        QuizProgress.findOne({ user: userId }),
        Trade.countDocuments({ user: userId, status: 'EXECUTED' }),
      ]);
      const lCount = (lp?.completedLessons || []).length;
      const qCount = (qp?.completedQuizzes || []).length;
      const metL = lCount >= challenge.requirements.minLessons;
      const metQ = qCount >= challenge.requirements.minQuizzes;
      const metT = tradeCount >= challenge.requirements.minTrades;
      requirementsMet = metL && metQ && metT;
      currentDetail = `Lessons: ${lCount}/${challenge.requirements.minLessons}, Quizzes: ${qCount}/${challenge.requirements.minQuizzes}, Trades: ${tradeCount}/${challenge.requirements.minTrades}`;
      break;
    }

    case 'COMPOSITE_DISCIPLINE': {
      const [lp, qp, tradeCount] = await Promise.all([
        LearningProgress.findOne({ user: userId }),
        QuizProgress.findOne({ user: userId }),
        Trade.countDocuments({ user: userId, status: 'EXECUTED' }),
      ]);
      const lCount = (lp?.completedLessons || []).length;
      const qCount = (qp?.completedQuizzes || []).length;
      const metL = lCount >= challenge.requirements.minLessons;
      const metQ = qCount >= challenge.requirements.minQuizzes;
      const metT = tradeCount >= challenge.requirements.minTrades;
      requirementsMet = metL && metQ && metT;
      currentDetail = `Lessons: ${lCount}/${challenge.requirements.minLessons}, Quizzes: ${qCount}/${challenge.requirements.minQuizzes}, Trades: ${tradeCount}/${challenge.requirements.minTrades}`;
      break;
    }

    default:
      requirementsMet = false;
      break;
  }

  if (!requirementsMet) {
    const err = new Error(
      `Requirements for "${challenge.title}" have not been satisfied yet. Current progress: ${currentDetail}.`
    );
    err.status = 400;
    err.code = 'REQUIREMENT_NOT_MET';
    err.details = { currentDetail, requirements: challenge.requirements };
    throw err;
  }

  // 3. Ensure progress document exists for user
  let progressDoc = await ChallengeProgress.findOne({ user: userId });
  if (!progressDoc) {
    try {
      progressDoc = await ChallengeProgress.create({
        user: userId,
        completedChallenges: [],
        totalChallengeXp: 0,
      });
    } catch (createErr) {
      if (createErr.code === 11000) {
        progressDoc = await ChallengeProgress.findOne({ user: userId });
      } else {
        throw createErr;
      }
    }
  }

  // 4. Atomically record completion and award XP using condition { completedChallenges: { $ne: cleanId } }
  // This completely eliminates concurrent race conditions and prevents double XP awards
  const updatedDoc = await ChallengeProgress.findOneAndUpdate(
    {
      user: userId,
      completedChallenges: { $ne: cleanId },
    },
    {
      $addToSet: { completedChallenges: cleanId },
      $inc: { totalChallengeXp: challenge.rewardXp },
      $set: { lastUpdatedAt: new Date() },
    },
    {
      new: true,
    }
  );

  let earnedXp = challenge.rewardXp;
  let alreadyClaimed = false;
  let finalDoc = updatedDoc;

  if (!updatedDoc) {
    // A concurrent request already added cleanId to completedChallenges
    finalDoc = await ChallengeProgress.findOne({ user: userId });
    earnedXp = 0;
    alreadyClaimed = true;
  }

  const [quizProgress, achievementProgress] = await Promise.all([
    QuizProgress.findOne({ user: userId }),
    AchievementProgress.findOne({ user: userId }),
  ]);
  const quizXp = quizProgress?.totalXp || 0;
  const achievementXp = achievementProgress?.totalAchievementXp || 0;
  const totalChallengeXp = finalDoc?.totalChallengeXp || 0;
  const totalXp = quizXp + totalChallengeXp + achievementXp;

  return {
    success: true,
    alreadyClaimed,
    message: alreadyClaimed
      ? 'Challenge already completed and claimed.'
      : `Challenge "${challenge.title}" completed! You earned +${challenge.rewardXp} XP.`,
    challengeId: cleanId,
    title: challenge.title,
    earnedXp,
    totalChallengeXp,
    totalXp,
  };
}

module.exports = {
  getChallengeCatalog,
  getUserChallengeProgress,
  claimChallenge,
};
