const express = require('express');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const { imageUpload } = require('../middleware/upload');
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator
} = require('../validators/authValidators');

const router = express.Router();

router.post('/register', imageUpload.single('avatar'), registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.post('/google', authController.googleAuth);
router.post('/forgot-password', forgotPasswordValidator, authController.forgotPassword);
router.post('/reset-password/:token', resetPasswordValidator, authController.resetPassword);
router.get('/me', authenticate, authController.me);
router.post('/logout', authController.logout);

module.exports = router;
