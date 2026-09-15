import api from './api';

/**
 * Fetch static challenge catalog
 */
export async function getChallengeCatalog() {
  return api.get('/challenges/catalog');
}

/**
 * Fetch calling user's challenge progress and evaluated criteria
 */
export async function getChallengeProgress() {
  return api.get('/challenges/progress');
}

/**
 * Claim challenge and award XP
 * @param {string} challengeId
 */
export async function claimChallenge(challengeId) {
  return api.post(`/challenges/${challengeId}/claim`);
}
