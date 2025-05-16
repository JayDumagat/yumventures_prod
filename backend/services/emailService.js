const nodemailer = require('nodemailer');
const generateSixDigitCode = require('../utils/GenerateRandomCode'); 
require('dotenv').config();



const sendVerificationEmail = async (toEmail) => {
  const verificationCode = generateSixDigitCode();
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, 
    auth: {
      user: process.env.EMAIL_LOGIN,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Yumventures" <' + "jarylepaymalan17@gmail.com" + '>',
    to: toEmail,
    subject: 'Your Verification Code',
    text: `Your verification code is: ${verificationCode}`,
    html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent: %s', info.messageId);
    return verificationCode
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};

module.exports = sendVerificationEmail;
