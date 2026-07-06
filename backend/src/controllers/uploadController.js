const uploadService = require('../services/uploadService');
const HTTP_STATUS = require('../constants/httpStatus');
const { successResponse } = require('../utils/apiResponse');

const uploadImage = async (req, res) => {
  const image = await uploadService.uploadImage({
    file: req.file,
    folder: req.body.folder
  });

  return successResponse(res, HTTP_STATUS.CREATED, 'Image uploaded successfully.', { image });
};

const deleteImage = async (req, res) => {
  await uploadService.deleteImage(req.body.publicId);
  return successResponse(res, HTTP_STATUS.OK, 'Image deleted successfully.');
};

module.exports = {
  uploadImage,
  deleteImage
};
