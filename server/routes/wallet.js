const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const walletController = require('../controllers/walletController');

const router = express.Router();

/**
 * Crypto Compass — Wallet Routes
 *
 * All endpoints require valid JWT authentication via HttpOnly cookie.
 * Balance mutations cannot be triggered from the client.
 */

// GET /api/wallet -> Fetch virtual wallet for authenticated user
router.get('/', requireAuth, walletController.getWallet);

// GET /api/wallet/transactions -> Fetch transaction ledger for authenticated user
router.get('/transactions', requireAuth, walletController.getTransactions);

module.exports = router;
