const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { completeOnboarding } = require('../controllers/onboardingController');

const router = express.Router();

/**
 * Phase 4 Onboarding Router
 * PUT /api/onboarding - Complete user onboarding preferences (Protected)
 */
router.put('/', requireAuth, completeOnboarding);

module.exports = router;
