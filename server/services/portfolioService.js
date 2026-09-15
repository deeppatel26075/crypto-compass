/**
 * Crypto Compass — Portfolio Service (Phase 11)
 *
 * Provides a server-authoritative, read-only view of a user's simulated portfolio:
 * - Current virtual cash balance from real Phase 5 Wallet (Strictly NO auto-creation)
 * - Current active crypto holdings (quantity > 0)
 * - Live market valuation using Phase 7 marketService
 * - Exact BigInt financial precision (10^-8 base units and integer cents)
 * - Asset & cash allocation percentages (descriptive only, zero advice/judgment)
 * - Zero P&L calculations (no profit, loss, ROI, or unrealized/realized gains)
 * - Honest market-data state (stale vs unavailable)
 * - Strictly 100% read-only (zero database writes)
 */

const Wallet = require('../models/Wallet');
const Holding = require('../models/Holding');
const marketService = require('./marketService');
const {
  parsePriceToCents,
  parseCryptoToUnits,
  unitsToCryptoString,
  calculateGrossValueCents,
} = require('../utils/decimalMath');

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
 * Retrieve the current portfolio composition for the authenticated user.
 *
 * @param {string} userId - Authenticated user ObjectId
 * @returns {Promise<Object>} Safe portfolio representation
 */
async function getPortfolio(userId) {
  if (!userId) {
    const err = new Error('User ID is required to retrieve portfolio.');
    err.status = 401;
    throw err;
  }

  // 1. Fetch User's Real Wallet (Strictly NO auto-creation or defaulting)
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    const err = new Error('Virtual wallet not found for this account. Please complete onboarding.');
    err.status = 404;
    err.code = 'WALLET_NOT_FOUND';
    throw err;
  }

  // Authoritative cash balance in integer cents
  const cashBalanceCentsBig = BigInt(wallet.cashBalanceCents);
  const cashBalanceCentsNum = Number(cashBalanceCentsBig);

  // 2. Fetch User's Active Holdings (quantity > 0)
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

  // 3. Fetch Server-Authoritative Market Data via marketService
  let markets = [];
  let isMarketDataStale = false;
  let isMarketServiceError = false;

  try {
    const marketResult = await marketService.getMarkets();
    if (marketResult && Array.isArray(marketResult.markets)) {
      markets = marketResult.markets;
      isMarketDataStale = Boolean(marketResult.isStale);
    }
  } catch (err) {
    isMarketServiceError = true;
  }

  // Map market symbols to market assets
  const marketMap = new Map();
  for (const m of markets) {
    if (m && m.symbol) {
      marketMap.set(m.symbol.toUpperCase(), m);
    }
  }

  // 4. Value Each Active Holding
  let totalCryptoValueCentsBig = 0n;
  let hasUnavailablePrices = false;
  const processedHoldings = [];

  for (const item of activeHoldings) {
    const { record, units, quantityStr } = item;
    const sym = record.symbol.toUpperCase();
    const marketAsset = marketMap.get(sym);

    const hasUsablePrice =
      !isMarketServiceError &&
      marketAsset &&
      typeof marketAsset.currentPrice === 'number' &&
      marketAsset.currentPrice > 0;

    let priceCentsBig = null;
    let marketValCentsBig = null;
    let priceAvailable = false;

    if (hasUsablePrice) {
      priceAvailable = true;
      priceCentsBig = parsePriceToCents(marketAsset.currentPrice);
      marketValCentsBig = calculateGrossValueCents(units, priceCentsBig);
      totalCryptoValueCentsBig += marketValCentsBig;
    } else {
      hasUnavailablePrices = true;
      priceAvailable = false;
    }

    // Phase 19: Cost basis represents historical acquisition cost of current quantity
    const avgBuyPriceCentsBig = BigInt(record.averageBuyPriceCents);
    const costBasisCentsBig = calculateGrossValueCents(units, avgBuyPriceCentsBig);
    const costBasisCents = Number(costBasisCentsBig);

    let profitLossCents = null;
    let profitLoss = null;
    let profitLossPercentage = null;

    if (priceAvailable && marketValCentsBig !== null) {
      const pnlCentsBig = marketValCentsBig - costBasisCentsBig;
      profitLossCents = Number(pnlCentsBig);
      profitLoss = formatUSDFromCents(pnlCentsBig);

      if (costBasisCentsBig > 0n) {
        const pctBasisPointsBig =
          (pnlCentsBig * 10000n + (pnlCentsBig >= 0n ? costBasisCentsBig / 2n : -costBasisCentsBig / 2n)) /
          costBasisCentsBig;
        profitLossPercentage = Number(pctBasisPointsBig) / 100;
      } else {
        // Zero cost basis guard: do not divide by zero, return null
        profitLossPercentage = null;
      }
    }

    processedHoldings.push({
      assetId: record.assetId,
      symbol: sym,
      name: record.name,
      quantity: quantityStr,
      image: marketAsset?.image || null,
      priceAvailable,
      isMarketDataStale: priceAvailable ? isMarketDataStale : false,
      currentPriceCents: priceAvailable ? Number(priceCentsBig) : null,
      currentPrice: priceAvailable ? formatUSDFromCents(priceCentsBig) : null,
      currentMarketValueCents: priceAvailable ? Number(marketValCentsBig) : null,
      currentMarketValue: priceAvailable ? formatUSDFromCents(marketValCentsBig) : null,
      averageBuyPriceCents: record.averageBuyPriceCents,
      averageBuyPrice: formatUSDFromCents(record.averageBuyPriceCents),
      costBasisCents,
      costBasis: formatUSDFromCents(costBasisCentsBig),
      profitLossCents,
      profitLoss,
      profitLossPercentage,
      _units: units,
      _marketValCentsBig: marketValCentsBig,
      _costBasisCentsBig: costBasisCentsBig,
    });
  }

  // 5. Aggregate Total Portfolio Value and Handle Partial Valuations
  const isTotalValuePartial = hasUnavailablePrices && activeHoldings.length > 0;
  let totalPortfolioValueCentsBig = null;
  let totalPortfolioValueCentsNum = null;
  let totalCryptoValueCentsNum = null;
  let totalCostBasisCentsBig = null;
  let totalCostBasisCentsNum = null;
  let totalProfitLossCentsNum = null;
  let totalProfitLoss = null;
  let totalProfitLossPercentage = null;

  if (!isTotalValuePartial) {
    totalCryptoValueCentsNum = Number(totalCryptoValueCentsBig);
    totalPortfolioValueCentsBig = cashBalanceCentsBig + totalCryptoValueCentsBig;
    totalPortfolioValueCentsNum = Number(totalPortfolioValueCentsBig);

    totalCostBasisCentsBig = processedHoldings.reduce(
      (sum, h) => sum + (h._costBasisCentsBig || 0n),
      0n
    );
    totalCostBasisCentsNum = Number(totalCostBasisCentsBig);

    if (activeHoldings.length > 0) {
      const totalPnlBig = totalCryptoValueCentsBig - totalCostBasisCentsBig;
      totalProfitLossCentsNum = Number(totalPnlBig);
      totalProfitLoss = formatUSDFromCents(totalPnlBig);

      if (totalCostBasisCentsBig > 0n) {
        const totalPctBasisPointsBig =
          (totalPnlBig * 10000n + (totalPnlBig >= 0n ? totalCostBasisCentsBig / 2n : -totalCostBasisCentsBig / 2n)) /
          totalCostBasisCentsBig;
        totalProfitLossPercentage = Number(totalPctBasisPointsBig) / 100;
      }
    }
  }

  // 6. Compute Allocation Percentages (Descriptive Only)
  let cashAllocationPercent = 100.0;
  let cryptoAllocationPercent = 0.0;

  if (!isTotalValuePartial && totalPortfolioValueCentsBig > 0n) {
    // Exact rounding to 2 decimal places using BigInt
    cashAllocationPercent =
      Number((cashBalanceCentsBig * 10000n + totalPortfolioValueCentsBig / 2n) / totalPortfolioValueCentsBig) / 100;
    cryptoAllocationPercent =
      Number((totalCryptoValueCentsBig * 10000n + totalPortfolioValueCentsBig / 2n) / totalPortfolioValueCentsBig) / 100;
  } else if (isTotalValuePartial) {
    cashAllocationPercent = null;
    cryptoAllocationPercent = null;
  }

  // Calculate individual holding allocations
  const holdingsFinal = processedHoldings.map((h) => {
    let portfolioAllocationPercent = null;
    let cryptoAllocationPercent = null;

    if (!isTotalValuePartial && totalPortfolioValueCentsBig > 0n && h.priceAvailable && h._marketValCentsBig !== null) {
      portfolioAllocationPercent =
        Number((h._marketValCentsBig * 10000n + totalPortfolioValueCentsBig / 2n) / totalPortfolioValueCentsBig) / 100;
      cryptoAllocationPercent =
        totalCryptoValueCentsBig > 0n
          ? Number((h._marketValCentsBig * 10000n + totalCryptoValueCentsBig / 2n) / totalCryptoValueCentsBig) / 100
          : 0;
    }

    // Clean internal properties before returning
    const { _units, _marketValCentsBig, _costBasisCentsBig, ...safeHolding } = h;
    return {
      ...safeHolding,
      portfolioAllocationPercent,
      cryptoAllocationPercent,
    };
  });

  return {
    cash: {
      balanceCents: cashBalanceCentsNum,
      balance: formatUSDFromCents(cashBalanceCentsBig),
      allocationPercent: cashAllocationPercent,
    },
    cryptoValueCents: totalCryptoValueCentsNum,
    cryptoValue: totalCryptoValueCentsNum !== null ? formatUSDFromCents(totalCryptoValueCentsBig) : null,
    cryptoAllocationPercent,
    totalCostBasisCents: totalCostBasisCentsNum,
    totalCostBasis: totalCostBasisCentsNum !== null ? formatUSDFromCents(totalCostBasisCentsBig) : null,
    totalProfitLossCents: totalProfitLossCentsNum,
    totalProfitLoss,
    totalProfitLossPercentage,
    totalPortfolioValueCents: totalPortfolioValueCentsNum,
    totalPortfolioValue: totalPortfolioValueCentsNum !== null ? formatUSDFromCents(totalPortfolioValueCentsBig) : null,
    isTotalValuePartial,
    isMarketDataStale,
    holdingsCount: holdingsFinal.length,
    holdings: holdingsFinal,
  };
}

module.exports = {
  getPortfolio,
  formatUSDFromCents,
};
