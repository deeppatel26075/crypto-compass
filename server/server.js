require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Initialize database connection
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`[Server] Crypto Compass API server listening on port ${PORT}`);
    console.log(`[Server] Health check available at: http://localhost:${PORT}/api/health`);
    console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Handle graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n[Server] Received ${signal}. Gracefully shutting down...`);
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

startServer();
