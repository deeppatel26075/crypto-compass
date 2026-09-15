import api from './api';

/**
 * Crypto Compass — Mistake Analyzer Client Service (Phase 17)
 *
 * Communicates with server-authoritative Mistake Analyzer endpoints.
 * Strictly educational: descriptive historical behavior analysis, zero financial advice,
 * zero market predictions, zero trader scoring.
 */

/**
 * Fetch authenticated user's deterministic trade analysis summary
 * @param {AbortSignal} [signal]
 */
export const getAnalysisSummary = async (signal) => {
  const res = await api.get('/analysis/summary', { signal });
  return res;
};

/**
 * Fetch authenticated user's advanced behavioral analytics
 * @param {AbortSignal} [signal]
 */
export const getBehavioralAnalytics = async (signal) => {
  const res = await api.get('/analysis/behavior', { signal });
  return res;
};

export default {
  getAnalysisSummary,
  getBehavioralAnalytics,
};
