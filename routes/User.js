import express from 'express';
import {
  signup, verifyOtp, loginUser,
  forgotPassword, verifyResetOtp, resetPassword,
} from '../controllers/user.js';
const router = express.Router();

router.post("/signup",signup);
router.post("/verify-otp",verifyOtp)
router.get("/login",loginUser)
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);

export default router;
