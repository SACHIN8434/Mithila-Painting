// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // don't return password by default in queries
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      code: { type: String, select: false },
      expiresAt: { type: Date, select: false },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    addresses: [
      {
        label: String, // e.g. "Home", "Office"
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: "India" },
        isDefault: { type: Boolean, default: false },
      },
    ],
    phone: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});
// Compare password on login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
