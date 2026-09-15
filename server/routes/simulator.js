const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const simulatorController = require('../controllers/simulatorController');

const router = express.Router();

/**
 * All simulator endpoints require authentication (Phase 3 session)
 */
router.use(requireAuth);

router.get('/portfolio', simulatorController.getPortfolio);
router.post('/calculate', simulatorController.calculate);

module.exports = router;
