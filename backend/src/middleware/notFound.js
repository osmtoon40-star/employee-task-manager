const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');

const notFound = (req, _res, next) => {
  next(new ApiError(`Route not found: ${req.originalUrl}`, HTTP_STATUS.NOT_FOUND));
};

module.exports = notFound;
