import api from './api';

/**
 * Fetch leaderboard rankings and current user rank
 * @param {number} [limit=50]
 */
export async function getLeaderboard(limit = 50) {
  return api.get(`/leaderboard?limit=${limit}`);
}
