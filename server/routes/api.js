const express = require('express');
const healthRoutes = require('./healthRoutes');

const router = express.Router();

/**
 * Crypto Compass Central API Router
 * 
 * Future Route Registrations:
 * - /auth        -> Phase 3
 * - /users       -> Phase 4 & 21
 * - /portfolio   -> Phase 5 & 11
 * - /markets     -> Phase 7 & 8
 * - /trades      -> Phase 9 & 10
 * - /lessons     -> Phase 13
 * - /quizzes     -> Phase 14
 * - /scenarios   -> Phase 15
 * - /simulator   -> Phase 16
 * - /analysis    -> Phase 17
 * - /challenges  -> Phase 19
 * - /leaderboard -> Phase 20
 * - /ai          -> Phase 22
 */

// Health check endpoint -> /api/health
router.use('/health', healthRoutes);

module.exports = router;
