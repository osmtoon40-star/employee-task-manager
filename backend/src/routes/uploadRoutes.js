const express = require('express');
const authenticate = require('../middleware/auth');
const uploadController = require('../controllers/uploadController');
const { imageUpload } = require('../middleware/upload');
const { deleteImageValidator } = require('../validators/uploadValidators');

const router = express.Router();

router.use(authenticate);

router.post('/image', imageUpload.single('image'), uploadController.uploadImage);
router.delete('/image', deleteImageValidator, uploadController.deleteImage);

module.exports = router;
