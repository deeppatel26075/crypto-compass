import api from './api';

/**
 * Crypto Compass — What-If Simulator Client Service (Phase 16)
 *
 * Communicates with server-authoritative What-If Simulator endpoints.
 * Strictly educational: zero financial advice, zero predictions, zero execution.
 */

/**
 * Fetch authenticated user's holdings with server-authoritative market prices
 * @param {AbortSignal} [signal]
 */
export const getSimulatorPortfolio = async (signal) => {
  const res = await api.get('/simulator/portfolio', { signal });
  return res;
};

/**
 * Calculate hypothetical portfolio outcome under user-specified percentage change
 * @param {string} symbol - Asset symbol (e.g. "BTC")
 * @param {number} percentageChange - Number between -90 and 500 (at most 2 decimals)
 * @param {AbortSignal} [signal]
 */
export const calculateSimulatorOutcome = async (symbol, percentageChange, signal) => {
  const res = await api.post(
    '/simulator/calculate',
    { symbol, percentageChange },
    { signal }
  );
  return res;
};

export default {
  getSimulatorPortfolio,
  calculateSimulatorOutcome,
};
