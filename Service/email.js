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
    console.log(`[Email Service] Attempting to send email to: ${to}, Subject: ${subject}`);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
      attachments: []
    };

    if (attachments && Array.isArray(attachments) && attachments.length) {
      console.log(`[Email Service] Processing ${attachments.length} attachment(s)`);
      for (const a of attachments) {
        // If path provided, resolve to absolute and stream it to avoid truncation issues
        if (a.path) {
          const abs = path.isAbsolute(a.path) ? a.path : path.resolve(a.path);
          // ensure file exists
          if (fs.existsSync(abs)) {
            mailOptions.attachments.push({ filename: a.filename || path.basename(abs), path: abs });
            console.log(`[Email Service] Added attachment: ${a.filename || path.basename(abs)}`);
          } else {
            console.warn(`[Email Service] Attachment not found, skipping: ${abs}`);
          }
        } else if (a.content) {
          mailOptions.attachments.push({ filename: a.filename || 'attachment', content: a.content });
          console.log(`[Email Service] Added content attachment: ${a.filename || 'attachment'}`);
        } else {
          // fallback: push raw object
          mailOptions.attachments.push(a);
          console.log('[Email Service] Added raw attachment');
        }
      }
    }

    console.log(`[Email Service] Sending email via SMTP - Host: ${process.env.EMAIL_HOST}, Port: ${process.env.EMAIL_PORT}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Email sent successfully - Response: ${info.response}`);
    return info;
  } catch (error) {
    console.error('[Email Service] Error sending email:', error.message);
    console.error('[Email Service] Full error:', error);
    throw error;
  }
};

module.exports = {
  sendEmail
};