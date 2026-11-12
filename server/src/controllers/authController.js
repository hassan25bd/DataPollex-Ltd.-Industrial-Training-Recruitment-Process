import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';
import { dataStore } from '../services/dataStore.js';

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret_lms_jwt_key_2026', {
    expiresIn: '7d',
  });
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    let user = null;
    if (isDbConnected()) {
      try {
        user = await User.findOne({ email: email.toLowerCase() });
      } catch {
        user = null;
      }
    }

    if (!user) {
      user = await dataStore.findUserByEmail(email);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current admin profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    let user = null;
    if (isDbConnected()) {
      try {
        user = await User.findById(req.user._id).select('-password');
      } catch {
        user = null;
      }
    }

    if (!user) {
      user = await dataStore.findUserById(req.user._id || req.user.id);
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
