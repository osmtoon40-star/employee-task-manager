const multer = require('multer');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const storage = multer.memoryStorage();

const imageUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedImageTypes.includes(file.mimetype)) {
      return cb(new ApiError('Only JPEG, PNG, WebP, or GIF images are allowed.', HTTP_STATUS.BAD_REQUEST));
    }

    return cb(null, true);
  }
});

module.exports = {
  imageUpload
};
