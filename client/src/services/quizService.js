import api from './api';

/**
 * Crypto Compass — Quiz & Assessment Client Service (Phase 14)
 *
 * Communicates with server-authoritative quiz endpoints.
 */

/**
 * Fetch lightweight quiz catalog metadata
 * @param {AbortSignal} [signal]
 */
export const getQuizCatalog = async (signal) => {
  const res = await api.get('/quizzes/catalog', { signal });
  return res;
};

/**
 * Fetch quiz questions (without answers) by ID
 * @param {string} quizId
 * @param {AbortSignal} [signal]
 */
export const getQuiz = async (quizId, signal) => {
  const res = await api.get(`/quizzes/${encodeURIComponent(quizId)}`, { signal });
  return res;
};

/**
 * Fetch user's quiz completion progress, attempts, and XP
 * @param {AbortSignal} [signal]
 */
export const getQuizProgress = async (signal) => {
  const res = await api.get('/quizzes/progress', { signal });
  return res;
};

/**
 * Submit answers to server for evaluation and atomic XP recording
 * @param {string} quizId
 * @param {Array<{ questionId: string, selectedOptionId: string }>} answers
 * @param {AbortSignal} [signal]
 */
export const submitQuiz = async (quizId, answers, signal) => {
  const res = await api.post(
    `/quizzes/${encodeURIComponent(quizId)}/submit`,
    { answers },
    { signal }
  );
  return res;
};

export default {
  getQuizCatalog,
  getQuiz,
  getQuizProgress,
  submitQuiz,
};
