const tradingService = require('../services/tradingService');

/**
 * Execute a paper trade order
 * POST /api/trading/orders
 */
const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { symbol, side, quantity, orderType, idempotencyKey } = req.body;

    const result = await tradingService.executeOrder(userId, {
      symbol,
      side,
      quantity,
      orderType,
      idempotencyKey,
    });

    return res.status(200).json({
      success: true,
      message: result.isIdempotentReplay
        ? 'Order already executed (idempotent replay).'
        : `Paper ${result.trade.side} order for ${result.trade.quantity} ${result.trade.symbol} executed successfully.`,
      data: result,
    });
  } catch (error) {
    if (
      error.message.includes('required') ||
      error.message.includes('valid') ||
      error.message.includes('positive') ||
      error.message.includes('greater than') ||
      error.message.includes('Quantity') ||
      error.message.includes('at least') ||
      error.message.includes('must be') ||
      error.message.includes('supported')
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.code === 'INSUFFICIENT_FUNDS') {
      return res.status(400).json({
        success: false,
        code: 'INSUFFICIENT_FUNDS',
        message: error.message,
      });
    }

    if (error.code === 'INSUFFICIENT_HOLDINGS') {
      return res.status(400).json({
        success: false,
        code: 'INSUFFICIENT_HOLDINGS',
        message: error.message,
      });
    }

    if (error.code === 'MARKET_PRICE_UNAVAILABLE') {
      return res.status(503).json({
        success: false,
        code: 'MARKET_PRICE_UNAVAILABLE',
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'An unexpected error occurred during trade execution.',
    });
  }
};

/**
 * Get user trading account info: current virtual wallet and active crypto holdings
 * GET /api/trading/account
 */
const getAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await tradingService.getTradingAccount(userId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getAccount,
};
