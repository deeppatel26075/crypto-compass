const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const scenarioController = require('../controllers/scenarioController');

const router = express.Router();

/**
 * All scenario endpoints require authentication (Phase 3 session)
 */
router.use(requireAuth);

// Static named routes first
router.get('/catalog', scenarioController.getCatalog);
router.get('/progress', scenarioController.getProgress);

// Parameterized routes
router.get('/:scenarioId', scenarioController.getScenario);
router.post('/:scenarioId/submit', scenarioController.submitScenario);

module.exports = router;
