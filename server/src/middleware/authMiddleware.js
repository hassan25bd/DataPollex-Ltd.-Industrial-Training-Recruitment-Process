import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';
import { dataStore } from '../services/dataStore.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_lms_jwt_key_2026');

      let user = null;
      if (isDbConnected()) {
        try {
          user = await User.findById(decoded.id).select('-password');
        } catch {
          user = null;
        }
      }

      if (!user) {
        user = await dataStore.findUserById(decoded.id);
      }

      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found or deactivated' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};
