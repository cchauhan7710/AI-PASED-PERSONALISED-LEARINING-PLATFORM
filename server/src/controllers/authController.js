const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In-memory fallback user store for demo/dev mode
const memoryUsers = [];

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_learning_path_generator_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const normalizedName = String(name || '').trim();
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPassword = String(password || '');

    if (!normalizedName || !normalizedEmail || !normalizedPassword) {
      return res.status(400).json({ success: false, message: 'Please enter all required fields' });
    }

    if (normalizedPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    if (confirmPassword && normalizedPassword !== String(confirmPassword)) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const isConnected = mongoose.connection.readyState === 1;

    if (isConnected) {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const user = await User.create({
        name: normalizedName,
        email: normalizedEmail,
        password: normalizedPassword
      });

      return res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id)
        }
      });
    } else {
      const userExists = memoryUsers.find((u) => u.email.toLowerCase() === normalizedEmail.toLowerCase());
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(normalizedPassword, salt);

      const newUser = {
        _id: `mem-user-${Date.now()}`,
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword
      };

      memoryUsers.push(newUser);

      return res.status(201).json({
        success: true,
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          token: generateToken(newUser._id)
        }
      });
    }
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
};

// @desc    Authenticate student & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPassword = String(password || '');

    if (!normalizedEmail || !normalizedPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const isConnected = mongoose.connection.readyState === 1;

    if (isConnected) {
      const user = await User.findOne({ email: normalizedEmail }).select('+password');
      if (user && (await user.matchPassword(normalizedPassword))) {
        return res.json({
          success: true,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
          }
        });
      }
    } else {
      const user = memoryUsers.find((u) => u.email.toLowerCase() === normalizedEmail.toLowerCase());
      if (user && (await bcrypt.compare(normalizedPassword, user.password))) {
        return res.json({
          success: true,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
          }
        });
      }
    }

    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    let user = null;

    if (isConnected && req.user._id) {
      user = await User.findById(req.user._id);
    } else {
      user = memoryUsers.find((u) => String(u._id) === String(req.user._id)) || req.user;
    }

    const safeUser = user ? { ...user } : null;
    if (safeUser) {
      delete safeUser.password;
    }

    res.json({
      success: true,
      data: safeUser || req.user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
