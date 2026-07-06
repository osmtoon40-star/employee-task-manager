const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../utils/token');
const HTTP_STATUS = require('../constants/httpStatus');

const authenticate = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;
  const token = req.cookies?.accessToken || headerToken;

  if (!token) {
    return next(new ApiError('Authentication is required to access this resource.', HTTP_STATUS.UNAUTHORIZED));
  }

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.sub;
    return next();
  } catch (error) {
    const message = error.name === 'TokenExpiredError'
      ? 'Authentication token has expired. Please sign in again.'
      : 'Authentication token is invalid or unauthorized.';
    return next(new ApiError(message, HTTP_STATUS.UNAUTHORIZED));
  }
};

module.exports = authenticate;
