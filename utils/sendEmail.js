import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use host/port for other providers
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password, not your real password
  },
});

export const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Your Store" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your account - OTP',
    html: `
      <div style="font-family: sans-serif;">
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This code expires in 5 minutes.</p>
      </div>
    `,
  });
};