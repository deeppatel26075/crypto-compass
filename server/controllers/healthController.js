const mongoose = require('mongoose');

/**
 * Health check controller.
 * Verifies that the API server is operational and reports database status.
 */
const getHealthStatus = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    success: true,
    message: 'Crypto Compass API is running',
    timestamp: new Date().toISOString(),
    database: dbStatusMap[dbState] || 'unknown',
  });
};

module.exports = {
  getHealthStatus,
};
