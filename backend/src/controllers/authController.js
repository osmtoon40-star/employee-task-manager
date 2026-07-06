const authService = require('../services/authService');
const HTTP_STATUS = require('../constants/httpStatus');
const { successResponse } = require('../utils/apiResponse');
const { getCookieOptions } = require('../utils/token');
const { verifyGoogleAccessToken } = require('../utils/googleToken');
const ApiError = require('../utils/ApiError');

const setAuthCookie = (res, token) => {
  res.cookie('accessToken', token, getCookieOptions());
};

const register = async (req, res) => {
  const result = await authService.register({ ...req.body, avatarFile: req.file });
  return successResponse(res, HTTP_STATUS.CREATED, 'Account registered successfully.', result);
};

const login = async (req, res) => {
  const result = await authService.login(req.body);
  setAuthCookie(res, result.token);
  return successResponse(res, HTTP_STATUS.OK, 'Login successful.', result);
};

const googleAuth = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new ApiError('Google ID token is required.', HTTP_STATUS.BAD_REQUEST, [
      { field: 'idToken', message: 'Google ID token is required.' }
    ]);
  }

  // Verify the Google access token by calling userinfo endpoint
  const payload = await verifyGoogleAccessToken(idToken);

  if (!payload.email) {
    throw new ApiError('Google token does not contain an email address.', HTTP_STATUS.BAD_REQUEST);
  }

  // Extract user info from Google token payload
  const result = await authService.googleAuth({
    idToken: payload.sub, // Google's unique user ID
    name: payload.name || payload.email.split('@')[0],
    email: payload.email,
    picture: payload.picture
  });

  setAuthCookie(res, result.token);
  return successResponse(res, HTTP_STATUS.OK, 'Google authentication successful.', result);
};

const forgotPassword = async (req, res) => {
  await authService.forgotPassword(req.body);
  return successResponse(res, HTTP_STATUS.OK, 'If an account exists, a reset link has been sent.');
};

const resetPassword = async (req, res) => {
  const result = await authService.resetPassword({
    token: req.params.token,
    password: req.body.password
  });
  setAuthCookie(res, result.token);
  return successResponse(res, HTTP_STATUS.OK, 'Password reset successfully.', result);
};

const me = async (req, res) => {
  const user = await authService.getCurrentUser(req.userId);
  return successResponse(res, HTTP_STATUS.OK, 'Authenticated user retrieved successfully.', { user });
};

const logout = async (_req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: 'lax'
  });
  return successResponse(res, HTTP_STATUS.OK, 'Logout successful.');
};

module.exports = {
  register,
  login,
  googleAuth,
  forgotPassword,
  resetPassword,
  me,
  logout
};
