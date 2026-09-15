/**
 * Crypto Compass — Phase 17 Mistake Analyzer Constants & Rules
 *
 * Deterministic rules and educational thresholds for historical trade behavior analysis.
 * All thresholds are transparent, fixed, and explainable in plain English.
 *
 * Strictly educational: ZERO financial advice, ZERO market predictions, ZERO trader scoring.
 */

const ANALYSIS_RULES = {
  // Overtrading: 3 or more trades executed within any 15-minute sliding window
  OVERTRADING_WINDOW_MINUTES: 15,
  OVERTRADING_TRADE_COUNT: 3,

  // Rapid Entry/Exit: A BUY followed by a SELL of the same asset within 30 minutes
  RAPID_ENTRY_EXIT_MINUTES: 30,

  // Historical Trade-Volume Concentration: A single asset accounting for >= 60% of total
  // historical gross trade volume when the user has executed at least 3 trades.
  // Note: This measures gross trading volume concentration, NOT portfolio allocation.
  CONCENTRATION_PERCENT: 60,
  MIN_TRADES_FOR_CONCENTRATION: 3,

  // Position Sizing Proxy: A single trade with execution value >= $5,000 (500,000 cents),
  // which represents 50% of the original $10,000 virtual starting capital.
  // Note: This is an educational starting-balance proxy, NOT an exact portfolio reconstruction.
  LARGE_POSITION_PERCENT: 50,
  INITIAL_PORTFOLIO_CENTS: 1000000, // $10,000.00
  LARGE_POSITION_CENTS: 500000, // $5,000.00

  // FOMO-Style Pattern: 2 or more sequential rapid BUY trades of the same asset within 10 minutes.
  // Note: FOMO cannot be proven; this is an educational pattern associated with FOMO-style behavior.
  FOMO_WINDOW_MINUTES: 10,
  FOMO_BUY_COUNT: 2,

  // Minimum trades required to evaluate comprehensive multi-trade patterns
  MIN_TRADES_FOR_FULL_EVALUATION: 3,

  // Phase 23: Advanced Behavioral Analytics Rules
  RAPID_ACTIVITY_WINDOW_MINUTES: 30,
  RAPID_ACTIVITY_MIN_TRADES: 3,
  MIN_TRADES_FOR_PERIOD_COMPARISON: 4,
  MIN_TRADES_FOR_SUFFICIENT_BEHAVIOR: 5,
};

/**
 * Phase 23: Position-Size Brackets with exact integer-cent boundaries.
 * MICRO:      [0, 50000)
 * SMALL:      [50000, 100000)
 * MEDIUM:     [100000, 250000)
 * LARGE:      [250000, 500000]
 * VERY_LARGE: (500000, Infinity)
 */
const POSITION_SIZE_BRACKETS = [
  { id: 'MICRO', label: '< $500', minCents: 0, maxCents: 50000, minInclusive: true, maxInclusive: false },
  { id: 'SMALL', label: '$500 – $1,000', minCents: 50000, maxCents: 100000, minInclusive: true, maxInclusive: false },
  { id: 'MEDIUM', label: '$1,000 – $2,500', minCents: 100000, maxCents: 250000, minInclusive: true, maxInclusive: false },
  { id: 'LARGE', label: '$2,500 – $5,000', minCents: 250000, maxCents: 500000, minInclusive: true, maxInclusive: true },
  { id: 'VERY_LARGE', label: '> $5,000', minCents: 500000, maxCents: Infinity, minInclusive: false, maxInclusive: false },
];

const ANALYSIS_CATEGORIES = {
  POSITION_SIZING: 'POSITION_SIZING',
  OVERTRADING: 'OVERTRADING',
  CONCENTRATION: 'CONCENTRATION',
  RAPID_ENTRY_EXIT: 'RAPID_ENTRY_EXIT',
  FOMO_PATTERN: 'FOMO_PATTERN',
};

const OBSERVATION_SEVERITY = {
  OBSERVATION: 'OBSERVATION',
  REVIEW: 'REVIEW',
};

const CATEGORY_DEFINITIONS = {
  [ANALYSIS_CATEGORIES.OVERTRADING]: {
    id: 'overtrading',
    category: ANALYSIS_CATEGORIES.OVERTRADING,
    severity: OBSERVATION_SEVERITY.REVIEW,
    title: 'High-Frequency Activity Window',
    summary: 'Your trade history contains several trades executed within short time windows.',
    lessonId: 'common-beginner-mistakes',
    lessonTitle: 'Common Beginner Mistakes',
    educationalExplanation:
      'Frequent decisions in compressed timeframes can make it harder to maintain a disciplined trading plan and may indicate emotional reactivity. Review the lesson on common beginner mistakes to understand the importance of patience and structured execution intervals.',
  },

  [ANALYSIS_CATEGORIES.RAPID_ENTRY_EXIT]: {
    id: 'rapid_entry_exit',
    category: ANALYSIS_CATEGORIES.RAPID_ENTRY_EXIT,
    severity: OBSERVATION_SEVERITY.REVIEW,
    title: 'Rapid Entry and Exit Sequence',
    summary: 'An asset was purchased and subsequently sold within a very brief time interval.',
    lessonId: 'trading-with-a-plan',
    lessonTitle: 'Trading with a Plan',
    educationalExplanation:
      'Closing a trade shortly after opening it often reflects second-guessing or premature panic rather than executing a thought-out trading thesis. Studying trade plans helps learners define predetermined entry and exit conditions before placing an order.',
  },

  [ANALYSIS_CATEGORIES.CONCENTRATION]: {
    id: 'concentration',
    category: ANALYSIS_CATEGORIES.CONCENTRATION,
    severity: OBSERVATION_SEVERITY.OBSERVATION,
    title: 'Trading-Volume Concentration',
    summary: 'A large share of your historical simulated trading volume was concentrated in a single cryptocurrency.',
    lessonId: 'position-sizing-basics',
    lessonTitle: 'Position Sizing Basics',
    educationalExplanation:
      'Focusing the majority of your historical gross trade volume on one asset represents heavy trading-volume concentration. Note: this measures trade-volume distribution rather than your current portfolio allocation. Diversifying educational practice across multiple assets can help broaden your market understanding.',
  },

  [ANALYSIS_CATEGORIES.POSITION_SIZING]: {
    id: 'position_sizing',
    category: ANALYSIS_CATEGORIES.POSITION_SIZING,
    severity: OBSERVATION_SEVERITY.REVIEW,
    title: 'Large Trade Relative to Starting Balance',
    summary: 'One or more historical trades had an execution value representing at least 50% of the original $10,000 virtual starting balance.',
    lessonId: 'position-sizing-basics',
    lessonTitle: 'Position Sizing Basics',
    educationalExplanation:
      'Committing a large dollar amount in a single trade represents outsized position sizing relative to the original $10,000 starting capital proxy. Note: this is an educational proxy based on starting balance, not a reconstruction of your exact portfolio allocation at execution time. Learning position sizing principles helps manage capital risk prudently.',
  },

  [ANALYSIS_CATEGORIES.FOMO_PATTERN]: {
    id: 'fomo_pattern',
    category: ANALYSIS_CATEGORIES.FOMO_PATTERN,
    severity: OBSERVATION_SEVERITY.OBSERVATION,
    title: 'Potential FOMO-Style Entry Pattern',
    summary: 'Your trade history contains a rapid-entry pattern that can be associated with FOMO-style behavior.',
    lessonId: 'trading-with-a-plan',
    lessonTitle: 'Trading with a Plan',
    educationalExplanation:
      'Repeated buying in rapid succession can be an indicator of chasing momentum or fearing missed opportunities. While trade records cannot definitively prove emotional intent, studying FOMO-style patterns helps learners recognize impulsive entries and cultivate patience.',
  },
};

module.exports = {
  ANALYSIS_RULES,
  ANALYSIS_CATEGORIES,
  OBSERVATION_SEVERITY,
  CATEGORY_DEFINITIONS,
  POSITION_SIZE_BRACKETS,
};
