const Trade = require('../models/Trade');
const {
  ANALYSIS_RULES,
  ANALYSIS_CATEGORIES,
  CATEGORY_DEFINITIONS,
  POSITION_SIZE_BRACKETS,
} = require('../constants/analysisRules');

/**
 * Crypto Compass — Mistake Analyzer Service (Phase 17)
 *
 * Deterministically analyzes a user's stored simulated trading history
 * to identify educational behavioral patterns.
 *
 * Strictly READ-ONLY:
 * - Zero trade modifications
 * - Zero wallet/holding modifications
 * - Zero XP awarded
 * - Zero database writes / No persistence
 * - Zero external market data dependencies
 * - Non-advisory, non-predictive, educational descriptions only
 */

/**
 * Format integer cents into standard USD string (e.g. 500000 -> "$5,000.00")
 * @param {number} cents
 * @returns {string}
 */
function formatUSDFromCents(cents) {
  if (typeof cents !== 'number' || !Number.isFinite(cents)) return '$0.00';
  return `$${(cents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Calculate the median value of an array of numbers.
 * @param {number[]} numbers
 * @returns {number}
 */
function calculateMedian(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return sorted[mid];
}

/**
 * Chronological FIFO match of BUY lots to subsequent SELL executions per symbol.
 * Uses exact 8-decimal base-unit arithmetic (BigInt).
 * - Partial positions are matched proportionally.
 * - Each matched lot is weighted by its matched quantity.
 * - Unmatched BUY quantity is excluded from holding-duration metrics.
 * - SELL with no preceding available BUY is ignored for duration matching.
 *
 * @param {Array<Object>} trades - Chronologically ordered executed trades
 * @returns {Object} Holding duration statistics
 */
function calculateHoldingDurationFIFO(trades) {
  if (!Array.isArray(trades) || trades.length === 0) {
    return {
      averageHoldingDurationSeconds: 0,
      averageHoldingDurationMinutes: 0,
      medianHoldingDurationSeconds: 0,
      medianHoldingDurationMinutes: 0,
      closedPositionsCount: 0,
      totalMatchedUnits: 0,
    };
  }

  const queues = {};
  const matchedLots = [];

  for (const trade of trades) {
    const symbol = trade.symbol;
    if (!symbol) continue;
    if (!queues[symbol]) {
      queues[symbol] = [];
    }

    // Determine quantity in 8-decimal base units (BigInt)
    let units = 0n;
    if (trade.quantityBaseUnits) {
      units = BigInt(trade.quantityBaseUnits);
    } else if (trade.quantity !== undefined && trade.quantity !== null) {
      const qNum = typeof trade.quantity === 'number' ? trade.quantity : parseFloat(trade.quantity.toString());
      if (!isNaN(qNum) && qNum > 0) {
        units = BigInt(Math.round(qNum * 1e8));
      }
    }

    if (units <= 0n) continue;

    const tradeTime = new Date(trade.executedAt || trade.createdAt).getTime();

    if (trade.side === 'BUY') {
      queues[symbol].push({
        executedAt: tradeTime,
        remainingUnits: units,
      });
    } else if (trade.side === 'SELL') {
      let sellUnitsRemaining = units;
      while (sellUnitsRemaining > 0n && queues[symbol].length > 0) {
        const head = queues[symbol][0];
        const matchedUnits = sellUnitsRemaining < head.remainingUnits ? sellUnitsRemaining : head.remainingUnits;
        const durationSeconds = Math.max(0, Math.round((tradeTime - head.executedAt) / 1000));

        matchedLots.push({
          symbol,
          matchedUnits,
          durationSeconds,
        });

        head.remainingUnits -= matchedUnits;
        sellUnitsRemaining -= matchedUnits;

        if (head.remainingUnits === 0n) {
          queues[symbol].shift();
        }
      }
    }
  }

  if (matchedLots.length === 0) {
    return {
      averageHoldingDurationSeconds: 0,
      averageHoldingDurationMinutes: 0,
      medianHoldingDurationSeconds: 0,
      medianHoldingDurationMinutes: 0,
      closedPositionsCount: 0,
      totalMatchedUnits: 0,
    };
  }

  const totalMatchedUnitsBigInt = matchedLots.reduce((acc, m) => acc + m.matchedUnits, 0n);
  const totalMatchedUnitsNum = Number(totalMatchedUnitsBigInt);

  const totalWeightedDurationSeconds = matchedLots.reduce(
    (sum, m) => sum + Number(m.matchedUnits) * m.durationSeconds,
    0
  );

  const averageHoldingDurationSeconds =
    totalMatchedUnitsNum > 0 ? Math.round(totalWeightedDurationSeconds / totalMatchedUnitsNum) : 0;
  const averageHoldingDurationMinutes = Math.round(averageHoldingDurationSeconds / 60);

  const durations = matchedLots.map((m) => m.durationSeconds);
  const medianHoldingDurationSeconds = calculateMedian(durations);
  const medianHoldingDurationMinutes = Math.round(medianHoldingDurationSeconds / 60);

  return {
    averageHoldingDurationSeconds,
    averageHoldingDurationMinutes,
    medianHoldingDurationSeconds,
    medianHoldingDurationMinutes,
    closedPositionsCount: matchedLots.length,
    totalMatchedUnits: Number((totalMatchedUnitsNum / 1e8).toFixed(8)),
  };
}

/**
 * Calculate trade cadence, trades per day/week, and time intervals between consecutive trades.
 * Uses Trade.executedAt timestamps.
 * Safe minimum denominator of 1 day for tradingSpanDays.
 *
 * @param {Array<Object>} trades
 * @returns {Object}
 */
function calculateCadenceAndIntervals(trades) {
  if (!Array.isArray(trades) || trades.length === 0) {
    return {
      tradingSpanDays: 1,
      tradesPerDay: 0,
      tradesPerWeek: 0,
      intervalsMinutes: [],
      averageIntervalMinutes: 0,
      medianIntervalMinutes: 0,
      shortestIntervalMinutes: 0,
      longestIntervalMinutes: 0,
    };
  }

  const timestamps = trades.map((t) => new Date(t.executedAt || t.createdAt).getTime());
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);

  // tradingSpanDays = (max executedAt - min executedAt) / 24h with a safe minimum denominator of 1 day
  const rawSpanDays = (maxTime - minTime) / (24 * 60 * 60 * 1000);
  const tradingSpanDays = Math.max(1, rawSpanDays);
  const tradesPerDay = Number((trades.length / tradingSpanDays).toFixed(2));
  const tradesPerWeek = Number((tradesPerDay * 7).toFixed(2));

  const intervalsMinutes = [];
  for (let i = 0; i < trades.length - 1; i++) {
    const elapsedMinutes = Math.max(
      0,
      Math.round((timestamps[i + 1] - timestamps[i]) / (60 * 1000))
    );
    intervalsMinutes.push(elapsedMinutes);
  }

  const averageIntervalMinutes =
    intervalsMinutes.length > 0
      ? Math.round(intervalsMinutes.reduce((sum, v) => sum + v, 0) / intervalsMinutes.length)
      : 0;

  const medianIntervalMinutes = calculateMedian(intervalsMinutes);
  const shortestIntervalMinutes = intervalsMinutes.length > 0 ? Math.min(...intervalsMinutes) : 0;
  const longestIntervalMinutes = intervalsMinutes.length > 0 ? Math.max(...intervalsMinutes) : 0;

  return {
    tradingSpanDays: Number(tradingSpanDays.toFixed(2)),
    tradesPerDay,
    tradesPerWeek,
    intervalsCount: intervalsMinutes.length,
    averageIntervalMinutes,
    medianIntervalMinutes,
    shortestIntervalMinutes,
    longestIntervalMinutes,
  };
}

/**
 * Counts maximal rapid activity windows (at least 3 trades within 30 minutes).
 * Each maximal cluster is counted once.
 *
 * @param {Array<Object>} trades
 * @returns {number} Count of maximal rapid activity windows
 */
function calculateRapidActivityWindows(trades) {
  if (!Array.isArray(trades) || trades.length < ANALYSIS_RULES.RAPID_ACTIVITY_MIN_TRADES) {
    return 0;
  }

  const timestamps = trades.map((t) => new Date(t.executedAt || t.createdAt).getTime());
  const windowMs = ANALYSIS_RULES.RAPID_ACTIVITY_WINDOW_MINUTES * 60 * 1000;
  let count = 0;
  let i = 0;

  while (i < trades.length) {
    const startTime = timestamps[i];
    let j = i;
    while (j < trades.length && (timestamps[j] - startTime) <= windowMs) {
      j++;
    }
    const clusterSize = j - i;
    if (clusterSize >= ANALYSIS_RULES.RAPID_ACTIVITY_MIN_TRADES) {
      count++;
      i = j; // advance past the maximal cluster
    } else {
      i++;
    }
  }

  return count;
}

/**
 * Calculates asset switching count and percentage between consecutive trades.
 * assetSwitchingCount = number of consecutive trade pairs where current.symbol !== previous.symbol
 * assetSwitchingPercentage = (assetSwitchingCount / (tradeCount - 1)) * 100
 *
 * @param {Array<Object>} trades
 * @returns {Object}
 */
function calculateAssetSwitching(trades) {
  if (!Array.isArray(trades) || trades.length < 2) {
    return {
      assetSwitchingCount: 0,
      assetSwitchingPercentage: 0,
    };
  }

  let assetSwitchingCount = 0;
  for (let i = 0; i < trades.length - 1; i++) {
    if (trades[i].symbol !== trades[i + 1].symbol) {
      assetSwitchingCount++;
    }
  }

  const assetSwitchingPercentage = Number(
    ((assetSwitchingCount / (trades.length - 1)) * 100).toFixed(1)
  );

  return {
    assetSwitchingCount,
    assetSwitchingPercentage,
  };
}

/**
 * Categorizes trades into exact integer-cent position-size brackets:
 * MICRO:      [0, 50000) cents (< $500)
 * SMALL:      [50000, 100000) cents ($500 – $1,000)
 * MEDIUM:     [100000, 250000) cents ($1,000 – $2,500)
 * LARGE:      [250000, 500000] cents ($2,500 – $5,000)
 * VERY_LARGE: (500000, Infinity) cents (> $5,000)
 *
 * @param {Array<Object>} trades
 * @param {number} grossVolumeCents
 * @returns {Object}
 */
function calculatePositionSizeDistribution(trades, grossVolumeCents) {
  const distribution = POSITION_SIZE_BRACKETS.map((bracket) => {
    const matchingTrades = trades.filter((t) => {
      const cents = typeof t.grossValueCents === 'number' ? t.grossValueCents : 0;
      const meetsMin = bracket.minInclusive !== false ? cents >= bracket.minCents : cents > bracket.minCents;
      const meetsMax = bracket.maxInclusive ? cents <= bracket.maxCents : cents < bracket.maxCents;
      return meetsMin && meetsMax;
    });

    const count = matchingTrades.length;
    const percentage = trades.length > 0 ? Number(((count / trades.length) * 100).toFixed(1)) : 0;
    const bracketVolumeCents = matchingTrades.reduce((sum, t) => sum + (t.grossValueCents || 0), 0);

    return {
      id: bracket.id,
      label: bracket.label,
      minCents: bracket.minCents,
      maxCents: bracket.maxCents,
      count,
      percentage,
      volumeCents: bracketVolumeCents,
      volumeUSD: formatUSDFromCents(bracketVolumeCents),
    };
  });

  const values = trades.map((t) => (typeof t.grossValueCents === 'number' ? t.grossValueCents : 0));
  const averagePositionSizeCents = trades.length > 0 ? Math.round(grossVolumeCents / trades.length) : 0;
  const largestPositionSizeCents = values.length > 0 ? Math.max(...values) : 0;
  const smallestPositionSizeCents = values.length > 0 ? Math.min(...values) : 0;

  return {
    distribution,
    averagePositionSizeCents,
    averagePositionSize: formatUSDFromCents(averagePositionSizeCents),
    largestPositionSizeCents,
    largestPositionSize: formatUSDFromCents(largestPositionSizeCents),
    smallestPositionSizeCents,
    smallestPositionSize: formatUSDFromCents(smallestPositionSizeCents),
  };
}

/**
 * Calculates historical gross trading-volume concentration and topAssetRatio.
 * topAssetRatio = (gross volume of highest-volume asset / total gross trading volume) * 100
 *
 * @param {Array<Object>} trades
 * @param {number} grossVolumeCents
 * @returns {Object}
 */
function calculateVolumeConcentration(trades, grossVolumeCents) {
  const volumeByAsset = {};
  for (const t of trades) {
    const val = typeof t.grossValueCents === 'number' ? t.grossValueCents : 0;
    volumeByAsset[t.symbol] = (volumeByAsset[t.symbol] || 0) + val;
  }

  const assetBreakdown = Object.entries(volumeByAsset)
    .map(([symbol, volumeCents]) => {
      const volumePercentage =
        grossVolumeCents > 0 ? Number(((volumeCents / grossVolumeCents) * 100).toFixed(1)) : 0;
      return {
        symbol,
        volumeCents,
        volumeUSD: formatUSDFromCents(volumeCents),
        volumePercentage,
      };
    })
    .sort((a, b) => b.volumeCents - a.volumeCents);

  const topAsset = assetBreakdown[0]?.symbol || null;
  const topAssetRatio = assetBreakdown[0]?.volumePercentage || 0;

  return {
    topAsset,
    topAssetRatio,
    assetBreakdown,
  };
}

/**
 * Identifies repeated streaks and entry patterns.
 * Intervening SELL resets the same-symbol BUY streak.
 *
 * @param {Array<Object>} trades
 * @returns {Object}
 */
function calculateRepeatedPatterns(trades) {
  let maxConsecutiveBuys = 0;
  let maxConsecutiveSells = 0;
  let repeatedBuySequencesCount = 0;

  let currentBuyStreak = 0;
  let currentBuySymbol = null;

  let currentSellStreak = 0;
  let currentSellSymbol = null;

  for (const t of trades) {
    if (t.side === 'BUY') {
      if (t.symbol === currentBuySymbol) {
        currentBuyStreak++;
      } else {
        currentBuyStreak = 1;
        currentBuySymbol = t.symbol;
      }
      if (currentBuyStreak === 2) {
        repeatedBuySequencesCount++;
      }
      if (currentBuyStreak > maxConsecutiveBuys) {
        maxConsecutiveBuys = currentBuyStreak;
      }

      // Reset sell streak on BUY
      currentSellStreak = 0;
      currentSellSymbol = null;
    } else if (t.side === 'SELL') {
      if (t.symbol === currentSellSymbol) {
        currentSellStreak++;
      } else {
        currentSellStreak = 1;
        currentSellSymbol = t.symbol;
      }
      if (currentSellStreak > maxConsecutiveSells) {
        maxConsecutiveSells = currentSellStreak;
      }

      // Intervening SELL resets BUY streak for the same symbol
      if (t.symbol === currentBuySymbol) {
        currentBuyStreak = 0;
        currentBuySymbol = null;
      }
    }
  }

  return {
    maxConsecutiveBuys,
    maxConsecutiveSells,
    repeatedBuySequencesCount,
  };
}

/**
 * Factual period comparison between earlier half and later half of trades.
 * Purely descriptive deltas; ZERO psychological or performance judgment.
 *
 * @param {Array<Object>} trades
 * @returns {Object}
 */
function calculatePeriodComparison(trades) {
  if (!Array.isArray(trades) || trades.length < ANALYSIS_RULES.MIN_TRADES_FOR_PERIOD_COMPARISON) {
    return {
      hasComparison: false,
      reason: 'At least 4 executed trades are required for period comparison.',
    };
  }

  const mid = Math.floor(trades.length / 2);
  const earlierTrades = trades.slice(0, mid);
  const laterTrades = trades.slice(mid);

  const earlierGross = earlierTrades.reduce((s, t) => s + (t.grossValueCents || 0), 0);
  const laterGross = laterTrades.reduce((s, t) => s + (t.grossValueCents || 0), 0);

  const earlierCadence = calculateCadenceAndIntervals(earlierTrades);
  const laterCadence = calculateCadenceAndIntervals(laterTrades);

  const earlierSizing = calculatePositionSizeDistribution(earlierTrades, earlierGross);
  const laterSizing = calculatePositionSizeDistribution(laterTrades, laterGross);

  const earlierSwitching = calculateAssetSwitching(earlierTrades);
  const laterSwitching = calculateAssetSwitching(laterTrades);

  const earlierConcentration = calculateVolumeConcentration(earlierTrades, earlierGross);
  const laterConcentration = calculateVolumeConcentration(laterTrades, laterGross);

  const intervalDiffMinutes = laterCadence.averageIntervalMinutes - earlierCadence.averageIntervalMinutes;
  const positionSizeDiffCents = laterSizing.averagePositionSizeCents - earlierSizing.averagePositionSizeCents;
  const switchingDiffPercentage = Number(
    (laterSwitching.assetSwitchingPercentage - earlierSwitching.assetSwitchingPercentage).toFixed(1)
  );
  const topAssetRatioDiffPercentage = Number(
    (laterConcentration.topAssetRatio - earlierConcentration.topAssetRatio).toFixed(1)
  );

  const facts = [
    `Average interval between trades changed from ${earlierCadence.averageIntervalMinutes} min to ${laterCadence.averageIntervalMinutes} min (${intervalDiffMinutes >= 0 ? '+' : ''}${intervalDiffMinutes} min).`,
    `Average position size changed from ${earlierSizing.averagePositionSize} to ${laterSizing.averagePositionSize} (${positionSizeDiffCents >= 0 ? '+' : ''}${formatUSDFromCents(positionSizeDiffCents)}).`,
    `Asset switching frequency changed from ${earlierSwitching.assetSwitchingPercentage}% to ${laterSwitching.assetSwitchingPercentage}% (${switchingDiffPercentage >= 0 ? '+' : ''}${switchingDiffPercentage}%).`,
    `Top asset gross trading-volume ratio changed from ${earlierConcentration.topAssetRatio}% to ${laterConcentration.topAssetRatio}% (${topAssetRatioDiffPercentage >= 0 ? '+' : ''}${topAssetRatioDiffPercentage}%).`,
  ];

  return {
    hasComparison: true,
    earlierPeriod: {
      tradeCount: earlierTrades.length,
      averageIntervalMinutes: earlierCadence.averageIntervalMinutes,
      averagePositionSizeCents: earlierSizing.averagePositionSizeCents,
      averagePositionSize: earlierSizing.averagePositionSize,
      assetSwitchingPercentage: earlierSwitching.assetSwitchingPercentage,
      topAsset: earlierConcentration.topAsset,
      topAssetRatio: earlierConcentration.topAssetRatio,
    },
    laterPeriod: {
      tradeCount: laterTrades.length,
      averageIntervalMinutes: laterCadence.averageIntervalMinutes,
      averagePositionSizeCents: laterSizing.averagePositionSizeCents,
      averagePositionSize: laterSizing.averagePositionSize,
      assetSwitchingPercentage: laterSwitching.assetSwitchingPercentage,
      topAsset: laterConcentration.topAsset,
      topAssetRatio: laterConcentration.topAssetRatio,
    },
    deltas: {
      intervalDiffMinutes,
      positionSizeDiffCents,
      positionSizeDiff: formatUSDFromCents(positionSizeDiffCents),
      switchingDiffPercentage,
      topAssetRatioDiffPercentage,
    },
    facts,
  };
}

/**
 * Builds empty behavioral analytics object with safe defaults for 0-trade state.
 * @returns {Object}
 */
function buildEmptyBehavioralAnalytics() {
  return {
    dataState: 'EMPTY',
    tradeCount: 0,
    analyzedAt: new Date().toISOString(),
    cadence: {
      tradingSpanDays: 1,
      tradesPerDay: 0,
      tradesPerWeek: 0,
      averageIntervalMinutes: 0,
      medianIntervalMinutes: 0,
      shortestIntervalMinutes: 0,
      longestIntervalMinutes: 0,
      rapidActivityWindowsCount: 0,
    },
    holdingDuration: {
      averageHoldingDurationSeconds: 0,
      averageHoldingDurationMinutes: 0,
      medianHoldingDurationSeconds: 0,
      medianHoldingDurationMinutes: 0,
      closedPositionsCount: 0,
      totalMatchedUnits: 0,
    },
    orderDistribution: {
      buyCount: 0,
      sellCount: 0,
      buyPercentage: 0,
      sellPercentage: 0,
      assetSwitchingCount: 0,
      assetSwitchingPercentage: 0,
    },
    concentration: {
      topAsset: null,
      topAssetRatio: 0,
      assetBreakdown: [],
    },
    positionSizing: {
      distribution: POSITION_SIZE_BRACKETS.map((b) => ({
        id: b.id,
        label: b.label,
        minCents: b.minCents,
        maxCents: b.maxCents,
        count: 0,
        percentage: 0,
        volumeCents: 0,
        volumeUSD: '$0.00',
      })),
      averagePositionSizeCents: 0,
      averagePositionSize: '$0.00',
      largestPositionSizeCents: 0,
      largestPositionSize: '$0.00',
      smallestPositionSizeCents: 0,
      smallestPositionSize: '$0.00',
    },
    repeatedPatterns: {
      maxConsecutiveBuys: 0,
      maxConsecutiveSells: 0,
      repeatedBuySequencesCount: 0,
    },
    periodComparison: {
      hasComparison: false,
      reason: 'At least 4 executed trades are required for period comparison.',
    },
  };
}

/**
 * Analyzes the authenticated user's historical trades deterministically.
 *
 * @param {string|Object} userId - Authenticated user's MongoDB ObjectId
 * @returns {Promise<Object>} Analysis summary containing metrics, observations, and data state
 */
async function getUserTradeAnalysis(userId) {
  if (!userId) {
    const err = new Error('User authentication identity is required.');
    err.status = 401;
    throw err;
  }

  // 1. Fetch user's executed trades ordered chronologically
  const trades = await Trade.find({ user: userId, status: 'EXECUTED' })
    .sort({ executedAt: 1 })
    .lean();

  const totalTrades = trades.length;
  const buyTrades = trades.filter((t) => t.side === 'BUY').length;
  const sellTrades = trades.filter((t) => t.side === 'SELL').length;

  const uniqueAssetsSet = new Set(trades.map((t) => t.symbol));
  const uniqueAssets = uniqueAssetsSet.size;
  const uniqueAssetSymbols = Array.from(uniqueAssetsSet);

  const grossVolumeCents = trades.reduce(
    (sum, t) => sum + (typeof t.grossValueCents === 'number' ? t.grossValueCents : 0),
    0
  );

  const metrics = {
    totalTrades,
    buyTrades,
    sellTrades,
    uniqueAssets,
    uniqueAssetSymbols,
    totalGrossVolumeCents: grossVolumeCents,
    totalGrossVolume: formatUSDFromCents(grossVolumeCents),
  };

  // Determine history state
  let dataState = 'SUFFICIENT';
  if (totalTrades === 0) {
    dataState = 'EMPTY';
  } else if (totalTrades < ANALYSIS_RULES.MIN_TRADES_FOR_SUFFICIENT_BEHAVIOR) {
    dataState = 'LOW_DATA';
  }

  const observations = [];

  // If user has zero trades, return empty state immediately (no manufactured observations)
  if (totalTrades === 0) {
    return {
      tradeCount: 0,
      analyzedAt: new Date().toISOString(),
      dataState,
      hasSufficientHistory: false,
      observations: [],
      metrics,
      behavioralAnalytics: buildEmptyBehavioralAnalytics(),
    };
  }

  // =========================================================================
  // RULE 1: OVERTRADING (High-Frequency Activity Window)
  // Definition: 3 or more trades executed within any 15-minute sliding window
  // =========================================================================
  let maxTradesInWindow = 0;
  const windowMs = ANALYSIS_RULES.OVERTRADING_WINDOW_MINUTES * 60 * 1000;

  for (let i = 0; i < totalTrades; i++) {
    const startTime = new Date(trades[i].executedAt).getTime();
    let count = 0;
    for (let j = i; j < totalTrades; j++) {
      const currentTime = new Date(trades[j].executedAt).getTime();
      if (currentTime - startTime <= windowMs) {
        count++;
      } else {
        break;
      }
    }
    if (count > maxTradesInWindow) {
      maxTradesInWindow = count;
    }
  }

  if (maxTradesInWindow >= ANALYSIS_RULES.OVERTRADING_TRADE_COUNT) {
    const def = CATEGORY_DEFINITIONS[ANALYSIS_CATEGORIES.OVERTRADING];
    observations.push({
      id: def.id,
      category: def.category,
      severity: def.severity,
      title: def.title,
      summary: def.summary,
      evidence: {
        maxTradesInWindow,
        windowMinutes: ANALYSIS_RULES.OVERTRADING_WINDOW_MINUTES,
        thresholdCount: ANALYSIS_RULES.OVERTRADING_TRADE_COUNT,
        description: `Your history contains ${maxTradesInWindow} trades executed within a ${ANALYSIS_RULES.OVERTRADING_WINDOW_MINUTES}-minute window (threshold: ${ANALYSIS_RULES.OVERTRADING_TRADE_COUNT} trades).`,
      },
      explanation: def.educationalExplanation,
      lessonId: def.lessonId,
      lessonTitle: def.lessonTitle,
    });
  }

  // =========================================================================
  // RULE 2: RAPID_ENTRY_EXIT (Rapid Entry and Exit Sequence)
  // Definition: A BUY followed by a SELL of the same asset within 30 minutes
  // =========================================================================
  let rapidSequenceFound = false;
  let rapidSequenceDetails = null;
  const rapidExitMs = ANALYSIS_RULES.RAPID_ENTRY_EXIT_MINUTES * 60 * 1000;

  for (let i = 0; i < totalTrades && !rapidSequenceFound; i++) {
    if (trades[i].side === 'BUY') {
      const buyTime = new Date(trades[i].executedAt).getTime();
      const buySymbol = trades[i].symbol;

      for (let j = i + 1; j < totalTrades; j++) {
        if (trades[j].symbol === buySymbol && trades[j].side === 'SELL') {
          const sellTime = new Date(trades[j].executedAt).getTime();
          const elapsedMs = sellTime - buyTime;

          if (elapsedMs <= rapidExitMs) {
            rapidSequenceFound = true;
            const elapsedMinutes = Math.max(1, Math.round(elapsedMs / 60000));
            rapidSequenceDetails = {
              symbol: buySymbol,
              elapsedMinutes,
              thresholdMinutes: ANALYSIS_RULES.RAPID_ENTRY_EXIT_MINUTES,
              description: `A simulated BUY order for ${buySymbol} was followed by a SELL order approximately ${elapsedMinutes} minute(s) later (threshold: ${ANALYSIS_RULES.RAPID_ENTRY_EXIT_MINUTES} minutes).`,
            };
            break;
          }
        }
      }
    }
  }

  if (rapidSequenceFound && rapidSequenceDetails) {
    const def = CATEGORY_DEFINITIONS[ANALYSIS_CATEGORIES.RAPID_ENTRY_EXIT];
    observations.push({
      id: def.id,
      category: def.category,
      severity: def.severity,
      title: def.title,
      summary: def.summary,
      evidence: rapidSequenceDetails,
      explanation: def.educationalExplanation,
      lessonId: def.lessonId,
      lessonTitle: def.lessonTitle,
    });
  }

  // =========================================================================
  // RULE 3: CONCENTRATION (Historical Trading-Volume Concentration)
  // Definition: When total historical trades >= 3, a single asset represents
  // >= 60% of total historical gross trading volume.
  // CRITICAL: This is trading-volume concentration, NOT portfolio allocation.
  // =========================================================================
  if (totalTrades >= ANALYSIS_RULES.MIN_TRADES_FOR_CONCENTRATION && grossVolumeCents > 0) {
    const volumeByAsset = {};
    for (const t of trades) {
      const val = typeof t.grossValueCents === 'number' ? t.grossValueCents : 0;
      volumeByAsset[t.symbol] = (volumeByAsset[t.symbol] || 0) + val;
    }

    let topAsset = null;
    let topVolume = 0;
    for (const [sym, vol] of Object.entries(volumeByAsset)) {
      if (vol > topVolume) {
        topVolume = vol;
        topAsset = sym;
      }
    }

    const volumePercentage = Math.round((topVolume / grossVolumeCents) * 100);

    if (topAsset && volumePercentage >= ANALYSIS_RULES.CONCENTRATION_PERCENT) {
      const def = CATEGORY_DEFINITIONS[ANALYSIS_CATEGORIES.CONCENTRATION];
      observations.push({
        id: def.id,
        category: def.category,
        severity: def.severity,
        title: def.title,
        summary: def.summary,
        evidence: {
          asset: topAsset,
          assetVolumeCents: topVolume,
          assetVolume: formatUSDFromCents(topVolume),
          totalGrossVolumeCents: grossVolumeCents,
          totalGrossVolume: formatUSDFromCents(grossVolumeCents),
          volumePercentage,
          thresholdPercent: ANALYSIS_RULES.CONCENTRATION_PERCENT,
          description: `${topAsset} represented ${volumePercentage}% of your total historical gross simulated trading volume (threshold: ${ANALYSIS_RULES.CONCENTRATION_PERCENT}%). Note: this reflects historical trading activity distribution, not portfolio allocation.`,
        },
        explanation: def.educationalExplanation,
        lessonId: def.lessonId,
        lessonTitle: def.lessonTitle,
      });
    }
  }

  // =========================================================================
  // RULE 4: POSITION_SIZING (Large Trade Relative to Starting Balance)
  // Definition: Any single trade with grossValueCents >= 500,000 ($5,000 / 50%
  // of the original $10,000 virtual starting capital).
  // CRITICAL: This is an educational proxy based on the original starting balance,
  // NOT a reconstruction of portfolio allocation at execution time.
  // =========================================================================
  const largeTrades = trades.filter(
    (t) => typeof t.grossValueCents === 'number' && t.grossValueCents >= ANALYSIS_RULES.LARGE_POSITION_CENTS
  );

  if (largeTrades.length > 0) {
    const def = CATEGORY_DEFINITIONS[ANALYSIS_CATEGORIES.POSITION_SIZING];
    const largestTradeCents = Math.max(...largeTrades.map((t) => t.grossValueCents));
    const largestPercentOfStarting = Math.round(
      (largestTradeCents / ANALYSIS_RULES.INITIAL_PORTFOLIO_CENTS) * 100
    );

    observations.push({
      id: def.id,
      category: def.category,
      severity: def.severity,
      title: def.title,
      summary: def.summary,
      evidence: {
        qualifyingTradeCount: largeTrades.length,
        largestTradeCents,
        largestTradeValue: formatUSDFromCents(largestTradeCents),
        startingBalanceProxyCents: ANALYSIS_RULES.INITIAL_PORTFOLIO_CENTS,
        startingBalanceProxy: formatUSDFromCents(ANALYSIS_RULES.INITIAL_PORTFOLIO_CENTS),
        percentageOfStartingCapital: largestPercentOfStarting,
        thresholdPercent: ANALYSIS_RULES.LARGE_POSITION_PERCENT,
        description: `${largeTrades.length} historical trade(s) had an execution value representing at least 50% of the original $10,000 virtual starting capital proxy (largest: ${formatUSDFromCents(largestTradeCents)} or ${largestPercentOfStarting}% of starting balance).`,
      },
      explanation: def.educationalExplanation,
      lessonId: def.lessonId,
      lessonTitle: def.lessonTitle,
    });
  }

  // =========================================================================
  // RULE 5: FOMO_PATTERN (Potential FOMO-Style Entry Pattern)
  // Definition: 2 or more sequential rapid BUY trades on the same asset within 10 minutes
  // CRITICAL: FOMO cannot be proven; this is strictly an educational pattern.
  // =========================================================================
  let fomoPatternFound = false;
  let fomoDetails = null;
  const fomoWindowMs = ANALYSIS_RULES.FOMO_WINDOW_MINUTES * 60 * 1000;

  for (let i = 0; i < totalTrades - 1 && !fomoPatternFound; i++) {
    if (trades[i].side === 'BUY') {
      const firstBuyTime = new Date(trades[i].executedAt).getTime();
      const firstSymbol = trades[i].symbol;
      let sequentialBuys = 1;

      for (let j = i + 1; j < totalTrades; j++) {
        const nextTime = new Date(trades[j].executedAt).getTime();
        if (nextTime - firstBuyTime <= fomoWindowMs) {
          if (trades[j].symbol === firstSymbol) {
            if (trades[j].side === 'SELL') {
              // An intervening SELL on the same asset breaks the consecutive BUY sequence
              break;
            } else if (trades[j].side === 'BUY') {
              sequentialBuys++;
            }
          }
        } else {
          break;
        }
      }

      if (sequentialBuys >= ANALYSIS_RULES.FOMO_BUY_COUNT) {
        fomoPatternFound = true;
        fomoDetails = {
          symbol: firstSymbol,
          buyCount: sequentialBuys,
          windowMinutes: ANALYSIS_RULES.FOMO_WINDOW_MINUTES,
          thresholdCount: ANALYSIS_RULES.FOMO_BUY_COUNT,
          description: `Your trade history contains ${sequentialBuys} rapid sequential BUY trades for ${firstSymbol} within a ${ANALYSIS_RULES.FOMO_WINDOW_MINUTES}-minute window without an intervening sell. This represents a pattern that can be associated with FOMO-style behavior.`,
        };
        break;
      }
    }
  }

  if (fomoPatternFound && fomoDetails) {
    const def = CATEGORY_DEFINITIONS[ANALYSIS_CATEGORIES.FOMO_PATTERN];
    observations.push({
      id: def.id,
      category: def.category,
      severity: def.severity,
      title: def.title,
      summary: def.summary,
      evidence: fomoDetails,
      explanation: def.educationalExplanation,
      lessonId: def.lessonId,
      lessonTitle: def.lessonTitle,
    });
  }

  // =========================================================================
  // PHASE 23: ADVANCED BEHAVIORAL ANALYTICS
  // Purely descriptive, factual, database-verifiable historical analytics.
  // ZERO financial ranking, ZERO psychological speculation.
  // =========================================================================
  const holdingDuration = calculateHoldingDurationFIFO(trades);
  const cadence = calculateCadenceAndIntervals(trades);
  const rapidActivityWindowsCount = calculateRapidActivityWindows(trades);
  const assetSwitching = calculateAssetSwitching(trades);
  const concentration = calculateVolumeConcentration(trades, grossVolumeCents);
  const positionSizing = calculatePositionSizeDistribution(trades, grossVolumeCents);
  const repeatedPatterns = calculateRepeatedPatterns(trades);
  const periodComparison = calculatePeriodComparison(trades);

  const buyPercentage = totalTrades > 0 ? Number(((buyTrades / totalTrades) * 100).toFixed(1)) : 0;
  const sellPercentage = totalTrades > 0 ? Number(((sellTrades / totalTrades) * 100).toFixed(1)) : 0;

  const behavioralAnalytics = {
    dataState,
    tradeCount: totalTrades,
    analyzedAt: new Date().toISOString(),
    cadence: {
      tradingSpanDays: cadence.tradingSpanDays,
      tradesPerDay: cadence.tradesPerDay,
      tradesPerWeek: cadence.tradesPerWeek,
      averageIntervalMinutes: cadence.averageIntervalMinutes,
      medianIntervalMinutes: cadence.medianIntervalMinutes,
      shortestIntervalMinutes: cadence.shortestIntervalMinutes,
      longestIntervalMinutes: cadence.longestIntervalMinutes,
      rapidActivityWindowsCount,
    },
    holdingDuration,
    orderDistribution: {
      buyCount: buyTrades,
      sellCount: sellTrades,
      buyPercentage,
      sellPercentage,
      assetSwitchingCount: assetSwitching.assetSwitchingCount,
      assetSwitchingPercentage: assetSwitching.assetSwitchingPercentage,
    },
    concentration,
    positionSizing,
    repeatedPatterns,
    periodComparison,
  };

  return {
    tradeCount: totalTrades,
    analyzedAt: new Date().toISOString(),
    dataState,
    hasSufficientHistory: totalTrades >= ANALYSIS_RULES.MIN_TRADES_FOR_FULL_EVALUATION,
    observations,
    metrics,
    behavioralAnalytics,
  };
}

/**
 * Dedicated endpoint helper for Phase 23 behavioral analytics.
 * @param {string|Object} userId
 * @returns {Promise<Object>}
 */
async function getUserBehavioralAnalytics(userId) {
  const analysis = await getUserTradeAnalysis(userId);
  return {
    dataState: analysis.dataState,
    tradeCount: analysis.tradeCount,
    analyzedAt: analysis.analyzedAt,
    metrics: analysis.metrics,
    observations: analysis.observations,
    behavioralAnalytics: analysis.behavioralAnalytics,
  };
}

module.exports = {
  getUserTradeAnalysis,
  getUserBehavioralAnalytics,
  calculateHoldingDurationFIFO,
  calculateCadenceAndIntervals,
  calculateRapidActivityWindows,
  calculateAssetSwitching,
  calculatePositionSizeDistribution,
  calculateVolumeConcentration,
  calculateRepeatedPatterns,
  calculatePeriodComparison,
  formatUSDFromCents,
};
