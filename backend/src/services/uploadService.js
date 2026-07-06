const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');
const env = require('../config/env');
const { cloudinary, hasCloudinaryConfig } = require('../config/cloudinary');

const uploadImage = async ({ file, folder = env.cloudinary.folder }) => {
  if (!file) {
    throw new ApiError('Image file is required.', HTTP_STATUS.BAD_REQUEST, [
      { field: 'image', message: 'Please attach an image file.' }
    ]);
  }

  if (!hasCloudinaryConfig) {
    throw new ApiError('Cloudinary is not configured on the server.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        overwrite: false,
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          return reject(new ApiError('Image upload failed. Please try again.', HTTP_STATUS.INTERNAL_SERVER_ERROR));
        }

        return resolve({
          publicId: result.public_id,
          url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes
        });
      }
    );

    stream.end(file.buffer);
  });
};

const deleteImage = async (publicId) => {
  if (!publicId) {
    throw new ApiError('Cloudinary public id is required.', HTTP_STATUS.BAD_REQUEST);
  }

  if (!hasCloudinaryConfig) {
    throw new ApiError('Cloudinary is not configured on the server.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
};

module.exports = {
  uploadImage,
  deleteImage
};
