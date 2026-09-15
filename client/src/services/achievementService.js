import api from './api';

/**
 * Fetch static achievement catalog definitions
 */
export async function getAchievementCatalog() {
  return api.get('/achievements/catalog');
}

/**
 * Fetch calling user's current achievement progress (READ-ONLY)
 */
export async function getAchievementProgress() {
  return api.get('/achievements/progress');
}

/**
 * Trigger server-authoritative achievement evaluation (MUTATING & ATOMIC)
 * Unlocks eligible achievements and awards XP once.
 */
export async function evaluateAchievements() {
  return api.post('/achievements/evaluate');
}
