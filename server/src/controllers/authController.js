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

const isDbAvailable = () => mongoose.connection.readyState === 1;

const createMemoryUser = async (normalizedName, normalizedEmail, normalizedPassword) => {
  const existingUser = memoryUsers.find((u) => u.email.toLowerCase() === normalizedEmail.toLowerCase());
  if (existingUser) {
    throw Object.assign(new Error('User already exists with this email'), { statusCode: 400 });
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
  return newUser;
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

    if (isDbAvailable()) {
      try {
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
      } catch (dbError) {
        console.error('Mongo registration failed, falling back to memory store:', dbError.message);
      }
    }

    const newUser = await createMemoryUser(normalizedName, normalizedEmail, normalizedPassword);

    return res.status(201).json({
      success: true,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: generateToken(newUser._id)
      }
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error('Register error:', error.message);
    return res.status(statusCode).json({ success: false, message: error.message || 'Registration failed' });
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

    if (isDbAvailable()) {
      try {
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
      } catch (dbError) {
        console.error('Mongo login failed, falling back to memory store:', dbError.message);
      }
    }

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

    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Not authorized, no user found' });
    }

    let user = null;

    if (isDbAvailable()) {
      try {
        user = await User.findById(req.user._id);
      } catch (dbError) {
        console.error('Mongo getMe failed, using memory fallback:', dbError.message);
      }
    }

    if (!user) {
      user = memoryUsers.find((u) => String(u._id) === String(req.user._id)) || req.user;
    }

    const safeUser = user ? { ...user } : null;
    if (safeUser) {
      delete safeUser.password;
    }

    return res.json({
      success: true,
      data: safeUser || req.user
    });
  } catch (error) {
    console.error('GetMe error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
