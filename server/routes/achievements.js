const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const achievementController = require('../controllers/achievementController');

const router = express.Router();

/**
 * Phase 21: Achievements & Progression Routes
 *
 * GET  /api/achievements/catalog   - List all static achievements (definitions, xp, icons)
 * GET  /api/achievements/progress  - READ-ONLY: Get user's unlocked achievements and progress
 * POST /api/achievements/evaluate  - MUTATING & ATOMIC: Evaluate eligibility and unlock newly earned achievements
 */
router.get('/catalog', requireAuth, achievementController.getCatalog);
router.get('/progress', requireAuth, achievementController.getProgress);
router.post('/evaluate', requireAuth, achievementController.postEvaluate);

module.exports = router;
