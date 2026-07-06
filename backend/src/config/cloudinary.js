const cloudinary = require('cloudinary').v2;
const env = require('./env');

const hasCloudinaryConfig =
  env.cloudinary.cloudName &&
  env.cloudinary.apiKey &&
  env.cloudinary.apiSecret;

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true
  });
}

module.exports = {
  cloudinary,
  hasCloudinaryConfig
};
