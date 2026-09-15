const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./auth');
const onboardingRoutes = require('./onboarding');
const walletRoutes = require('./wallet');
const marketRoutes = require('./markets');
const tradingRoutes = require('./trading');
const tradeCoachRoutes = require('./tradeCoach');
const portfolioRoutes = require('./portfolio');
const historyRoutes = require('./history');
const learningRoutes = require('./learning');
const quizRoutes = require('./quizzes');
const scenarioRoutes = require('./scenarios');
const simulatorRoutes = require('./simulator');
const analysisRoutes = require('./analysis');
const challengeRoutes = require('./challenges');
const leaderboardRoutes = require('./leaderboard');

const accessRoutes = require('./access');
const requireAccess = require('../middleware/requireAccess');

const router = express.Router();

/**
 * Crypto Compass Central API Router
 *
 * Phase 0: Health check endpoint -> /api/health
 * Phase 3: Auth endpoints -> /api/auth/*
 * Phase 4: Onboarding endpoint -> /api/onboarding
 * Phase 26: Virtual Access Pricing & Coupon Gate -> /api/access/*
 *
 * Product Entitlement Protected Endpoints (requireAccess):
 * Phase 5: Virtual Wallet endpoints -> /api/wallet/*
 * Phase 9: Virtual Paper Trading Engine -> /api/trading/*
 * Phase 10: Trade Coach Educational Engine -> /api/trade-coach/*
 * Phase 11: Portfolio -> /api/portfolio
 * Phase 12: Trading History -> /api/history
 * Phase 13: Learning Platform -> /api/learning
 * Phase 14: Quizzes & Assessment -> /api/quizzes
 * Phase 15: Scenario Mode -> /api/scenarios
 * Phase 16: What-If Simulator -> /api/simulator
 * Phase 17: Mistake Analyzer -> /api/analysis
 * Phase 20: Challenges & Leaderboard -> /api/challenges, /api/leaderboard
 * Phase 21: Achievements & Progression -> /api/achievements
 */

// Public / Unrestricted endpoints
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/onboarding', onboardingRoutes);
router.use('/markets', marketRoutes);
router.use('/access', accessRoutes);

// Protected product endpoints requiring unlocked virtual trading access
router.use('/wallet', requireAccess, walletRoutes);
router.use('/trading', requireAccess, tradingRoutes);
router.use('/trade-coach', requireAccess, tradeCoachRoutes);
router.use('/portfolio', requireAccess, portfolioRoutes);
router.use('/history', requireAccess, historyRoutes);
router.use('/learning', requireAccess, learningRoutes);
router.use('/quizzes', requireAccess, quizRoutes);
router.use('/scenarios', requireAccess, scenarioRoutes);
router.use('/simulator', requireAccess, simulatorRoutes);
router.use('/analysis', requireAccess, analysisRoutes);
router.use('/challenges', requireAccess, challengeRoutes);
router.use('/leaderboard', requireAccess, leaderboardRoutes);

// Phase 21 Achievements & Progression
const achievementRoutes = require('./achievements');
router.use('/achievements', requireAccess, achievementRoutes);

module.exports = router;
