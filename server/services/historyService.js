/**
 * Crypto Compass — Trading History Service (Phase 12)
 *
 * Provides server-authoritative, read-only retrieval of authenticated user simulated trades.
 * - Strictly 100% read-only (zero database writes or mutations)
 * - Chronological ordering: executedAt descending (newest first)
 * - Exact 8-decimal satoshi quantity precision & integer-cent USD values
 * - Server-side pagination with bounded limits (1..50)
 * - Strict factual filtering: ALL, BUY, SELL
 * - Zero P&L, zero ROI, zero performance analysis, zero behavioral judgment
 */

const Trade = require('../models/Trade');
const { ORDER_SIDES } = require('../constants/trading');
const {
  parseCryptoToUnits,
  unitsToCryptoString,
  calculateGrossValueCents,
  calculateWeightedAverageCents,
} = require('../utils/decimalMath');

/**
 * Format integer cents into standard USD currency string (e.g. 243200 -> "$2,432.00")
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
 * Retrieve paginated, filtered trade history for a user
 *
 * @param {string|Object} userId - Authenticated user ObjectId
 * @param {Object} options
 * @param {number|string} [options.page=1] - 1-indexed page number
 * @param {number|string} [options.limit=20] - Records per page (clamped to 1..50)
 * @param {string} [options.side] - 'ALL' | 'BUY' | 'SELL'
 * @param {string} [options.symbol] - Optional symbol filter (e.g. 'BTC')
 * @param {string} [options.sortBy='newest'] - 'newest' | 'oldest'
 * @returns {Promise<Object>} Safe paginated trade history response
 */
async function getUserTradeHistory(userId, options = {}) {
  if (!userId) {
    const err = new Error('User identity is required to view trading history.');
    err.status = 401;
    throw err;
  }

  const { page = 1, limit = 20, side, symbol, sortBy = 'newest' } = options;

  // 1. Pagination Parameters (Safe clamping)
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  // 2. Query Construction
  const query = { user: userId };

  // Filter: Side
  if (side) {
    const cleanSide = String(side).trim().toUpperCase();
    if (cleanSide !== 'ALL') {
      if (cleanSide === ORDER_SIDES.BUY || cleanSide === ORDER_SIDES.SELL) {
        query.side = cleanSide;
      } else {
        const err = new Error(`Invalid side filter "${cleanSide}". Allowed values: ALL, BUY, SELL.`);
        err.status = 400;
        err.code = 'INVALID_SIDE_FILTER';
        throw err;
      }
    }
  }

  // Filter: Symbol
  if (symbol) {
    const cleanSymbol = String(symbol).trim().toUpperCase();
    if (!/^[A-Z0-9]{1,10}$/.test(cleanSymbol)) {
      const err = new Error(`Invalid symbol filter "${cleanSymbol}".`);
      err.status = 400;
      err.code = 'INVALID_SYMBOL_FILTER';
      throw err;
    }
    query.symbol = cleanSymbol;
  }

  // 3. Deterministic Sorting
  const sort = sortBy === 'oldest' ? { executedAt: 1, _id: 1 } : { executedAt: -1, _id: -1 };

  // 4. Execute Read-Only Queries
  const [total, rawTrades] = await Promise.all([
    Trade.countDocuments(query),
    Trade.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
  ]);

  const totalPages = Math.ceil(total / limitNum) || 1;
  const hasNextPage = pageNum < totalPages;
  const hasPreviousPage = pageNum > 1;

  // 5. Check if any returned SELL trades lack persisted costBasisCents (pre-Phase 19 trades)
  // If so, reconstruct historical state deterministically from the user's chronological trade sequence
  const needsReconstruction = rawTrades.some(
    (t) => t.side === ORDER_SIDES.SELL && (t.costBasisCents === undefined || t.costBasisCents === null)
  );

  const tradeReconstructedPnl = new Map();

  if (needsReconstruction) {
    // Replay user's trades chronologically
    const allUserTrades = await Trade.find({ user: userId, status: 'EXECUTED' })
      .sort({ executedAt: 1, _id: 1 })
      .lean();

    // Map: symbol -> { units: BigInt, avgBuyPriceCentsBig: BigInt }
    const assetHoldings = new Map();

    for (const trade of allUserTrades) {
      const sym = trade.symbol.toUpperCase();
      const qtyUnits = parseCryptoToUnits(trade.quantity);
      let holding = assetHoldings.get(sym) || { units: 0n, avgBuyPriceCentsBig: 0n };

      if (trade.side === ORDER_SIDES.BUY) {
        const execPriceBig = BigInt(trade.executionPriceCents);
        const newAvg = calculateWeightedAverageCents(
          holding.units,
          holding.avgBuyPriceCentsBig,
          qtyUnits,
          execPriceBig
        );
        assetHoldings.set(sym, {
          units: holding.units + qtyUnits,
          avgBuyPriceCentsBig: newAvg,
        });
      } else if (trade.side === ORDER_SIDES.SELL) {
        const costBasisCentsBig = calculateGrossValueCents(qtyUnits, holding.avgBuyPriceCentsBig);
        const grossValueBig = BigInt(trade.grossValueCents);
        const feeCentsBig = BigInt(trade.feeCents || 0);
        const netSaleProceedsBig = grossValueBig - feeCentsBig;
        const pnlCentsBig = netSaleProceedsBig - costBasisCentsBig;

        let pct = null;
        if (costBasisCentsBig > 0n) {
          const pctBig =
            (pnlCentsBig * 10000n + (pnlCentsBig >= 0n ? costBasisCentsBig / 2n : -costBasisCentsBig / 2n)) /
            costBasisCentsBig;
          pct = Number(pctBig) / 100;
        }

        tradeReconstructedPnl.set(trade._id.toString(), {
          costBasisCents: Number(costBasisCentsBig),
          realizedProfitLossCents: Number(pnlCentsBig),
          realizedProfitLossPercentage: pct,
        });

        const remUnits = holding.units > qtyUnits ? holding.units - qtyUnits : 0n;
        assetHoldings.set(sym, {
          units: remUnits,
          avgBuyPriceCentsBig: remUnits > 0n ? holding.avgBuyPriceCentsBig : 0n,
        });
      }
    }
  }

  // 6. Transform Trade Records into Exact Client-Safe Representations
  const formattedTrades = rawTrades.map((t) => {
    let cleanQty = '0';
    if (t.quantity) {
      try {
        cleanQty = unitsToCryptoString(parseCryptoToUnits(t.quantity));
      } catch {
        cleanQty = t.quantity.toString();
      }
    }

    const isSell = t.side === ORDER_SIDES.SELL;
    let costBasisCents = null;
    let realizedProfitLossCents = null;
    let realizedProfitLossPercentage = null;

    if (isSell) {
      if (t.costBasisCents !== undefined && t.costBasisCents !== null) {
        costBasisCents = t.costBasisCents;
        realizedProfitLossCents = t.realizedProfitLossCents;
        realizedProfitLossPercentage = t.realizedProfitLossPercentage;
      } else {
        const reconstructed = tradeReconstructedPnl.get(t._id.toString());
        if (reconstructed) {
          costBasisCents = reconstructed.costBasisCents;
          realizedProfitLossCents = reconstructed.realizedProfitLossCents;
          realizedProfitLossPercentage = reconstructed.realizedProfitLossPercentage;
        }
      }
    }

    return {
      id: t._id.toString(),
      assetId: t.assetId,
      symbol: t.symbol,
      assetName: t.name,
      side: t.side,
      orderType: t.orderType,
      quantity: cleanQty,
      executionPriceCents: t.executionPriceCents,
      executionPrice: formatUSDFromCents(t.executionPriceCents),
      grossValueCents: t.grossValueCents,
      grossValue: formatUSDFromCents(t.grossValueCents),
      feeCents: t.feeCents || 0,
      fee: formatUSDFromCents(t.feeCents || 0),
      costBasisCents,
      costBasis: formatUSDFromCents(costBasisCents),
      realizedProfitLossCents,
      realizedProfitLoss: formatUSDFromCents(realizedProfitLossCents),
      realizedProfitLossPercentage,
      netCashChangeCents: t.netCashChangeCents,
      status: t.status,
      executedAt: t.executedAt,
      createdAt: t.createdAt,
    };
  });

  return {
    trades: formattedTrades,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    },
  };
}

module.exports = {
  getUserTradeHistory,
  formatUSDFromCents,
};
