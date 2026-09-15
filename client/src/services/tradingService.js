import api from './api';

/**
 * Crypto Compass — Client Trading Service (Phase 9)
 * Communicates with the server-authoritative paper trading engine.
 */

/**
 * Execute a paper trade order
 * @param {Object} params
 * @param {string} params.symbol - Asset symbol (e.g. 'BTC', 'ETH')
 * @param {string} params.side - 'BUY' | 'SELL'
 * @param {string} params.quantity - Quantity string (e.g. '0.01')
 * @param {string} [params.orderType='MARKET'] - 'MARKET'
 * @param {string} params.idempotencyKey - Unique idempotency identifier
 * @returns {Promise<{ success: boolean, message: string, data: { trade: Object, holding: Object|null, wallet: Object, isIdempotentReplay?: boolean } }>}
 */
export const executeOrder = async ({
  symbol,
  side,
  quantity,
  orderType = 'MARKET',
  idempotencyKey,
}) => {
  if (!symbol) throw new Error('Symbol is required');
  if (!side) throw new Error('Order side is required');
  if (!quantity) throw new Error('Quantity is required');
  if (!idempotencyKey) throw new Error('Idempotency key is required');

  const res = await api.post('/trading/orders', {
    symbol: symbol.toUpperCase(),
    side,
    quantity: String(quantity).trim(),
    orderType,
    idempotencyKey,
  });

  return res;
};

/**
 * Fetch the user's trading account details (virtual wallet + crypto holdings)
 * @returns {Promise<{ success: boolean, data: { wallet: Object, holdings: Array<Object> } }>}
 */
export const getTradingAccount = async () => {
  const res = await api.get('/trading/account');
  return res;
};

export default {
  executeOrder,
  getTradingAccount,
};
