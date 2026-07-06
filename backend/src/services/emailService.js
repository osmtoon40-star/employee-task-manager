const nodemailer = require('nodemailer');
const env = require('../config/env');

const createTransport = () => {
  if (!env.smtp.host || !env.smtp.user || !env.smtp.pass) {
    return nodemailer.createTransport({
      jsonTransport: true
    });
  }

  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass
    }
  });
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransport();
  await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject,
    html
  });
};

module.exports = { sendEmail };
