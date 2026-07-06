const crypto = require('crypto');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');
const { signToken } = require('../utils/token');
const uploadService = require('./uploadService');
const { sendEmail } = require('./emailService');
const buildPasswordResetEmail = require('../templates/emails/passwordResetEmail');
const env = require('../config/env');
const { normalizeEmail, normalizeName } = require('../utils/authValidation');

const register = async ({ name, email, password, avatarFile }) => {
  const normalizedName = normalizeName(name);
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError('An account with this email address already exists. Please sign in instead.', HTTP_STATUS.CONFLICT, [
      { field: 'email', message: 'An account with this email address already exists. Please sign in instead.' }
    ]);
  }

  let avatarUrl;
  if (avatarFile) {
    const uploadResult = await uploadService.uploadImage({ file: avatarFile, folder: `${env.cloudinary.folder}/avatars` });
    avatarUrl = uploadResult.url;
  }

  const user = await User.create({ name: normalizedName, email: normalizedEmail, password, avatarUrl });
  const token = signToken(user._id);
  return { user: user.toSafeObject(), token };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: normalizeEmail(email) }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError('The email address or password you entered is incorrect.', HTTP_STATUS.UNAUTHORIZED);
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const token = signToken(user._id);
  return { user: user.toSafeObject(), token };
};

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email: normalizeEmail(email) }).select('+passwordResetToken +passwordResetExpires');
  if (!user) return;

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${env.clientUrl}/reset-password/${resetToken}`;
  const html = buildPasswordResetEmail({ name: user.name, resetUrl });

  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset your Employee Task Manager password',
      html
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError('Password reset email could not be sent. Please try again later.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

const resetPassword = async ({ token, password }) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  }).select('+password +passwordResetToken +passwordResetExpires');

  if (!user) {
    throw new ApiError('This password reset link has expired. Please request a new one.', HTTP_STATUS.BAD_REQUEST);
  }

  if (await user.comparePassword(password)) {
    throw new ApiError('New password must be different from your current password.', HTTP_STATUS.BAD_REQUEST, [
      { field: 'password', message: 'New password must be different from your current password.' }
    ]);
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const jwtToken = signToken(user._id);
  return { user: user.toSafeObject(), token: jwtToken };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError('User account no longer exists.', HTTP_STATUS.UNAUTHORIZED);
  return user.toSafeObject();
};

const googleAuth = async ({ idToken, name, email, picture }) => {
  const normalizedEmail = normalizeEmail(email);
  
  // Check if user already exists with this email
  let user = await User.findOne({ email: normalizedEmail });

  if (user) {
    // Existing user: log them in (update google info if not set)
    if (!user.googleId) {
      user.googleId = idToken;
      user.provider = 'google';
      if (picture && !user.avatarUrl) {
        user.avatarUrl = picture;
      }
      await user.save({ validateBeforeSave: false });
    }
  } else {
    // New user: create account with Google credentials
    user = await User.create({
      name,
      email: normalizedEmail,
      avatarUrl: picture,
      provider: 'google',
      googleId: idToken,
      role: 'employee'
    });
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const token = signToken(user._id);
  return { user: user.toSafeObject(), token };
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  googleAuth
};
