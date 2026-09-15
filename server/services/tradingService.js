const mongoose = require('mongoose');
const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const Holding = require('../models/Holding');
const Trade = require('../models/Trade');
const marketService = require('./marketService');
const { ORDER_SIDES, ORDER_TYPES, TRADE_STATUS, MIN_TRADE_VALUE_CENTS } = require('../constants/trading');
const {
  parsePriceToCents,
  parseCryptoToUnits,
  unitsToCryptoString,
  calculateGrossValueCents,
  calculateWeightedAverageCents,
} = require('../utils/decimalMath');

/**
 * Execute paper trade order with strict server-authoritative pricing,
 * precise BigInt decimal arithmetic, idempotency protection, and atomic session rollback.
 *
 * @param {string} userId - Authenticated user ID
 * @param {Object} orderData
 * @param {string} orderData.symbol - Asset symbol (e.g. 'BTC', 'ETH')
 * @param {string} orderData.side - 'BUY' | 'SELL'
 * @param {string|number} orderData.quantity - Quantity string or Decimal128
 * @param {string} [orderData.orderType='MARKET'] - Order type
 * @param {string} orderData.idempotencyKey - Client idempotency key
 * @returns {Promise<{ trade: Object, holding: Object|null, wallet: Object, isIdempotentReplay?: boolean }>}
 */
async function executeOrder(userId, orderData) {
  if (!userId) {
    throw new Error('Authentication required.');
  }

  const { symbol, side, quantity, orderType = ORDER_TYPES.MARKET, idempotencyKey } = orderData || {};

  // 1. Basic validation
  if (!symbol || typeof symbol !== 'string') {
    throw new Error('Asset symbol is required.');
  }
  const cleanSymbol = symbol.trim().toUpperCase();

  if (!side || !Object.values(ORDER_SIDES).includes(side)) {
    throw new Error(`Order side must be ${ORDER_SIDES.BUY} or ${ORDER_SIDES.SELL}.`);
  }

  if (orderType !== ORDER_TYPES.MARKET) {
    throw new Error(`Only ${ORDER_TYPES.MARKET} orders are supported in this simulation.`);
  }

  if (!idempotencyKey || typeof idempotencyKey !== 'string' || !idempotencyKey.trim()) {
    throw new Error('Idempotency key is required to prevent duplicate submissions.');
  }
  const cleanIdempotencyKey = idempotencyKey.trim();

  // Parse and validate crypto quantity into BigInt base units (10^-8)
  const qtyUnits = parseCryptoToUnits(quantity);

  // 2. Pre-transaction Idempotency Check: if trade already exists for user + key, return original result
  const existingTrade = await Trade.findOne({ user: userId, idempotencyKey: cleanIdempotencyKey });
  if (existingTrade) {
    const [wallet, holding] = await Promise.all([
      Wallet.findOne({ user: userId }),
      Holding.findOne({ user: userId, symbol: cleanSymbol }),
    ]);
    return {
      trade: existingTrade.toSafeJSON(),
      holding: holding ? holding.toSafeJSON() : null,
      wallet: wallet ? wallet.toSafeJSON() : null,
      isIdempotentReplay: true,
    };
  }

  // 3. Obtain Server-Authoritative Market Price
  // The server queries the market service directly. Client prices are completely ignored.
  const marketResult = await marketService.getMarketBySymbol(cleanSymbol);
  if (!marketResult || !marketResult.asset || typeof marketResult.asset.currentPrice !== 'number' || marketResult.asset.currentPrice <= 0) {
    const err = new Error(`Market price for ${cleanSymbol} is currently unavailable. Your simulated wallet has not been changed.`);
    err.code = 'MARKET_PRICE_UNAVAILABLE';
    throw err;
  }

  const asset = marketResult.asset;
  const executionPriceCentsBig = parsePriceToCents(asset.currentPrice);

  if (executionPriceCentsBig <= 0n) {
    const err = new Error(`Invalid execution price for ${cleanSymbol}. Your simulated wallet has not been changed.`);
    err.code = 'MARKET_PRICE_UNAVAILABLE';
    throw err;
  }

  // 4. Calculate Gross Value in Integer Cents entirely using exact BigInt math:
  // grossValueCents = (quantityBaseUnits * executionPriceCents + 50_000_000n) / 100_000_000n
  const grossValueCentsBig = calculateGrossValueCents(qtyUnits, executionPriceCentsBig);
  if (grossValueCentsBig < 0n) {
    throw new Error('Order value cannot be negative.');
  }

  // 5. Atomic Execution inside MongoDB Session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Secondary Idempotency Check inside session to guard against concurrent in-flight duplicates
    const inFlightExisting = await Trade.findOne({ user: userId, idempotencyKey: cleanIdempotencyKey }).session(session);
    if (inFlightExisting) {
      await session.abortTransaction();
      session.endSession();
      const [wallet, holding] = await Promise.all([
        Wallet.findOne({ user: userId }),
        Holding.findOne({ user: userId, symbol: cleanSymbol }),
      ]);
      return {
        trade: inFlightExisting.toSafeJSON(),
        holding: holding ? holding.toSafeJSON() : null,
        wallet: wallet ? wallet.toSafeJSON() : null,
        isIdempotentReplay: true,
      };
    }

    // Fetch user's virtual wallet with session lock
    const wallet = await Wallet.findOne({ user: userId }).session(session);
    if (!wallet) {
      throw new Error('Virtual wallet not found for authenticated user.');
    }

    let resultingHolding = null;
    let createdTrade = null;

    if (side === ORDER_SIDES.BUY) {
      // ----------------------------------------------------
      // BUY ORDER EXECUTION (Exact BigInt Accounting)
      // ----------------------------------------------------
      const currentCashBig = BigInt(wallet.cashBalanceCents);
      if (currentCashBig < grossValueCentsBig) {
        const err = new Error("Insufficient virtual cash for this order. Your simulated wallet has not been changed.");
        err.code = 'INSUFFICIENT_FUNDS';
        throw err;
      }

      // Deduct cash from wallet entirely using BigInt arithmetic
      const newCashBig = currentCashBig - grossValueCentsBig;
      wallet.cashBalanceCents = Number(newCashBig);
      await wallet.save({ session });

      // Find or create Holding
      let holding = await Holding.findOne({ user: userId, symbol: cleanSymbol }).session(session);

      if (holding) {
        const oldUnits = parseCryptoToUnits(holding.quantity);
        const newTotalUnits = oldUnits + qtyUnits;
        const newAvgBuyPriceCentsBig = calculateWeightedAverageCents(
          oldUnits,
          holding.averageBuyPriceCents,
          qtyUnits,
          executionPriceCentsBig
        );

        holding.quantity = mongoose.Types.Decimal128.fromString(unitsToCryptoString(newTotalUnits));
        holding.averageBuyPriceCents = Number(newAvgBuyPriceCentsBig);
        await holding.save({ session });
        resultingHolding = holding;
      } else {
        holding = new Holding({
          user: userId,
          assetId: asset.id,
          symbol: cleanSymbol,
          name: asset.name,
          quantity: mongoose.Types.Decimal128.fromString(unitsToCryptoString(qtyUnits)),
          averageBuyPriceCents: Number(executionPriceCentsBig),
        });
        await holding.save({ session });
        resultingHolding = holding;
      }

      const grossValueCents = Number(grossValueCentsBig);
      const executionPriceCents = Number(executionPriceCentsBig);

      // Create Trade record
      createdTrade = new Trade({
        user: userId,
        assetId: asset.id,
        symbol: cleanSymbol,
        name: asset.name,
        side: ORDER_SIDES.BUY,
        orderType: ORDER_TYPES.MARKET,
        quantity: mongoose.Types.Decimal128.fromString(unitsToCryptoString(qtyUnits)),
        executionPriceCents,
        grossValueCents,
        feeCents: 0,
        netCashChangeCents: -grossValueCents,
        status: TRADE_STATUS.EXECUTED,
        idempotencyKey: cleanIdempotencyKey,
        executedAt: new Date(),
      });
      await createdTrade.save({ session });

      // Create WalletTransaction ledger entry
      await WalletTransaction.create(
        [
          {
            wallet: wallet._id,
            user: userId,
            type: 'TRADE_BUY',
            amountCents: -grossValueCents,
            currency: wallet.currency,
            balanceAfterCents: wallet.cashBalanceCents,
            description: `Paper trade: Bought ${unitsToCryptoString(qtyUnits)} ${cleanSymbol} @ $${(executionPriceCents / 100).toFixed(2)}`,
            createdAt: new Date(),
          },
        ],
        { session }
      );
    } else {
      // ----------------------------------------------------
      // SELL ORDER EXECUTION (Exact BigInt Accounting)
      // ----------------------------------------------------
      const holding = await Holding.findOne({ user: userId, symbol: cleanSymbol }).session(session);

      if (!holding) {
        const err = new Error(`You do not own any ${cleanSymbol} to sell. Your simulated wallet has not been changed.`);
        err.code = 'INSUFFICIENT_HOLDINGS';
        throw err;
      }

      const ownedUnits = parseCryptoToUnits(holding.quantity);

      if (ownedUnits < qtyUnits) {
        const err = new Error(
          `You don't own enough ${cleanSymbol} to sell this amount. Owned: ${unitsToCryptoString(ownedUnits)}, requested: ${unitsToCryptoString(qtyUnits)}. Your simulated wallet has not been changed.`
        );
        err.code = 'INSUFFICIENT_HOLDINGS';
        throw err;
      }

      // Add cash proceeds to wallet entirely using BigInt arithmetic
      const currentCashBig = BigInt(wallet.cashBalanceCents);
      const newCashBig = currentCashBig + grossValueCentsBig;
      wallet.cashBalanceCents = Number(newCashBig);
      await wallet.save({ session });

      // Reduce holding using exact BigInt base units
      const remainingUnits = ownedUnits - qtyUnits;

      if (remainingUnits === 0n) {
        // Entire holding sold
        await Holding.deleteOne({ _id: holding._id }).session(session);
        resultingHolding = null;
      } else {
        // Partial sell: average buy price remains unchanged
        holding.quantity = mongoose.Types.Decimal128.fromString(unitsToCryptoString(remainingUnits));
        await holding.save({ session });
        resultingHolding = holding;
      }

      const grossValueCents = Number(grossValueCentsBig);
      const executionPriceCents = Number(executionPriceCentsBig);

      // Phase 19: Authoritative Realized P&L calculation for SELL orders
      // Formula: netSaleProceedsCents = grossValueCents - feeCents; realizedProfitLossCents = netSaleProceedsCents - realizedCostBasisCents
      const avgBuyPriceCentsBig = BigInt(holding.averageBuyPriceCents);
      const realizedCostBasisCentsBig = calculateGrossValueCents(qtyUnits, avgBuyPriceCentsBig);
      const feeCentsBig = 0n; // Phase 9/19 zero fee model
      const netSaleProceedsCentsBig = grossValueCentsBig - feeCentsBig;
      const realizedProfitLossCentsBig = netSaleProceedsCentsBig - realizedCostBasisCentsBig;

      let realizedProfitLossPercentage = null;
      if (realizedCostBasisCentsBig > 0n) {
        // Rounded half-up to 2 decimal places using exact BigInt integer division
        const pctBasisPointsBig = (realizedProfitLossCentsBig * 10000n + (realizedProfitLossCentsBig >= 0n ? realizedCostBasisCentsBig / 2n : -realizedCostBasisCentsBig / 2n)) / realizedCostBasisCentsBig;
        realizedProfitLossPercentage = Number(pctBasisPointsBig) / 100;
      }

      const costBasisCents = Number(realizedCostBasisCentsBig);
      const realizedProfitLossCents = Number(realizedProfitLossCentsBig);
      const isFullPositionExit = remainingUnits === 0n;

      // Create Trade record
      createdTrade = new Trade({
        user: userId,
        assetId: asset.id,
        symbol: cleanSymbol,
        name: asset.name,
        side: ORDER_SIDES.SELL,
        orderType: ORDER_TYPES.MARKET,
        quantity: mongoose.Types.Decimal128.fromString(unitsToCryptoString(qtyUnits)),
        executionPriceCents,
        grossValueCents,
        costBasisCents,
        realizedProfitLossCents,
        realizedProfitLossPercentage,
        isFullPositionExit,
        feeCents: 0,
        netCashChangeCents: grossValueCents,
        status: TRADE_STATUS.EXECUTED,
        idempotencyKey: cleanIdempotencyKey,
        executedAt: new Date(),
      });
      await createdTrade.save({ session });

      // Create WalletTransaction ledger entry
      await WalletTransaction.create(
        [
          {
            wallet: wallet._id,
            user: userId,
            type: 'TRADE_SELL',
            amountCents: grossValueCents,
            currency: wallet.currency,
            balanceAfterCents: wallet.cashBalanceCents,
            description: `Paper trade: Sold ${unitsToCryptoString(qtyUnits)} ${cleanSymbol} @ $${(executionPriceCents / 100).toFixed(2)}`,
            createdAt: new Date(),
          },
        ],
        { session }
      );
    }

    // Commit all operations atomically
    await session.commitTransaction();

    return {
      trade: createdTrade.toSafeJSON(),
      holding: resultingHolding ? resultingHolding.toSafeJSON() : null,
      wallet: wallet.toSafeJSON(),
    };
  } catch (error) {
    await session.abortTransaction();

    // If an error occurred (e.g. 11000 duplicate key or write conflict between concurrent requests),
    // check if a concurrent sibling transaction for this exact idempotency key committed successfully.
    for (let attempt = 0; attempt < 6; attempt++) {
      const duplicateTrade = await Trade.findOne({ user: userId, idempotencyKey: cleanIdempotencyKey });
      if (duplicateTrade) {
        const [wallet, holding] = await Promise.all([
          Wallet.findOne({ user: userId }),
          Holding.findOne({ user: userId, symbol: cleanSymbol }),
        ]);
        return {
          trade: duplicateTrade.toSafeJSON(),
          holding: holding ? holding.toSafeJSON() : null,
          wallet: wallet ? wallet.toSafeJSON() : null,
          isIdempotentReplay: true,
        };
      }
      await new Promise((r) => setTimeout(r, 80));
    }

    throw error;
  } finally {
    session.endSession();
  }
}

/**
 * Get user trading account information: virtual wallet balance and current holdings.
 *
 * @param {string} userId
 * @returns {Promise<{ wallet: Object, holdings: Array<Object> }>}
 */
async function getTradingAccount(userId) {
  if (!userId) {
    throw new Error('Authentication required.');
  }

  const [wallet, holdings] = await Promise.all([
    Wallet.findOne({ user: userId }),
    Holding.find({ user: userId }).sort({ symbol: 1 }),
  ]);

  if (!wallet) {
    throw new Error('Virtual wallet not found for user.');
  }

  return {
    wallet: wallet.toSafeJSON(),
    holdings: holdings.map((h) => h.toSafeJSON()),
  };
}

module.exports = {
  executeOrder,
  getTradingAccount,
};
