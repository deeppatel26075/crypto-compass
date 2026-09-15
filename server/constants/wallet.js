/**
 * Crypto Compass — Wallet System Constants
 *
 * All monetary values are handled in integer cents to prevent JavaScript floating-point
 * rounding inaccuracies.
 * $10,000.00 USD = 1,000,000 cents.
 */

const INITIAL_VIRTUAL_BALANCE_CENTS = 1000000; // $10,000.00
const WALLET_CURRENCY = 'USD';

const TRANSACTION_TYPES = Object.freeze({
  INITIAL_DEPOSIT: 'INITIAL_DEPOSIT',
  TRADE_BUY: 'TRADE_BUY',
  TRADE_SELL: 'TRADE_SELL',
});

module.exports = {
  INITIAL_VIRTUAL_BALANCE_CENTS,
  WALLET_CURRENCY,
  TRANSACTION_TYPES,
};

