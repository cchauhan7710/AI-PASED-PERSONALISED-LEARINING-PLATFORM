const mongoose = require('mongoose');
const Progress = require('../models/Progress');
const StudentProfile = require('../models/StudentProfile');
const LearningPath = require('../models/LearningPath');

const memoryProgress = new Map();

// @desc    Get user progress metrics for Recharts & dashboard
// @route   GET /api/progress
// @access  Private
const getProgress = async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;

    let progress = null;
    let profile = null;
    let learningPath = null;

    if (isConnected) {
      progress = await Progress.findOne({ user: req.user._id });
      profile = await StudentProfile.findOne({ user: req.user._id });
      learningPath = await LearningPath.findOne({ user: req.user._id });
    } else {
      progress = memoryProgress.get(String(req.user._id));
    }

    if (!progress) {
      progress = {
        user: req.user._id,
        completedTopics: ['HTML Fundamentals'],
        currentTopic: 'JavaScript Fundamentals',
        overallProgressPercentage: 25,
        weeklyStudyHours: 14,
        learningStreakDays: 4,
        skillProgress: [
          { skill: 'HTML', percentage: 100 },
          { skill: 'CSS', percentage: 75 },
          { skill: 'JavaScript', percentage: 40 },
          { skill: 'React', percentage: 15 },
          { skill: 'Node.js', percentage: 0 },
          { skill: 'MongoDB', percentage: 0 }
        ]
      };
      if (!isConnected) {
        memoryProgress.set(String(req.user._id), progress);
      }
    }

    const progData = typeof progress.toObject === 'function' ? progress.toObject() : progress;

    res.json({
      success: true,
      data: {
        ...progData,
        careerGoal: profile?.careerGoal || 'MERN Stack Developer',
        estimatedDuration: learningPath?.estimatedDuration || '10 weeks'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Log study time or update streak
// @route   POST /api/progress
// @access  Private
const updateProgress = async (req, res) => {
  try {
    const { additionalHours } = req.body;
    const isConnected = mongoose.connection.readyState === 1;

    let progress = isConnected ? await Progress.findOne({ user: req.user._id }) : memoryProgress.get(String(req.user._id));
    if (!progress) {
      progress = {
        user: req.user._id,
        completedTopics: ['HTML Fundamentals'],
        currentTopic: 'JavaScript Fundamentals',
        overallProgressPercentage: 25,
        weeklyStudyHours: 14,
        learningStreakDays: 4,
        skillProgress: []
      };
    }

    if (additionalHours) {
      progress.weeklyStudyHours = (progress.weeklyStudyHours || 0) + Number(additionalHours);
    }

    if (isConnected) {
      progress.updatedAt = Date.now();
      await progress.save();
    } else {
      memoryProgress.set(String(req.user._id), progress);
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProgress,
  updateProgress
};
