import api from './api';

/**
 * Crypto Compass — Portfolio Client Service (Phase 11)
 *
 * Reads user's current simulated portfolio composition.
 */

/**
 * Fetch authenticated user's portfolio data
 * @param {AbortSignal} [signal] - Optional abort signal
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export const getPortfolio = async (signal) => {
  const res = await api.get('/portfolio', { signal });
  return res;
};

export default {
  getPortfolio,
};
