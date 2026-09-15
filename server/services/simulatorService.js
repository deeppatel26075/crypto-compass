const Holding = require('../models/Holding');
const Wallet = require('../models/Wallet');
const marketService = require('./marketService');
const {
  parsePriceToCents,
  parseCryptoToUnits,
  unitsToCryptoString,
  calculateGrossValueCents,
} = require('../utils/decimalMath');

/**
 * Crypto Compass — What-If Simulator Service (Phase 16)
 *
 * Provides completely read-only, ephemeral mathematical calculations
 * illustrating hypothetical portfolio value under user-specified price changes.
 *
 * Strictly educational: ZERO trading execution, ZERO wallet mutation, ZERO predictions.
 */

/**
 * Format integer cents into standard USD string (e.g. 950000 -> "$9,500.00")
 * @param {number|bigint|null} cents
 * @returns {string|null}
 */
function formatUSDFromCents(cents) {
  if (cents === null || cents === undefined) return null;
  const num = typeof cents === 'bigint' ? Number(cents) : cents;
  const dollars = (num / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `$${dollars}`;
}

/**
 * Format integer cents into signed USD string (e.g. 50000 -> "+$500.00", -2500 -> "-$25.00")
 * @param {number|bigint|null} cents
 * @returns {string|null}
 */
function formatSignedUSDFromCents(cents) {
  if (cents === null || cents === undefined) return null;
  const num = typeof cents === 'bigint' ? Number(cents) : cents;
  if (num === 0) return '$0.00';
  const sign = num > 0 ? '+' : '-';
  const absNum = Math.abs(num);
  const dollars = (absNum / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}$${dollars}`;
}

/**
 * Validates and normalizes percentageChange input according to Phase 16 strict specifications:
 * - Must be a finite number (no NaN, Infinity, strings)
 * - Range: [-90, +500]
 * - At most 2 decimal places
 *
 * @param {any} percentageChange
 * @returns {{ normalizedPct: number, pctBps: bigint }}
 */
function validatePercentageChange(percentageChange) {
  if (typeof percentageChange !== 'number' || !Number.isFinite(percentageChange)) {
    const err = new Error('Percentage change must be a valid finite number.');
    err.status = 400;
    err.code = 'INVALID_PERCENTAGE';
    throw err;
  }

  if (percentageChange < -90 || percentageChange > 500) {
    const err = new Error('Percentage change must be between -90% and +500%.');
    err.status = 400;
    err.code = 'PERCENTAGE_OUT_OF_RANGE';
    throw err;
  }

  // Check decimal precision (at most 2 decimal places allowed)
  const str = percentageChange.toString();
  const parts = str.split('.');
  if (parts[1] && parts[1].length > 2) {
    const err = new Error('Percentage change cannot have more than 2 decimal places.');
    err.status = 400;
    err.code = 'INVALID_PERCENTAGE_PRECISION';
    throw err;
  }

  const normalizedPct = Number(percentageChange.toFixed(2));
  // Convert percentage to basis points (hundredths of a percent): e.g. 10.55% -> 1055n
  const pctBps = BigInt(Math.round(normalizedPct * 100));

  return { normalizedPct, pctBps };
}

/**
 * Retrieve user's current holdings with server-authoritative market prices
 * for the simulator. Handles partial/unavailable market data independently per holding.
 *
 * @param {string|Object} userId
 */
async function getUserSimulatorHoldings(userId) {
  if (!userId) {
    const err = new Error('User ID is required.');
    err.status = 401;
    throw err;
  }

  // 1. Fetch user's active holdings
  const rawHoldings = await Holding.find({ user: userId }).sort({ symbol: 1 });
  const activeHoldings = [];

  for (const h of rawHoldings) {
    try {
      const units = parseCryptoToUnits(h.quantity);
      if (units > 0n) {
        activeHoldings.push({
          record: h,
          units,
          quantityStr: unitsToCryptoString(units),
        });
      }
    } catch {
      // Ignore corrupted or non-numeric holding quantities safely
    }
  }

  // 2. Fetch server-authoritative market data via marketService
  let markets = [];
  let isMarketDataStale = false;

  try {
    const marketResult = await marketService.getMarkets();
    if (marketResult && Array.isArray(marketResult.markets)) {
      markets = marketResult.markets;
      isMarketDataStale = Boolean(marketResult.isStale);
    }
  } catch {
    // Market service error will cause priceAvailable = false for holdings
  }

  const marketMap = new Map();
  markets.forEach((m) => {
    if (m && m.symbol) {
      marketMap.set(m.symbol.toUpperCase(), m);
    }
  });

  // 3. Process each holding independently
  const holdings = activeHoldings.map(({ record, units, quantityStr }) => {
    const marketAsset = marketMap.get(record.symbol.toUpperCase());
    const hasValidPrice =
      marketAsset &&
      typeof marketAsset.currentPrice === 'number' &&
      marketAsset.currentPrice > 0;

    if (hasValidPrice) {
      try {
        const priceCentsBig = parsePriceToCents(marketAsset.currentPrice);
        const valueCentsBig = calculateGrossValueCents(units, priceCentsBig);
        const priceCents = Number(priceCentsBig);
        const valueCents = Number(valueCentsBig);

        return {
          symbol: record.symbol,
          name: record.name,
          assetId: record.assetId,
          quantity: quantityStr,
          quantityBaseUnits: units.toString(),
          quantitySats: units.toString(),
          currentPriceCents: priceCents,
          currentPrice: formatUSDFromCents(priceCents),
          currentValueCents: valueCents,
          currentValue: formatUSDFromCents(valueCents),
          priceAvailable: true,
          isMarketDataStale,
          marketStatus: isMarketDataStale ? 'stale' : 'fresh',
        };
      } catch {
        // Fall through to unavailable if math error
      }
    }

    // Explicit unavailable state: Never substitute $0
    return {
      symbol: record.symbol,
      name: record.name,
      assetId: record.assetId,
      quantity: quantityStr,
      quantityBaseUnits: units.toString(),
      quantitySats: units.toString(),
      currentPriceCents: null,
      currentPrice: null,
      currentValueCents: null,
      currentValue: null,
      priceAvailable: false,
      isMarketDataStale: false,
      marketStatus: 'unavailable',
    };
  });

  const wallet = await Wallet.findOne({ user: userId }).lean();
  const cashBalanceCents = typeof wallet?.cashBalanceCents === 'number' ? wallet.cashBalanceCents : 1000000;
  let totalHoldingsValueCents = 0;
  for (const h of holdings) {
    if (h.priceAvailable && typeof h.currentValueCents === 'number') {
      totalHoldingsValueCents += h.currentValueCents;
    }
  }
  const totalPortfolioValueCents = cashBalanceCents + totalHoldingsValueCents;

  return {
    holdings,
    totalCount: holdings.length,
    cashBalanceCents,
    cashBalance: formatUSDFromCents(cashBalanceCents),
    totalHoldingsValueCents,
    totalPortfolioValueCents,
    totalPortfolioValue: formatUSDFromCents(totalPortfolioValueCents),
  };
}

/**
 * Calculate deterministic hypothetical portfolio outcome for a specific holding
 * under a user-specified percentage change.
 *
 * @param {string|Object} userId
 * @param {string} symbol
 * @param {number} percentageChange
 */
async function calculateHypotheticalOutcome(userId, symbol, percentageChange, marketSvc = marketService) {
  if (!userId) {
    const err = new Error('User ID is required.');
    err.status = 401;
    throw err;
  }

  if (!symbol || typeof symbol !== 'string') {
    const err = new Error('Asset symbol is required.');
    err.status = 400;
    err.code = 'INVALID_SYMBOL';
    throw err;
  }

  const cleanSymbol = symbol.trim().toUpperCase();

  // 1. Validate percentage precision and range
  const { normalizedPct, pctBps } = validatePercentageChange(percentageChange);

  // 2. Fetch and verify user holding
  const holding = await Holding.findOne({ user: userId, symbol: cleanSymbol });
  if (!holding) {
    const err = new Error(`You do not hold asset "${cleanSymbol}".`);
    err.status = 400;
    err.code = 'HOLDING_NOT_FOUND';
    throw err;
  }

  const quantityUnits = parseCryptoToUnits(holding.quantity);
  if (quantityUnits <= 0n) {
    const err = new Error(`You have no active balance for asset "${cleanSymbol}".`);
    err.status = 400;
    err.code = 'ZERO_HOLDING_QUANTITY';
    throw err;
  }

  // 3. Obtain current server-authoritative market price
  const marketResult = await marketSvc.getMarketBySymbol(cleanSymbol);
  if (
    !marketResult ||
    !marketResult.asset ||
    typeof marketResult.asset.currentPrice !== 'number' ||
    marketResult.asset.currentPrice <= 0
  ) {
    const err = new Error('Current market price unavailable for this asset.');
    err.status = 400;
    err.code = 'MARKET_PRICE_UNAVAILABLE';
    err.priceAvailable = false;
    throw err;
  }

  const currentPriceCentsBig = parsePriceToCents(marketResult.asset.currentPrice);
  const isMarketDataStale = Boolean(marketResult.isStale);

  // 4. Exact BigInt Calculation
  // currentValueCents = (quantityUnits * currentPriceCents + 50_000_000n) / 100_000_000n
  const currentValueCentsBig = calculateGrossValueCents(quantityUnits, currentPriceCentsBig);

  // multiplier = 10,000n + pctBps (where 10,000n represents 100.00%)
  const multiplier = 10000n + pctBps;

  // hypotheticalPriceCents = (currentPriceCents * multiplier + 5000n) / 10000n
  const hypotheticalPriceCentsBig = (currentPriceCentsBig * multiplier + 5000n) / 10000n;

  // hypotheticalValueCents = (quantityUnits * hypotheticalPriceCents + 50_000_000n) / 100_000_000n
  const hypotheticalValueCentsBig = calculateGrossValueCents(quantityUnits, hypotheticalPriceCentsBig);

  // hypotheticalChangeCents = hypotheticalValueCents - currentValueCents
  const hypotheticalChangeCentsBig = hypotheticalValueCentsBig - currentValueCentsBig;

  const currentPriceCents = Number(currentPriceCentsBig);
  const hypotheticalPriceCents = Number(hypotheticalPriceCentsBig);
  const currentValueCents = Number(currentValueCentsBig);
  const hypotheticalValueCents = Number(hypotheticalValueCentsBig);
  const hypotheticalChangeCents = Number(hypotheticalChangeCentsBig);

  // 5. Total portfolio impact calculation
  const wallet = await Wallet.findOne({ user: userId }).lean();
  const cashBalanceCents = typeof wallet?.cashBalanceCents === 'number' ? wallet.cashBalanceCents : 0;

  const allHoldings = await Holding.find({ user: userId }).lean();
  let otherHoldingsValueCents = 0;
  for (const h of allHoldings) {
    if (h.symbol !== cleanSymbol) {
      try {
        const otherMarket = await marketService.getMarketBySymbol(h.symbol).catch(() => null);
        if (otherMarket?.asset?.currentPrice) {
          const u = parseCryptoToUnits(h.quantity);
          const p = parsePriceToCents(otherMarket.asset.currentPrice);
          otherHoldingsValueCents += Number(calculateGrossValueCents(u, p));
        }
      } catch {
        // Skip invalid other holdings in total
      }
    }
  }

  const totalCurrentPortfolioValueCents = cashBalanceCents + otherHoldingsValueCents + currentValueCents;
  const totalHypotheticalPortfolioValueCents = cashBalanceCents + otherHoldingsValueCents + hypotheticalValueCents;
  const portfolioAbsoluteChangeCents = hypotheticalChangeCents;
  const portfolioPercentageChange = totalCurrentPortfolioValueCents > 0
    ? Number(((hypotheticalChangeCents / totalCurrentPortfolioValueCents) * 100).toFixed(2))
    : 0;

  return {
    symbol: cleanSymbol,
    name: holding.name,
    quantity: unitsToCryptoString(quantityUnits),
    quantityBaseUnits: quantityUnits.toString(),
    quantitySats: quantityUnits.toString(),
    percentageChange: normalizedPct, // Server-returned normalized percentage actually used
    currentPriceCents,
    currentPrice: formatUSDFromCents(currentPriceCents),
    hypotheticalPriceCents,
    hypotheticalPrice: formatUSDFromCents(hypotheticalPriceCents),
    currentValueCents,
    currentValue: formatUSDFromCents(currentValueCents),
    hypotheticalValueCents,
    hypotheticalValue: formatUSDFromCents(hypotheticalValueCents),
    hypotheticalChangeCents,
    hypotheticalChange: formatSignedUSDFromCents(hypotheticalChangeCents),
    totalCurrentPortfolioValueCents,
    totalCurrentPortfolioValue: formatUSDFromCents(totalCurrentPortfolioValueCents),
    totalHypotheticalPortfolioValueCents,
    totalHypotheticalPortfolioValue: formatUSDFromCents(totalHypotheticalPortfolioValueCents),
    portfolioAbsoluteChangeCents,
    portfolioAbsoluteChange: formatSignedUSDFromCents(portfolioAbsoluteChangeCents),
    portfolioPercentageChange,
    priceAvailable: true,
    isMarketDataStale,
    marketStatus: isMarketDataStale ? 'stale' : 'fresh',
  };
}

module.exports = {
  getUserSimulatorHoldings,
  calculateHypotheticalOutcome,
  validatePercentageChange,
  formatUSDFromCents,
  formatSignedUSDFromCents,
};
