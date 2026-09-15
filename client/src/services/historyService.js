import api from './api';

/**
 * Crypto Compass — Trading History Client Service (Phase 12)
 *
 * Communicates with the server-authoritative trade history endpoints.
 */

/**
 * Fetch authenticated user's simulated trading history with optional pagination and filters.
 *
 * @param {Object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=20]
 * @param {string} [params.side] - 'ALL' | 'BUY' | 'SELL'
 * @param {string} [params.symbol] - Optional symbol
 * @param {string} [params.sortBy] - 'newest' | 'oldest'
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ success: boolean, data: { trades: Array, pagination: Object } }>}
 */
export const getHistory = async (params = {}, signal) => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set('page', params.page);
  if (params.limit) queryParams.set('limit', params.limit);
  if (params.side && params.side !== 'ALL') queryParams.set('side', params.side);
  if (params.symbol) queryParams.set('symbol', params.symbol);
  if (params.sortBy) queryParams.set('sortBy', params.sortBy);

  const queryString = queryParams.toString();
  const url = queryString ? `/history?${queryString}` : '/history';

  const res = await api.get(url, { signal });
  return res;
};

export default {
  getHistory,
};
