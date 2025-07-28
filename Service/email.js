const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
	secure: true,

  auth: {
    user: process.env.EMAIL_USER,     
    pass: process.env.EMAIL_PASS    
  },
 
});

const sendEmail = async (to, subject, text, html = null) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    });
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  sendEmail
};