const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');

const app = express();

// Request body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// Mount central API router
app.use('/api', apiRoutes);

// Root route placeholder
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Crypto Compass Backend API',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// 404 handler for undefined routes
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
