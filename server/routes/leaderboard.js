/**
 * Crypto Compass — Leaderboard Routes (Phase 20)
 */

const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const leaderboardController = require('../controllers/leaderboardController');

const router = express.Router();

// GET /api/leaderboard - Deterministic educational leaderboard
router.get('/', requireAuth, leaderboardController.getLeaderboardData);

module.exports = router;
