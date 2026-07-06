const https = require('https');
const env = require('../config/env');
const ApiError = require('./ApiError');
const HTTP_STATUS = require('../constants/httpStatus');

/**
 * Verify a Google OAuth access token by calling Google's userinfo endpoint.
 * The frontend sends an access token obtained via useGoogleLogin (implicit flow),
 * which includes scopes for profile and email.
 *
 * @param {string} accessToken - The OAuth access token from Google
 * @returns {Promise<Object>} - User profile payload { sub, name, email, picture }
 */
const verifyGoogleAccessToken = (accessToken) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.googleapis.com',
      port: 443,
      path: '/oauth2/v3/userinfo',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const payload = JSON.parse(data);

          if (res.statusCode !== 200) {
            return reject(
              new ApiError(
                payload.error_description || payload.error || 'Google token verification failed.',
                HTTP_STATUS.UNAUTHORIZED
              )
            );
          }

          if (!payload.email) {
            return reject(
              new ApiError(
                'Google account does not have an email address.',
                HTTP_STATUS.BAD_REQUEST
              )
            );
          }

          // Verify that the token was issued for this client
          if (!payload.email_verified) {
            return reject(
              new ApiError(
                'Google email is not verified.',
                HTTP_STATUS.UNAUTHORIZED
              )
            );
          }

          resolve({
            sub: payload.sub,
            name: payload.name,
            email: payload.email,
            picture: payload.picture
          });
        } catch (error) {
          reject(
            new ApiError(
              'Failed to parse Google user info response.',
              HTTP_STATUS.INTERNAL_SERVER_ERROR
            )
          );
        }
      });
    });

    req.on('error', (error) => {
      reject(
        new ApiError(
          error.message || 'Google API is unreachable.',
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
      );
    });

    req.on('timeout', () => {
      req.destroy();
      reject(
        new ApiError(
          'Google API request timed out.',
          HTTP_STATUS.GATEWAY_TIMEOUT
        )
      );
    });

    req.end();
  });
};

module.exports = {
  verifyGoogleAccessToken
};
