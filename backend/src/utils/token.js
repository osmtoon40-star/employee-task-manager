const jwt = require('jsonwebtoken');
const env = require('../config/env');

const signToken = (userId) =>
  jwt.sign({ sub: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

const verifyToken = (token) => jwt.verify(token, env.jwtSecret);

const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
  expires: new Date(Date.now() + env.jwtCookieExpiresDays * 24 * 60 * 60 * 1000)
});

module.exports = { signToken, verifyToken, getCookieOptions };
