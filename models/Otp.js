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
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // auto-deletes this doc 300 seconds (5 min) after creation
  },
});

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;