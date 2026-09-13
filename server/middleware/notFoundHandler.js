/**
 * Catch-all middleware for handling requests to undefined API endpoints.
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Resource not found: ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = notFoundHandler;
