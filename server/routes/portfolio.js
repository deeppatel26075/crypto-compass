const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const portfolioController = require('../controllers/portfolioController');

const router = express.Router();

/**
 * Phase 11 Portfolio Routes (Protected)
 */

// GET /api/portfolio - Retrieve authenticated user's portfolio composition
router.get('/', requireAuth, portfolioController.getPortfolio);

module.exports = router;
