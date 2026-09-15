const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const tradingController = require('../controllers/tradingController');

const router = express.Router();

/**
 * Phase 9 Paper Trading Routes (Protected)
 */

// Execute paper trade order
router.post('/orders', requireAuth, tradingController.createOrder);

// Get user trading account (wallet + holdings)
router.get('/account', requireAuth, tradingController.getAccount);

module.exports = router;
