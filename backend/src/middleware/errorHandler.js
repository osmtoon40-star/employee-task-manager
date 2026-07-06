const HTTP_STATUS = require('../constants/httpStatus');
const env = require('../config/env');

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const isProduction = env.nodeEnv === 'production';
  const isMalformedJson = err.type === 'entity.parse.failed';
  const isPayloadTooLarge = err.type === 'entity.too.large';
  const message = isMalformedJson
    ? 'Request body must be valid JSON.'
    : isPayloadTooLarge
      ? 'Request body is too large.'
      : statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR && isProduction
        ? 'An unexpected server error occurred.'
        : err.message || 'An unexpected server error occurred.';

  const response = {
    success: false,
    message,
    errors: err.errors || [],
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(response);
};

module.exports = errorHandler;
