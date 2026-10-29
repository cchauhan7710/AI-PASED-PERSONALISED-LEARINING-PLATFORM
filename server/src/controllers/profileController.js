const mongoose = require('mongoose');
const StudentProfile = require('../models/StudentProfile');

const memoryProfiles = new Map();

// @desc    Get student profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    let profile = null;

    if (isConnected) {
      profile = await StudentProfile.findOne({ user: req.user._id });
    } else {
      profile = memoryProfiles.get(String(req.user._id));
    }

    if (!profile) {
      // Default initial profile
      profile = {
        user: req.user._id,
        educationLevel: 'Undergraduate',
        careerGoal: 'MERN Stack Developer',
        experienceLevel: 'Beginner',
        existingSkills: ['HTML', 'CSS'],
        interests: ['Web Development'],
        dailyStudyHours: 2,
        weeklyStudyDays: 5,
        preferredLearningStyle: 'Project-based'
      };
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or Update student profile
// @route   PUT /api/profile
// @access  Private
const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      educationLevel,
      careerGoal,
      experienceLevel,
      existingSkills,
      interests,
      dailyStudyHours,
      weeklyStudyDays,
      preferredLearningStyle
    } = req.body;

    const profileFields = {
      user: req.user._id,
      educationLevel: educationLevel || 'Undergraduate',
      careerGoal: careerGoal || 'MERN Stack Developer',
      experienceLevel: experienceLevel || 'Beginner',
      existingSkills: Array.isArray(existingSkills) ? existingSkills : [],
      interests: Array.isArray(interests) ? interests : [],
      dailyStudyHours: Number(dailyStudyHours) || 2,
      weeklyStudyDays: Number(weeklyStudyDays) || 5,
      preferredLearningStyle: preferredLearningStyle || 'Project-based',
      updatedAt: Date.now()
    };

    const isConnected = mongoose.connection.readyState === 1;

    if (isConnected) {
      let profile = await StudentProfile.findOne({ user: req.user._id });
      if (profile) {
        profile = await StudentProfile.findOneAndUpdate(
          { user: req.user._id },
          { $set: profileFields },
          { new: true, runValidators: true }
        );
        return res.json({ success: true, data: profile, message: 'Profile updated successfully' });
      }
      profile = new StudentProfile(profileFields);
      await profile.save();
      return res.status(201).json({ success: true, data: profile, message: 'Profile created successfully' });
    } else {
      memoryProfiles.set(String(req.user._id), profileFields);
      return res.json({ success: true, data: profileFields, message: 'Profile saved successfully' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProfile,
  createOrUpdateProfile
};
