const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const requireAuth = require('../middleware/requireAuth');

/**
 * Crypto Compass — Mistake Analyzer Routes (Phase 17)
 *
 * All endpoints are strictly authenticated and read-only.
 */

// GET /api/analysis/summary (Phase 17 Mistake Analyzer + Phase 23 Behavioral Analytics)
router.get('/summary', requireAuth, analysisController.getAnalysisSummary);

// GET /api/analysis/behavior (Phase 23 Advanced Behavioral Analytics)
router.get('/behavior', requireAuth, analysisController.getBehavioralAnalytics);

module.exports = router;
