const express = require('express');
const marketService = require('../services/marketService');

const router = express.Router();

/**
 * GET /api/markets
 * Returns normalized cryptocurrency market data list.
 * Query params: ?refresh=true (forces backend cache bypass)
 */
router.get('/', async (req, res, next) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const result = await marketService.getMarkets(forceRefresh);

    return res.status(200).json({
      success: true,
      data: result.markets,
      isStale: result.isStale,
      cachedAt: result.cachedAt,
    });
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: err.message || 'Market data is temporarily unavailable. Please try again.',
    });
  }
});

/**
 * GET /api/markets/:symbol/chart
 * Returns historical price points for an asset.
 * Query params: ?timeframe=24h|7d|30d|90d|1y
 */
router.get('/:symbol/chart', async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const timeframe = req.query.timeframe || '7d';

    const validTimeframes = ['24h', '7d', '30d', '90d', '1y'];
    if (!validTimeframes.includes(timeframe.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid timeframe. Allowed: ${validTimeframes.join(', ')}`,
      });
    }

    const result = await marketService.getMarketChart(symbol, timeframe);

    return res.status(200).json({
      success: true,
      symbol: symbol.toUpperCase(),
      timeframe: timeframe.toLowerCase(),
      data: result.points,
      isStale: result.isStale,
      cachedAt: result.cachedAt,
    });
  } catch (err) {
    if (err.message.includes('Invalid symbol') || err.message.includes('required')) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(503).json({
      success: false,
      message: err.message || 'Chart data is temporarily unavailable.',
    });
  }
});

/**
 * GET /api/markets/:symbol
 * Returns single asset market data by symbol (e.g. btc, eth, sol)
 */
router.get('/:symbol', async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const result = await marketService.getMarketBySymbol(symbol);

    if (!result || !result.asset) {
      return res.status(404).json({
        success: false,
        message: `Asset '${symbol.toUpperCase()}' not found or unsupported.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.asset,
      isStale: result.isStale,
      cachedAt: result.cachedAt,
    });
  } catch (err) {
    if (err.message.includes('Invalid symbol format') || err.message.includes('symbol is required')) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(503).json({
      success: false,
      message: err.message || 'Market data is temporarily unavailable.',
    });
  }
});

module.exports = router;
