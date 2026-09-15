/**
 * Crypto Compass — Challenge Routes (Phase 20)
 */

const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const challengeController = require('../controllers/challengeController');

const router = express.Router();

// GET /api/challenges/catalog - Static list of all active challenges
router.get('/catalog', requireAuth, challengeController.getCatalog);

// GET /api/challenges/progress - Calling user's challenge progress & eligibility
router.get('/progress', requireAuth, challengeController.getProgress);

// GET /api/challenges - Default alias for progress
router.get('/', requireAuth, challengeController.getProgress);

// POST /api/challenges/:challengeId/claim - Server-authoritatively claim challenge XP
router.post('/:challengeId/claim', requireAuth, challengeController.postClaimChallenge);

module.exports = router;
