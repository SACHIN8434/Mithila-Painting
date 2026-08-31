// utils/generateResetToken.js
import jwt from 'jsonwebtoken';

export const generateResetToken = (userId) => {
  return jwt.sign({ id: userId, purpose: 'reset-password' }, process.env.JWT_SECRET, {
    expiresIn: '10m',
  });
};