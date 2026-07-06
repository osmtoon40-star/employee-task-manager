const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');
const {
  getPasswordError,
  isPlainString,
  isValidEmail,
  isValidName,
  normalizeEmail,
  normalizeName
} = require('../utils/authValidation');

const rejectUnknownFields = (allowedFields) => (req, _res, next) => {
  const unexpectedFields = Object.keys(req.body || {}).filter((field) => !allowedFields.includes(field));
  if (unexpectedFields.length) {
    return next(new ApiError('Request contains fields that are not allowed.', HTTP_STATUS.BAD_REQUEST, unexpectedFields.map((field) => ({
      field,
      message: `${field} is not an allowed field.`
    }))));
  }
  return next();
};

const emailRule = (emptyMessage = 'Please enter your email address.') => body('email')
  .customSanitizer(normalizeEmail)
  .custom((value) => isPlainString(value)).withMessage('Please enter a valid email address.')
  .bail()
  .notEmpty().withMessage(emptyMessage)
  .bail()
  .custom(isValidEmail).withMessage('Please enter a valid email address.');

const passwordRule = () => body('password')
  .custom((value) => {
    const error = getPasswordError(value);
    if (error) throw new Error(error);
    return true;
  });

const confirmPasswordRule = (emptyMessage = 'Please confirm your password.') => body('confirmPassword')
  .custom((value, { req }) => {
    if (!isPlainString(value) || !value) throw new Error(emptyMessage);
    if (value !== req.body.password) throw new Error('Passwords do not match. Please try again.');
    return true;
  });

const registerValidator = [
  rejectUnknownFields(['name', 'email', 'password', 'confirmPassword']),
  body('name')
    .customSanitizer(normalizeName)
    .custom((value) => isPlainString(value)).withMessage('Please enter your full name.')
    .bail()
    .notEmpty().withMessage('Please enter your full name.')
    .bail()
    .isLength({ min: 3, max: 50 }).withMessage('Full name must contain at least 3 characters.')
    .bail()
    .custom(isValidName).withMessage('Full name can only contain letters and spaces.'),
  emailRule(),
  passwordRule(),
  confirmPasswordRule(),
  validate
];

const loginValidator = [
  rejectUnknownFields(['email', 'password']),
  emailRule(),
  body('password')
    .custom((value) => isPlainString(value)).withMessage('Please enter your password.')
    .bail()
    .notEmpty().withMessage('Please enter your password.'),
  validate
];

const forgotPasswordValidator = [
  rejectUnknownFields(['email']),
  emailRule('Please enter your registered email address.'),
  validate
];

const resetPasswordValidator = [
  rejectUnknownFields(['password', 'confirmPassword']),
  param('token')
    .isHexadecimal().withMessage('This password reset link has expired. Please request a new one.')
    .bail()
    .isLength({ min: 64, max: 64 }).withMessage('This password reset link has expired. Please request a new one.'),
  passwordRule(),
  confirmPasswordRule('Please confirm your new password.'),
  validate
];

module.exports = {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator
};
