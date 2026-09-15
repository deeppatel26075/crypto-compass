import api from './api';

/**
 * Crypto Compass — Client Market Service
 * Consumes the server proxy endpoints:
 *   GET /api/markets
 *   GET /api/markets/:symbol
 */

/**
 * Fetch list of normalized markets
 * @param {boolean} forceRefresh - If true, requests backend cache bypass
 * @returns {Promise<{ data: Array, isStale: boolean, cachedAt: string }>}
 */
export const getMarkets = async (forceRefresh = false) => {
  const url = forceRefresh ? '/markets?refresh=true' : '/markets';
  const res = await api.get(url);
  return res;
};

/**
 * Fetch individual market asset by symbol (e.g. 'btc', 'eth')
 * @param {string} symbol
 * @returns {Promise<{ data: Object, isStale: boolean, cachedAt: string }>}
 */
export const getMarketBySymbol = async (symbol) => {
  if (!symbol) throw new Error('Symbol is required');
  const res = await api.get(`/markets/${symbol.toLowerCase()}`);
  return res;
};

/**
 * Fetch historical chart points for an asset
 * @param {string} symbol - Asset symbol (e.g. 'btc', 'eth')
 * @param {string} timeframe - '24h' | '7d' | '30d' | '90d' | '1y'
 * @param {AbortSignal} [signal] - Optional AbortController signal
 * @returns {Promise<{ data: Array<{ timestamp: number, price: number }>, symbol: string, timeframe: string, isStale: boolean, cachedAt: string }>}
 */
export const getMarketChart = async (symbol, timeframe = '7d', signal) => {
  if (!symbol) throw new Error('Symbol is required');
  const cleanTf = (timeframe || '7d').toLowerCase();
  const res = await api.get(`/markets/${symbol.toLowerCase()}/chart?timeframe=${cleanTf}`, {
    signal,
  });
  return res;
};

export default {
  getMarkets,
  getMarketBySymbol,
  getMarketChart,
};

