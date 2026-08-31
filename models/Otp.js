import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ['signup', 'reset-password'],
    default: 'signup',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 900, // auto-deletes after 5 min
  },
});

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;