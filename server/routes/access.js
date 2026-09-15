const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const accessController = require('../controllers/accessController');

const router = express.Router();

/**
 * Phase 26 Virtual Access Routes
 * All access management endpoints require valid JWT authentication.
 */

// GET /api/access/status - Get current access entitlement and pricing (read-only)
router.get('/status', requireAuth, accessController.getStatus);

// POST /api/access/redeem - Redeem promo coupon to unlock virtual access & provision wallet
router.post('/redeem', requireAuth, accessController.redeem);

module.exports = router;
