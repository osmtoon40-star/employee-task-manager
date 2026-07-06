const { body } = require('express-validator');
const validate = require('../middleware/validate');

const deleteImageValidator = [
  body('publicId')
    .trim()
    .notEmpty().withMessage('Cloudinary public id is required.')
    .isLength({ max: 200 }).withMessage('Cloudinary public id is invalid.'),
  validate
];

module.exports = {
  deleteImageValidator
};
