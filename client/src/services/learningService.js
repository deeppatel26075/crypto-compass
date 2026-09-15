import api from './api';

/**
 * Crypto Compass — Learning Platform Client Service (Phase 13)
 *
 * Communicates with server-authoritative learning endpoints.
 */

/**
 * Fetch lightweight lesson catalog metadata
 * @param {AbortSignal} [signal]
 */
export const getCatalog = async (signal) => {
  const res = await api.get('/learning/catalog', { signal });
  return res;
};

/**
 * Fetch detailed structured lesson by ID
 * @param {string} lessonId
 * @param {AbortSignal} [signal]
 */
export const getLesson = async (lessonId, signal) => {
  const res = await api.get(`/learning/lessons/${encodeURIComponent(lessonId)}`, { signal });
  return res;
};

/**
 * Fetch user completed lesson IDs
 * @param {AbortSignal} [signal]
 */
export const getProgress = async (signal) => {
  const res = await api.get('/learning/progress', { signal });
  return res;
};

/**
 * Mark a lesson complete for the authenticated user (Idempotent)
 * @param {string} lessonId
 * @param {AbortSignal} [signal]
 */
export const completeLesson = async (lessonId, signal) => {
  const res = await api.post(`/learning/progress/${encodeURIComponent(lessonId)}/complete`, {}, { signal });
  return res;
};

/**
 * Fetch adaptive learning recommendations (Phase 18)
 * @param {AbortSignal} [signal]
 */
export const getRecommendations = async (signal) => {
  const res = await api.get('/learning/recommendations', { signal });
  return res;
};

export default {
  getCatalog,
  getLesson,
  getProgress,
  completeLesson,
  getRecommendations,
};
