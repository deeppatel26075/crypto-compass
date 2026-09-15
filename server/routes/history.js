const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const historyController = require('../controllers/historyController');

const router = express.Router();

/**
 * Phase 12 Trading History Routes (Protected)
 */

// GET /api/history - Retrieve authenticated user's simulated trade history
router.get('/', requireAuth, historyController.getTrades);

module.exports = router;
