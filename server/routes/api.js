const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./auth');

const router = express.Router();

/**
 * Crypto Compass Central API Router
 *
 * Phase 0: Health check endpoint -> /api/health
 * Phase 3: Auth endpoints -> /api/auth/*
 */

// Health check endpoint -> /api/health
router.use('/health', healthRoutes);

// Phase 3 Authentication -> /api/auth
router.use('/auth', authRoutes);

module.exports = router;
