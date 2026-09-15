/**
 * Crypto Compass — Achievement Definitions (Phase 21)
 *
 * Deterministic long-term achievement recognition and progression.
 * Strictly educational and practice oriented.
 * Zero gambling, zero financial rewards, zero ranking by profit or simulated wealth.
 */

const ACHIEVEMENT_CATEGORIES = Object.freeze({
  LEARNING: 'LEARNING',
  ASSESSMENT: 'ASSESSMENT',
  PRACTICE: 'PRACTICE',
  TRADING: 'TRADING',
  MASTERY: 'MASTERY',
});

const ACHIEVEMENTS = Object.freeze([
  {
    achievementId: 'first-lesson',
    title: 'First Step into Crypto',
    description: 'Completed your first structured lesson in the cryptocurrency curriculum.',
    category: ACHIEVEMENT_CATEGORIES.LEARNING,
    rewardXp: 50,
    requirement: {
      type: 'LESSON_COUNT',
      target: 1,
      label: 'Complete 1 lesson',
    },
    active: true,
  },
  {
    achievementId: 'five-lessons',
    title: 'Curious Mind',
    description: 'Completed 5 lessons covering blockchain fundamentals, market structures, and wallets.',
    category: ACHIEVEMENT_CATEGORIES.LEARNING,
    rewardXp: 100,
    requirement: {
      type: 'LESSON_COUNT',
      target: 5,
      label: 'Complete 5 lessons',
    },
    active: true,
  },
  {
    achievementId: 'all-lessons',
    title: 'Curriculum Graduate',
    description: 'Mastered the complete curriculum by completing all 15 educational lessons.',
    category: ACHIEVEMENT_CATEGORIES.LEARNING,
    rewardXp: 250,
    requirement: {
      type: 'LESSON_COUNT',
      target: 15,
      label: 'Complete all 15 lessons',
    },
    active: true,
  },
  {
    achievementId: 'first-quiz',
    title: 'Knowledge Validated',
    description: 'Passed your first assessment quiz with a passing score of 80% or higher.',
    category: ACHIEVEMENT_CATEGORIES.ASSESSMENT,
    rewardXp: 50,
    requirement: {
      type: 'QUIZ_PASS_COUNT',
      target: 1,
      label: 'Pass 1 quiz (≥80%)',
    },
    active: true,
  },
  {
    achievementId: 'five-quizzes',
    title: 'Consistent Scholar',
    description: 'Demonstrated solid retention by passing 5 distinct assessment quizzes with 80% or higher.',
    category: ACHIEVEMENT_CATEGORIES.ASSESSMENT,
    rewardXp: 100,
    requirement: {
      type: 'QUIZ_PASS_COUNT',
      target: 5,
      label: 'Pass 5 quizzes (≥80%)',
    },
    active: true,
  },
  {
    achievementId: 'first-scenario',
    title: 'Prudent Decision',
    description: 'Completed your first simulated market event in Scenario Mode.',
    category: ACHIEVEMENT_CATEGORIES.PRACTICE,
    rewardXp: 50,
    requirement: {
      type: 'SCENARIO_COUNT',
      target: 1,
      label: 'Complete 1 scenario',
    },
    active: true,
  },
  {
    achievementId: 'five-scenarios',
    title: 'Market Tactician',
    description: 'Navigated 5 diverse simulated market dilemmas in Scenario Mode.',
    category: ACHIEVEMENT_CATEGORIES.PRACTICE,
    rewardXp: 100,
    requirement: {
      type: 'SCENARIO_COUNT',
      target: 5,
      label: 'Complete 5 scenarios',
    },
    active: true,
  },
  {
    achievementId: 'first-paper-trade',
    title: 'Simulated Market Entry',
    description: 'Executed your first risk-free paper trade on the simulated exchange.',
    category: ACHIEVEMENT_CATEGORIES.TRADING,
    rewardXp: 50,
    requirement: {
      type: 'TRADE_COUNT',
      target: 1,
      label: 'Execute 1 paper trade',
    },
    active: true,
  },
  {
    achievementId: 'five-paper-trades',
    title: 'Disciplined Practitioner',
    description: 'Executed 5 simulated trades observing order fills and portfolio allocation.',
    category: ACHIEVEMENT_CATEGORIES.TRADING,
    rewardXp: 100,
    requirement: {
      type: 'TRADE_COUNT',
      target: 5,
      label: 'Execute 5 paper trades',
    },
    active: true,
  },
  {
    achievementId: 'first-full-exit',
    title: 'Closing the Loop',
    description: 'Executed a verified full-position Exit Trade closing 100% of an active holding.',
    category: ACHIEVEMENT_CATEGORIES.TRADING,
    rewardXp: 75,
    requirement: {
      type: 'FULL_POSITION_EXIT',
      target: 1,
      label: 'Execute 1 full-position exit trade',
    },
    active: true,
  },
  {
    achievementId: 'first-challenge',
    title: 'Quest Undertaken',
    description: 'Completed and claimed your first structured educational challenge.',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    rewardXp: 50,
    requirement: {
      type: 'CHALLENGE_COUNT',
      target: 1,
      label: 'Complete 1 challenge',
    },
    active: true,
  },
  {
    achievementId: 'multiple-challenges',
    title: 'Challenge Champion',
    description: 'Completed and claimed 5 structured educational challenges.',
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    rewardXp: 150,
    requirement: {
      type: 'CHALLENGE_COUNT',
      target: 5,
      label: 'Complete 5 challenges',
    },
    active: true,
  },
]);

module.exports = {
  ACHIEVEMENT_CATEGORIES,
  ACHIEVEMENTS,
};
