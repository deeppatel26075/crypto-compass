/**
 * Centralized Error Handling Middleware.
 * Standardizes API error responses and hides stack traces in production.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode || 500);
  const isProduction = process.env.NODE_ENV === 'production';

  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  if (!isProduction && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
