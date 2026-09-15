const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const quizController = require('../controllers/quizController');

const router = express.Router();

/**
 * All quiz endpoints require authentication (Phase 3 session)
 */
router.use(requireAuth);

// Static named routes first
router.get('/catalog', quizController.getCatalog);
router.get('/progress', quizController.getProgress);

// Parameterized routes
router.get('/:quizId', quizController.getQuiz);
router.post('/:quizId/submit', quizController.submitQuiz);

module.exports = router;
