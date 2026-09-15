const simulatorService = require('../services/simulatorService');

/**
 * GET /api/simulator/portfolio
 * Returns user's active holdings with server-authoritative market prices
 */
async function getPortfolio(req, res, next) {
  try {
    const userId = req.user?._id || req.user?.id;
    const data = await simulatorService.getUserSimulatorHoldings(userId);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/simulator/calculate
 * Calculates hypothetical portfolio outcome under user-specified percentage change
 */
async function calculate(req, res, next) {
  try {
    const userId = req.user?._id || req.user?.id;
    const { symbol, percentageChange } = req.body || {};

    const data = await simulatorService.calculateHypotheticalOutcome(
      userId,
      symbol,
      percentageChange
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({
        success: false,
        error: err.message,
        code: err.code || 'SIMULATOR_ERROR',
        priceAvailable: err.priceAvailable !== undefined ? err.priceAvailable : true,
      });
    }
    next(err);
  }
}

module.exports = {
  getPortfolio,
  calculate,
};
