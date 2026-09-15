const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const tradeCoachController = require('../controllers/tradeCoachController');

const router = express.Router();

/**
 * Phase 10 Trade Coach Routes (Protected)
 */

// Analyze proposed paper trade
router.post('/analyze', requireAuth, tradeCoachController.analyzeTrade);

module.exports = router;
