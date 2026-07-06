const successResponse = (res, statusCode, message, data = null) =>
  res.status(statusCode).json({
    success: true,
    message,
    data,
    errors: [],
    timestamp: new Date().toISOString()
  });

module.exports = { successResponse };
