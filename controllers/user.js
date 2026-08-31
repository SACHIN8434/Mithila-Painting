import { generateToken } from "../utils/generateToken.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendOtpEmail } from "../utils/sendEmail.js";
import { generateResetToken } from '../utils/generateResetToken.js';
import jwt from 'jsonwebtoken';

import User from "../models/User.js";
import Otp from "../models/Otp.js";
export const signup = async (req, res) => {
  try {
    console.log("comming to user signup send otp");
    const { name, email, password } = req.body;
    console.log("data is ", name, " ", email, ", ", password, ", ");
    if ((!name || !email, !password)) {
      return res.status(400).json({
        message: "All fields are requierd",
      });
    }

    //check user exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // clear any previous unexpired OTP for this email
    // signup verifyOtp
await Otp.deleteMany({ email, purpose: 'signup' }); // add purpose filter here too

// resendOtp (signup)
await Otp.deleteMany({ email, purpose: 'signup' });
    //generate otp
    const otp = generateOtp();

await Otp.create({ email, code: otp, purpose: 'signup' });
    await sendOtpEmail(email, otp);
    return res.status(200).json({
      message: "OTP sent to your email. Verify to complete signup.",
    });
  } catch (err) {
    console.log("Error came in the signup ", err);
  }
};

// @route POST /api/user/verify-otp
// Frontend sends back name, email, password (held client-side) + otp
// User is actually created here, for the first time

export const verifyOtp = async (req, res) => {
  try {
    console.log("Comming in verify-otp");
    const { name, email, password, otp } = req.body;
    console.log(
      "req body is ",
      "name ",
      name,
      " email ",
      email,
      " password ",
      password,
      " otp ",
      otp,
    );

    //check the fiels availability
    if ((!name, !email, !password, !otp)) {
      res.status(400).json({
        message: "All fields are required",
      });
    }

    //check user exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User Already exist",
      });
    }

    //match the otp
    const matchOtp = await Otp.findOne({ email, code: otp });
    if (!matchOtp) {
      return res.status(400).json({
        message: "OTP is not matched...",
      });
    }

    //create user
    const newUser = await User.create({
      name,
      email,
      password,
      isVerified: true,
    });

    //clean up the otp
    await Otp.deleteMany({ email });
    const token = generateToken(newUser._id);
    return res.status(201).json({
      message: "User Created Succussfully",
      token,
    });
  } catch (err) {
    console.log("Error occured in verify-top", err);
  }
};

//login api
export const loginUser = async (req, res) => {
  try {
    console.log("Comming in the loginuser")
    const { email, password } = req.body;

    //form validaton
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    //finding the user
const findUser = await User.findOne({ email }).select("+password");
    //check the user exist or not
    if (!findUser) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    //compare the password
    const isMatch = await findUser.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }


    //generate token
    const token = generateToken(findUser._id);

    //return the result
    return res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: findUser._id,
        name: findUser.name,
        email: findUser.email,
        role: findUser.role,
      },
    });
  } catch (err) {
    console.log("Error occured while the login...", err);
    return res.status(400).json({
      message: "Error occured while login",
    });
  }
};





// STEP 1 — @route POST /api/user/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("forgotPassword called with:", email);

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    console.log("User found:", user ? user.email : "NOT FOUND");

    if (!user) {
      return res.status(200).json({
        message: 'If that email is registered, an OTP has been sent',
      });
    }

    await Otp.deleteMany({ email, purpose: 'reset-password' });

    const otp = generateOtp();
    console.log("Generated OTP:", otp);

    const otpDoc = await Otp.create({ email, code: otp, purpose: 'reset-password' });
    console.log("OTP saved to DB:", otpDoc);

    await sendOtpEmail(email, otp);
    console.log("Email sent successfully");

    return res.status(200).json({
      message: 'If that email is registered, an OTP has been sent',
    });
  } catch (err) {
    console.log('Error in forgotPassword', err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// STEP 2 — @route POST /api/user/verify-reset-otp
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const matchOtp = await Otp.findOne({ email, code: otp, purpose: 'reset-password' });
    if (!matchOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP is correct — consume it, issue a short-lived reset token
    await Otp.deleteMany({ email, purpose: 'reset-password' });

    const resetToken = generateResetToken(user._id);

    return res.status(200).json({
      message: 'OTP verified',
      resetToken, // frontend stores this temporarily, sends it in step 3
    });
  } catch (err) {
    console.log('Error in verifyResetOtp', err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// STEP 3 — @route POST /api/user/reset-password
export const resetPassword = async (req, res) => {
  try {

      console.log('VERIFYING with secret:', process.env.JWT_SECRET);

    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: 'Reset token and new password are required' });
    }

    let decoded;
    try {
  console.log('VERIFYING with secret:', process.env.JWT_SECRET);
  decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
} catch (err) {
  console.log('jwt.verify actual error:', err.name, err.message); // <-- this is key
  return res.status(400).json({ message: 'Reset link expired or invalid, please try again' });
}

    if (decoded.purpose !== 'reset-password') {
      return res.status(400).json({ message: 'Invalid reset token' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword; // pre('save') hook will hash it automatically
    await user.save();

    return res.status(200).json({ message: 'Password reset successful, please login' });
  } catch (err) {
    console.log('Error in resetPassword', err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
