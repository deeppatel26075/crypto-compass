/**
 * Crypto Compass — Challenge Definitions (Phase 20)
 *
 * Deterministic, structured educational and practice challenges.
 * All challenges are strictly educational/practice-oriented.
 * Zero gambling, zero real money, zero financial predictions, zero trade signals.
 */

const CHALLENGE_CATEGORIES = Object.freeze({
  LEARNING: 'LEARNING',
  QUIZ: 'QUIZ',
  SCENARIO: 'SCENARIO',
  TRADING: 'TRADING',
  DISCIPLINE: 'DISCIPLINE',
});

const CHALLENGE_DIFFICULTIES = Object.freeze({
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
});

const CHALLENGES = Object.freeze([
  {
    challengeId: 'first-steps',
    title: 'Crypto Explorer',
    description: 'Complete your first structured educational lesson to establish foundational cryptocurrency knowledge.',
    category: CHALLENGE_CATEGORIES.LEARNING,
    objective: 'Complete at least 1 lesson',
    requirements: {
      type: 'LESSON_COUNT',
      target: 1,
    },
    rewardXp: 50,
    difficulty: CHALLENGE_DIFFICULTIES.BEGINNER,
    active: true,
  },
  {
    challengeId: 'knowledge-seeker',
    title: 'Knowledge Seeker',
    description: 'Broaden your understanding of market structures, order books, and blockchain architecture.',
    category: CHALLENGE_CATEGORIES.LEARNING,
    objective: 'Complete at least 5 lessons',
    requirements: {
      type: 'LESSON_COUNT',
      target: 5,
    },
    rewardXp: 100,
    difficulty: CHALLENGE_DIFFICULTIES.INTERMEDIATE,
    active: true,
  },
  {
    challengeId: 'quiz-novice',
    title: 'Quiz Novice',
    description: 'Demonstrate comprehension by passing your first post-lesson quiz assessment with 80% or higher.',
    category: CHALLENGE_CATEGORIES.QUIZ,
    objective: 'Pass at least 1 quiz (≥80% score)',
    requirements: {
      type: 'QUIZ_PASS_COUNT',
      target: 1,
    },
    rewardXp: 75,
    difficulty: CHALLENGE_DIFFICULTIES.BEGINNER,
    active: true,
  },
  {
    challengeId: 'quiz-scholar',
    title: 'Quiz Scholar',
    description: 'Prove consistent understanding across multiple assessments in digital asset concepts and terminology.',
    category: CHALLENGE_CATEGORIES.QUIZ,
    objective: 'Pass at least 5 quizzes (≥80% score)',
    requirements: {
      type: 'QUIZ_PASS_COUNT',
      target: 5,
    },
    rewardXp: 150,
    difficulty: CHALLENGE_DIFFICULTIES.INTERMEDIATE,
    active: true,
  },
  {
    challengeId: 'scenario-pioneer',
    title: 'Decision Maker',
    description: 'Experience real-world simulated market conditions and make an educational choice in Scenario Mode.',
    category: CHALLENGE_CATEGORIES.SCENARIO,
    objective: 'Complete at least 1 interactive scenario',
    requirements: {
      type: 'SCENARIO_COUNT',
      target: 1,
    },
    rewardXp: 75,
    difficulty: CHALLENGE_DIFFICULTIES.BEGINNER,
    active: true,
  },
  {
    challengeId: 'scenario-strategist',
    title: 'Scenario Strategist',
    description: 'Navigate multiple diverse simulated market events and analyze the outcomes of your decisions.',
    category: CHALLENGE_CATEGORIES.SCENARIO,
    objective: 'Complete at least 3 interactive scenarios',
    requirements: {
      type: 'SCENARIO_COUNT',
      target: 3,
    },
    rewardXp: 150,
    difficulty: CHALLENGE_DIFFICULTIES.INTERMEDIATE,
    active: true,
  },
  {
    challengeId: 'first-paper-trade',
    title: 'First Paper Trade',
    description: 'Apply what you have learned by executing your first risk-free simulated order on the paper-trading exchange.',
    category: CHALLENGE_CATEGORIES.TRADING,
    objective: 'Execute at least 1 simulated trade',
    requirements: {
      type: 'TRADE_COUNT',
      target: 1,
    },
    rewardXp: 50,
    difficulty: CHALLENGE_DIFFICULTIES.BEGINNER,
    active: true,
  },
  {
    challengeId: 'disciplined-trader',
    title: 'Disciplined Practice',
    description: 'Execute multiple paper trades to observe order fills, position sizing, and portfolio impact.',
    category: CHALLENGE_CATEGORIES.TRADING,
    objective: 'Execute at least 3 simulated trades',
    requirements: {
      type: 'TRADE_COUNT',
      target: 3,
    },
    rewardXp: 100,
    difficulty: CHALLENGE_DIFFICULTIES.INTERMEDIATE,
    active: true,
  },
  {
    challengeId: 'compass-master',
    title: 'Compass Master',
    description: 'Demonstrate well-rounded learning and practice discipline by engaging across all educational modalities.',
    category: CHALLENGE_CATEGORIES.DISCIPLINE,
    objective: 'Complete ≥3 lessons, pass ≥2 quizzes, and execute ≥1 paper trade',
    requirements: {
      type: 'COMPOSITE_DISCIPLINE',
      minLessons: 3,
      minQuizzes: 2,
      minTrades: 1,
    },
    rewardXp: 200,
    difficulty: CHALLENGE_DIFFICULTIES.ADVANCED,
    active: true,
  },
  {
    challengeId: 'diversified-trader',
    title: 'Diversified Allocator',
    description: 'Practice portfolio diversification by executing simulated trades across at least 3 distinct digital assets.',
    category: CHALLENGE_CATEGORIES.TRADING,
    objective: 'Execute simulated trades in at least 3 different assets',
    requirements: {
      type: 'ASSET_DIVERSITY',
      target: 3,
    },
    rewardXp: 100,
    difficulty: CHALLENGE_DIFFICULTIES.INTERMEDIATE,
    active: true,
  },
  {
    challengeId: 'orderly-exit',
    title: 'Orderly Exit',
    description: 'Execute a verified full-position Exit Trade closing 100% of an open crypto position.',
    category: CHALLENGE_CATEGORIES.TRADING,
    objective: 'Execute 1 verified full-position exit trade',
    requirements: {
      type: 'FULL_POSITION_EXIT',
      target: 1,
    },
    rewardXp: 125,
    difficulty: CHALLENGE_DIFFICULTIES.INTERMEDIATE,
    active: true,
  },
  {
    challengeId: 'two-sided-practitioner',
    title: 'Two-Sided Trader',
    description: 'Gain practical experience managing both entry and exit legs of trades (at least 2 BUYs and 2 SELLs).',
    category: CHALLENGE_CATEGORIES.TRADING,
    objective: 'Execute at least 2 BUY trades and at least 2 SELL trades',
    requirements: {
      type: 'TWO_SIDED_TRADING',
      minBuys: 2,
      minSells: 2,
    },
    rewardXp: 150,
    difficulty: CHALLENGE_DIFFICULTIES.ADVANCED,
    active: true,
  },
  {
    challengeId: 'disciplined-scholar-trader',
    title: 'Disciplined Scholar Trader',
    description: 'Cultivate end-to-end discipline by combining curriculum study, quiz validation, and executed trades.',
    category: CHALLENGE_CATEGORIES.DISCIPLINE,
    objective: 'Complete ≥5 lessons, pass ≥3 quizzes, and execute ≥3 simulated trades',
    requirements: {
      type: 'SCHOLAR_TRADER',
      minLessons: 5,
      minQuizzes: 3,
      minTrades: 3,
    },
    rewardXp: 250,
    difficulty: CHALLENGE_DIFFICULTIES.ADVANCED,
    active: true,
  },
]);

module.exports = {
  CHALLENGE_CATEGORIES,
  CHALLENGE_DIFFICULTIES,
  CHALLENGES,
};
