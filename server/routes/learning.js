const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const learningController = require('../controllers/learningController');
const adaptiveLearningController = require('../controllers/adaptiveLearningController');

const router = express.Router();

/**
 * Phase 13 & Phase 18 Learning Platform Routes (Protected by requireAuth)
 */

// All endpoints require verified authentication
router.use(requireAuth);

// GET /api/learning/recommendations - Adaptive learning recommendations (Phase 18)
router.get('/recommendations', adaptiveLearningController.getRecommendations);

// GET /api/learning/catalog - Lightweight lesson metadata
router.get('/catalog', learningController.getCatalog);

// GET /api/learning/lessons/:lessonId - Full structured lesson detail
router.get('/lessons/:lessonId', learningController.getLesson);

// GET /api/learning/progress - User completed lessons
router.get('/progress', learningController.getProgress);

// POST /api/learning/progress/:lessonId/complete - Idempotent completion action
router.post('/progress/:lessonId/complete', learningController.completeLesson);

module.exports = router;
