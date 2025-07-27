const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // Use Gmail service
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, name) => {
  // Check if email credentials are properly configured
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com' || !process.env.EMAIL_PASS) {
    console.log('\n=== EMAIL NOT CONFIGURED: OTP EMAIL ===');
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`OTP: ${otp}`);
    console.log('Please configure EMAIL_USER and EMAIL_PASS in .env file');
    console.log('=======================================\n');
    
    return { 
      success: false, 
      error: 'Email credentials not configured properly',
      developmentMode: true 
    };
  }

  try {
    console.log('Attempting to send OTP email to:', email);
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Notes App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Notes App Registration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Notes App!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for signing up! Please use the following OTP to verify your email address:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't create an account with us, please ignore this email.</p>
          <p>Best regards,<br>Notes App Team</p>
        </div>
      `
    };
    
    console.log('Sending email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail
};
