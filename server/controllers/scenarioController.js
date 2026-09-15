const scenarioService = require('../services/scenarioService');

/**
 * GET /api/scenarios/catalog
 * Returns lightweight catalog of all 10 scenarios
 */
async function getCatalog(req, res, next) {
  try {
    const catalog = scenarioService.getScenarioCatalog();
    return res.status(200).json({
      success: true,
      data: catalog,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/scenarios/:scenarioId
 * Returns scenario details with evaluation metadata stripped (pre-submission security)
 */
async function getScenario(req, res, next) {
  try {
    const { scenarioId } = req.params;
    const scenario = scenarioService.getScenarioById(scenarioId);
    return res.status(200).json({
      success: true,
      data: scenario,
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({
        success: false,
        error: err.message,
        code: err.code || 'SCENARIO_ERROR',
      });
    }
    next(err);
  }
}

/**
 * GET /api/scenarios/progress
 * Returns user completed scenarios and attempt history
 */
async function getProgress(req, res, next) {
  try {
    const userId = req.user?._id || req.user?.id;
    const progress = await scenarioService.getScenarioProgress(userId);
    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/scenarios/:scenarioId/submit
 * Evaluates selected option server-side and atomically records completion
 */
async function submitScenario(req, res, next) {
  try {
    const userId = req.user?._id || req.user?.id;
    const { scenarioId } = req.params;
    const { optionId } = req.body || {};

    const result = await scenarioService.submitScenario(userId, scenarioId, optionId);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({
        success: false,
        error: err.message,
        code: err.code || 'SCENARIO_SUBMIT_ERROR',
      });
    }
    next(err);
  }
}

module.exports = {
  getCatalog,
  getScenario,
  getProgress,
  submitScenario,
};
