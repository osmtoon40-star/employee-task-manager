const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');

const validate = (req, _res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((error) => ({
    field: error.path,
    message: error.msg
  }));

  return next(new ApiError('Validation failed. Please review the submitted fields.', HTTP_STATUS.BAD_REQUEST, errors));
};

module.exports = validate;
