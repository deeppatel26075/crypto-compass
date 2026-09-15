import api from './api';

/**
 * Crypto Compass — Scenario Service (Phase 15)
 *
 * Communicates with server-authoritative scenario endpoints.
 * Strictly educational: zero financial advice, zero predictions, zero gamification.
 */

/**
 * Fetch lightweight scenario catalog metadata
 * @param {AbortSignal} [signal]
 */
export const getScenarioCatalog = async (signal) => {
  const res = await api.get('/scenarios/catalog', { signal });
  return res;
};

/**
 * Fetch scenario details (without answers/evaluation) by ID
 * @param {string} scenarioId
 * @param {AbortSignal} [signal]
 */
export const getScenario = async (scenarioId, signal) => {
  const res = await api.get(`/scenarios/${encodeURIComponent(scenarioId)}`, { signal });
  return res;
};

/**
 * Fetch user's scenario completion progress and history
 * @param {AbortSignal} [signal]
 */
export const getScenarioProgress = async (signal) => {
  const res = await api.get('/scenarios/progress', { signal });
  return res;
};

/**
 * Submit decision to server for authoritative educational evaluation
 * @param {string} scenarioId
 * @param {string} optionId
 * @param {AbortSignal} [signal]
 */
export const submitScenario = async (scenarioId, optionId, signal) => {
  const res = await api.post(
    `/scenarios/${encodeURIComponent(scenarioId)}/submit`,
    { optionId },
    { signal }
  );
  return res;
};

export default {
  getScenarioCatalog,
  getScenario,
  getScenarioProgress,
  submitScenario,
};
