const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback logger transporter
  return {
    sendMail: async (options) => {
      console.log('📧 [Mail Simulated]');
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      return { messageId: 'simulated-' + Date.now() };
    },
  };
};

const transporter = createTransporter();

module.exports = transporter;
