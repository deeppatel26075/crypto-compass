import api from './api';

/**
 * Crypto Compass — Trade Coach Client Service (Phase 10)
 * Communicates with the server-authoritative Trade Coach educational engine.
 */

/**
 * Request educational trade analysis for a proposed trade
 * @param {Object} params
 * @param {string} params.symbol - Asset symbol (e.g. 'BTC', 'ETH')
 * @param {string} params.side - 'BUY' | 'SELL'
 * @param {string|number} params.quantity - Proposed quantity
 * @param {AbortSignal} [signal] - Optional AbortController signal for request cancellation
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export const analyzeTrade = async ({ symbol, side, quantity }, signal) => {
  if (!symbol) throw new Error('Symbol is required');
  if (!side) throw new Error('Order side is required');
  if (!quantity) throw new Error('Quantity is required');

  const res = await api.post(
    '/trade-coach/analyze',
    {
      symbol: symbol.toUpperCase(),
      side,
      quantity: String(quantity).trim(),
    },
    { signal }
  );

  return res;
};

export default {
  analyzeTrade,
};
