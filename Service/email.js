const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const emailPort = Number(process.env.EMAIL_PORT || 0);
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: emailPort || undefined,
  secure: emailPort === 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendEmail = async (to, subject, text, html = null, attachments = []) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject,
      text,
      html,
      attachments: []
    };

    if (attachments && Array.isArray(attachments) && attachments.length) {
      for (const a of attachments) {
        // If path provided, resolve to absolute and stream it to avoid truncation issues
        if (a.path) {
          const abs = path.isAbsolute(a.path) ? a.path : path.resolve(a.path);
          // ensure file exists
          if (fs.existsSync(abs)) {
            mailOptions.attachments.push({ filename: a.filename || path.basename(abs), path: abs });
          } else {
            console.warn('Attachment not found, skipping:', abs);
          }
        } else if (a.content) {
          mailOptions.attachments.push({ filename: a.filename || 'attachment', content: a.content });
        } else {
          // fallback: push raw object
          mailOptions.attachments.push(a);
        }
      }
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  sendEmail
};