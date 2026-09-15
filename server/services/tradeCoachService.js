const Wallet = require('../models/Wallet');
const Holding = require('../models/Holding');
const marketService = require('./marketService');
const { ORDER_SIDES } = require('../constants/trading');
const { INITIAL_VIRTUAL_BALANCE_CENTS } = require('../constants/wallet');
const {
  EXPOSURE_LEVELS,
  getCashAllocationLevel,
  getConcentrationLevel,
  getOverallRiskExposure,
  EDUCATIONAL_DISCLAIMER,
} = require('../constants/tradeCoach');
const {
  parsePriceToCents,
  parseCryptoToUnits,
  unitsToCryptoString,
  calculateGrossValueCents,
} = require('../utils/decimalMath');

/**
 * Deterministic Trade Coach Analysis Service (Phase 10)
 *
 * Evaluates trade intent against server-authoritative live prices, virtual wallet,
 * and user holdings without performing any mutations or executing orders.
 * Strictly educational: zero financial advice, zero market predictions.
 *
 * @param {string} userId - Authenticated user ID
 * @param {Object} intent
 * @param {string} intent.symbol - Asset symbol (e.g. 'BTC')
 * @param {string} intent.side - 'BUY' | 'SELL'
 * @param {string|number} intent.quantity - Proposed crypto quantity
 * @returns {Promise<Object>} Structured pedagogical analysis response
 */
async function analyzeProposedTrade(userId, intent) {
  if (!userId) {
    const err = new Error('Authentication required.');
    err.status = 401;
    throw err;
  }

  const { symbol, side, quantity } = intent || {};

  // 1. Parameter Validation
  if (!symbol || typeof symbol !== 'string') {
    const err = new Error('Asset symbol is required.');
    err.status = 400;
    throw err;
  }
  const cleanSymbol = symbol.trim().toUpperCase();

  if (!side || !Object.values(ORDER_SIDES).includes(side)) {
    const err = new Error(`Order side must be ${ORDER_SIDES.BUY} or ${ORDER_SIDES.SELL}.`);
    err.status = 400;
    throw err;
  }

  // Parse and validate crypto quantity into BigInt base units (10^-8)
  let qtyUnits;
  try {
    qtyUnits = parseCryptoToUnits(quantity);
  } catch (parseErr) {
    const err = new Error(parseErr.message);
    err.status = 400;
    throw err;
  }

  // 2. Fetch Server-Authoritative Market Price (Client price is strictly ignored)
  let marketResult;
  try {
    marketResult = await marketService.getMarketBySymbol(cleanSymbol);
  } catch (mErr) {
    const err = new Error(`Asset symbol "${cleanSymbol}" is invalid or unsupported.`);
    err.status = 400;
    err.code = 'UNSUPPORTED_SYMBOL';
    throw err;
  }

  if (!marketResult || !marketResult.asset || typeof marketResult.asset.currentPrice !== 'number' || marketResult.asset.currentPrice <= 0) {
    const err = new Error(`Asset symbol "${cleanSymbol}" is unsupported or market data is unavailable.`);
    err.status = 400;
    err.code = 'MARKET_DATA_UNAVAILABLE';
    throw err;
  }

  const asset = marketResult.asset;
  const executionPriceCentsBig = parsePriceToCents(asset.currentPrice);
  const normalizedQuantityStr = unitsToCryptoString(qtyUnits);

  // 3. Proposed Trade Gross Value in Integer Cents
  const grossValueCentsBig = calculateGrossValueCents(qtyUnits, executionPriceCentsBig);
  const grossValueCentsNum = Number(grossValueCentsBig);

  // 4. Read User's Wallet and Current Holdings (Read-Only)
  const [walletRecord, userHoldings, allMarketsRes] = await Promise.all([
    Wallet.findOne({ user: userId }),
    Holding.find({ user: userId }),
    marketService.getMarkets().catch(() => ({ markets: [] })),
  ]);

  const availableCashCentsBig = walletRecord ? BigInt(walletRecord.cashBalanceCents) : BigInt(INITIAL_VIRTUAL_BALANCE_CENTS);
  const availableCashCentsNum = Number(availableCashCentsBig);

  // Price map from current market catalog for portfolio valuation
  const priceMap = new Map();
  if (Array.isArray(allMarketsRes.markets)) {
    for (const m of allMarketsRes.markets) {
      if (m.symbol && typeof m.currentPrice === 'number') {
        priceMap.set(m.symbol.toUpperCase(), parsePriceToCents(m.currentPrice));
      }
    }
  }

  // Compute current market value of all user's crypto holdings
  let totalCryptoPortfolioValueCentsBig = 0n;
  let currentAssetValueCentsBig = 0n;
  let userOwnedUnitsBig = 0n;

  for (const h of userHoldings) {
    const hSym = h.symbol.toUpperCase();
    const hUnits = parseCryptoToUnits(h.quantity);
    const hPriceCents = priceMap.get(hSym) || parsePriceToCents(h.averageBuyPriceCents / 100);
    const hValCents = calculateGrossValueCents(hUnits, hPriceCents);
    totalCryptoPortfolioValueCentsBig += hValCents;

    if (hSym === cleanSymbol) {
      currentAssetValueCentsBig = hValCents;
      userOwnedUnitsBig = hUnits;
    }
  }

  const isBuy = side === ORDER_SIDES.BUY;

  // 5. Conduct Analysis
  let cashAllocationPct = 0;
  let cashLevel = EXPOSURE_LEVELS.LOW;
  let postTradeConcentrationPct = 0;
  let concentrationLevel = EXPOSURE_LEVELS.LOW;
  let reductionPct = 0;
  let hasInsufficientCash = false;
  let hasInsufficientHoldings = false;
  const education = [];

  if (isBuy) {
    // A. Cash Allocation
    hasInsufficientCash = grossValueCentsBig > availableCashCentsBig;
    if (availableCashCentsBig > 0n) {
      cashAllocationPct = Math.min(100, Number((grossValueCentsBig * 10000n) / availableCashCentsBig) / 100);
    } else {
      cashAllocationPct = 100;
    }
    cashLevel = getCashAllocationLevel(cashAllocationPct);

    // B. Post-trade Holding Concentration (Clarification formula):
    // (current asset market value + proposed trade value) / (total current crypto portfolio market value + proposed trade value)
    const newAssetValCentsBig = currentAssetValueCentsBig + grossValueCentsBig;
    const newPortfolioValCentsBig = totalCryptoPortfolioValueCentsBig + grossValueCentsBig;

    if (newPortfolioValCentsBig > 0n) {
      postTradeConcentrationPct = Math.min(100, Number((newAssetValCentsBig * 10000n) / newPortfolioValCentsBig) / 100);
    } else {
      postTradeConcentrationPct = 100;
    }
    concentrationLevel = getConcentrationLevel(postTradeConcentrationPct);

    // C. Overall Risk Exposure
    const overallRisk = getOverallRiskExposure(cashLevel, concentrationLevel);

    // D. Educational Narrative
    education.push({
      topic: 'Position Sizing',
      title: `Position Sizing: ${cashLevel}`,
      message: `You are allocating approximately ${cashAllocationPct}% of your available virtual cash ($${(grossValueCentsNum / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) to this simulated trade. Position sizing measures how much capital is committed to a single decision. Larger allocations cause individual positions to exert greater influence on overall portfolio performance.`,
    });

    education.push({
      topic: 'Holding Concentration',
      title: `Concentration: ${concentrationLevel}`,
      message: `After this simulated purchase, ${cleanSymbol} would represent approximately ${postTradeConcentrationPct}% of your tracked crypto portfolio by current market value. High concentration means a larger proportion of simulated exposure is tied to the price movement of a single asset.`,
    });

    education.push({
      topic: 'Risk Exposure',
      title: `Educational Exposure: ${overallRisk}`,
      message: `This simulated order reflects a ${overallRisk} exposure classification based on your ${cashAllocationPct}% cash allocation and projected ${postTradeConcentrationPct}% asset concentration. This is an educational measurement of account exposure and does not predict future price direction.`,
    });

    if (hasInsufficientCash) {
      education.unshift({
        topic: 'Insufficient Virtual Cash',
        title: 'Order Exceeds Available Cash',
        message: `This simulated trade requires $${(grossValueCentsNum / 100).toFixed(2)}, which exceeds your available virtual cash balance of $${(availableCashCentsNum / 100).toFixed(2)}. In a live account, orders cannot execute without sufficient funds. Adjust your quantity or review cash allocations.`,
      });
    }

    return {
      symbol: cleanSymbol,
      name: asset.name,
      side: ORDER_SIDES.BUY,
      quantity: normalizedQuantityStr,
      market: {
        currentPrice: asset.currentPrice,
        priceCents: Number(executionPriceCentsBig),
      },
      trade: {
        estimatedValueCents: grossValueCentsNum,
        estimatedValueUSD: grossValueCentsNum / 100,
      },
      account: {
        availableCashCents: availableCashCentsNum,
        availableCashUSD: availableCashCentsNum / 100,
        currentHoldingQuantity: unitsToCryptoString(userOwnedUnitsBig),
        currentHoldingValueUSD: Number(currentAssetValueCentsBig) / 100,
        totalCryptoPortfolioValueUSD: Number(totalCryptoPortfolioValueCentsBig) / 100,
      },
      analysis: {
        positionSize: {
          percentage: cashAllocationPct,
          level: cashLevel,
        },
        cashAllocation: {
          percentage: cashAllocationPct,
          level: cashLevel,
          allocatedCents: grossValueCentsNum,
        },
        concentration: {
          percentage: postTradeConcentrationPct,
          level: concentrationLevel,
          currentPercentage: totalCryptoPortfolioValueCentsBig > 0n
            ? Number((currentAssetValueCentsBig * 10000n) / totalCryptoPortfolioValueCentsBig) / 100
            : 0,
        },
        riskExposure: {
          level: overallRisk,
          basis: `Evaluated from ${cashLevel} cash allocation (${cashAllocationPct}%) and ${concentrationLevel} asset concentration (${postTradeConcentrationPct}%).`,
        },
        hasInsufficientCash,
        hasInsufficientHoldings: false,
      },
      education,
      disclaimer: EDUCATIONAL_DISCLAIMER,
    };
  } else {
    // SELL Mode
    hasInsufficientHoldings = qtyUnits > userOwnedUnitsBig;
    if (userOwnedUnitsBig > 0n) {
      reductionPct = Math.min(100, Number((qtyUnits * 10000n) / userOwnedUnitsBig) / 100);
    } else {
      reductionPct = 0;
    }

    // Post-trade Holding Concentration (Clarification formula):
    // (remaining asset quantity * current price) / (total remaining crypto portfolio market value)
    const remainingUnitsBig = userOwnedUnitsBig > qtyUnits ? userOwnedUnitsBig - qtyUnits : 0n;
    const remainingAssetValCentsBig = calculateGrossValueCents(remainingUnitsBig, executionPriceCentsBig);
    const remainingOtherCryptoValCentsBig = totalCryptoPortfolioValueCentsBig >= currentAssetValueCentsBig
      ? totalCryptoPortfolioValueCentsBig - currentAssetValueCentsBig
      : 0n;
    const totalRemainingPortfolioValCentsBig = remainingOtherCryptoValCentsBig + remainingAssetValCentsBig;

    if (totalRemainingPortfolioValCentsBig > 0n) {
      postTradeConcentrationPct = Math.min(100, Number((remainingAssetValCentsBig * 10000n) / totalRemainingPortfolioValCentsBig) / 100);
    } else {
      postTradeConcentrationPct = 0;
    }
    concentrationLevel = getConcentrationLevel(postTradeConcentrationPct);

    // Selling releases capital, cash allocation is 0
    cashLevel = EXPOSURE_LEVELS.LOW;
    const overallRisk = getOverallRiskExposure(cashLevel, concentrationLevel);

    education.push({
      topic: 'Holding Reduction',
      title: `Holding Reduction: ${reductionPct}%`,
      message: `This simulated sale would reduce your ${cleanSymbol} holding by ${reductionPct}%, releasing approximately $${(grossValueCentsNum / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} back into virtual cash. Partial exits allow traders to rebalance or lock in simulated proceeds.`,
    });

    education.push({
      topic: 'Holding Concentration',
      title: `Post-Sale Concentration: ${concentrationLevel}`,
      message: `After this sale, ${cleanSymbol} would represent approximately ${postTradeConcentrationPct}% of your remaining tracked crypto portfolio. Reducing concentration lowers your account exposure to single-asset volatility.`,
    });

    education.push({
      topic: 'Risk Exposure',
      title: `Educational Exposure: ${overallRisk}`,
      message: `Selling assets reduces individual asset exposure while preserving liquidity in virtual cash. This educational exposure level is ${overallRisk} based on a post-sale asset concentration of ${postTradeConcentrationPct}%.`,
    });

    if (hasInsufficientHoldings) {
      education.unshift({
        topic: 'Insufficient Holdings',
        title: 'Sale Exceeds Owned Balance',
        message: `You currently own ${unitsToCryptoString(userOwnedUnitsBig)} ${cleanSymbol}, but proposed selling ${normalizedQuantityStr} ${cleanSymbol}. Paper trading simulates real market rules: you cannot sell cryptocurrency that your account does not own.`,
      });
    }

    return {
      symbol: cleanSymbol,
      name: asset.name,
      side: ORDER_SIDES.SELL,
      quantity: normalizedQuantityStr,
      market: {
        currentPrice: asset.currentPrice,
        priceCents: Number(executionPriceCentsBig),
      },
      trade: {
        estimatedValueCents: grossValueCentsNum,
        estimatedValueUSD: grossValueCentsNum / 100,
      },
      account: {
        availableCashCents: availableCashCentsNum,
        availableCashUSD: availableCashCentsNum / 100,
        currentHoldingQuantity: unitsToCryptoString(userOwnedUnitsBig),
        currentHoldingValueUSD: Number(currentAssetValueCentsBig) / 100,
        totalCryptoPortfolioValueUSD: Number(totalCryptoPortfolioValueCentsBig) / 100,
      },
      analysis: {
        positionSize: {
          percentage: reductionPct,
          level: cashLevel,
        },
        holdingReduction: {
          percentage: reductionPct,
          remainingQuantity: unitsToCryptoString(remainingUnitsBig),
        },
        cashAllocation: {
          percentage: 0,
          level: EXPOSURE_LEVELS.LOW,
          estimatedProceedsCents: grossValueCentsNum,
        },
        concentration: {
          percentage: postTradeConcentrationPct,
          level: concentrationLevel,
          currentPercentage: totalCryptoPortfolioValueCentsBig > 0n
            ? Number((currentAssetValueCentsBig * 10000n) / totalCryptoPortfolioValueCentsBig) / 100
            : 0,
        },
        riskExposure: {
          level: overallRisk,
          basis: `Evaluated from selling reduction (${reductionPct}%) and post-sale concentration (${postTradeConcentrationPct}%).`,
        },
        hasInsufficientCash: false,
        hasInsufficientHoldings,
      },
      education,
      disclaimer: EDUCATIONAL_DISCLAIMER,
    };
  }
}

module.exports = {
  analyzeProposedTrade,
};
