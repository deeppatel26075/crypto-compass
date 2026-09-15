/**
 * Crypto Compass — Trade Coach Constants (Phase 10)
 *
 * Deterministic educational rules and exposure classifications.
 * Strictly educational: zero financial advice, zero market predictions.
 */

const EXPOSURE_LEVELS = Object.freeze({
  LOW: 'LOW',
  MODERATE: 'MODERATE',
  HIGH: 'HIGH',
  VERY_HIGH: 'VERY_HIGH',
});

const LEVEL_RANK = Object.freeze({
  [EXPOSURE_LEVELS.LOW]: 1,
  [EXPOSURE_LEVELS.MODERATE]: 2,
  [EXPOSURE_LEVELS.HIGH]: 3,
  [EXPOSURE_LEVELS.VERY_HIGH]: 4,
});

/**
 * Determine Cash Allocation level based on deterministic percentage thresholds:
 * < 10% -> LOW
 * 10% - 25% -> MODERATE
 * 25% - 50% -> HIGH
 * > 50% -> VERY_HIGH
 */
function getCashAllocationLevel(percentage) {
  if (percentage < 10) return EXPOSURE_LEVELS.LOW;
  if (percentage <= 25) return EXPOSURE_LEVELS.MODERATE;
  if (percentage <= 50) return EXPOSURE_LEVELS.HIGH;
  return EXPOSURE_LEVELS.VERY_HIGH;
}

/**
 * Determine Concentration level based on deterministic percentage thresholds:
 * < 25% -> LOW
 * 25% - 50% -> MODERATE
 * 50% - 75% -> HIGH
 * > 75% -> VERY_HIGH
 */
function getConcentrationLevel(percentage) {
  if (percentage < 25) return EXPOSURE_LEVELS.LOW;
  if (percentage <= 50) return EXPOSURE_LEVELS.MODERATE;
  if (percentage <= 75) return EXPOSURE_LEVELS.HIGH;
  return EXPOSURE_LEVELS.VERY_HIGH;
}

/**
 * Deterministic Overall Risk Exposure:
 * Highest applicable level between cash allocation level and post-trade concentration level.
 */
function getOverallRiskExposure(cashLevel, concentrationLevel) {
  const rank1 = LEVEL_RANK[cashLevel] || 1;
  const rank2 = LEVEL_RANK[concentrationLevel] || 1;
  const maxRank = Math.max(rank1, rank2);

  for (const [lvl, r] of Object.entries(LEVEL_RANK)) {
    if (r === maxRank) return lvl;
  }
  return EXPOSURE_LEVELS.LOW;
}

const EDUCATIONAL_DISCLAIMER =
  'Educational Simulation Only · Not Financial Advice. This analysis measures simulation exposure and does not predict future market prices.';

module.exports = {
  EXPOSURE_LEVELS,
  LEVEL_RANK,
  getCashAllocationLevel,
  getConcentrationLevel,
  getOverallRiskExposure,
  EDUCATIONAL_DISCLAIMER,
};
