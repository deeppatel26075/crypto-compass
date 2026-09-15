/**
 * Crypto Compass — Trading System Constants (Phase 9)
 */

const ORDER_SIDES = Object.freeze({
  BUY: 'BUY',
  SELL: 'SELL',
});

const ORDER_TYPES = Object.freeze({
  MARKET: 'MARKET',
});

const TRADE_STATUS = Object.freeze({
  EXECUTED: 'EXECUTED',
});

const MIN_TRADE_VALUE_CENTS = 0; // Allows satoshi-level micro paper trading down to 0.00000001

module.exports = {
  ORDER_SIDES,
  ORDER_TYPES,
  TRADE_STATUS,
  MIN_TRADE_VALUE_CENTS,
};
