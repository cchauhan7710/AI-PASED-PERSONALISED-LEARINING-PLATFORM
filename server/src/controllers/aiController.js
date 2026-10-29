const mongoose = require('mongoose');
const { analyzeSkillGaps, generateLearningRoadmap, aiTutorChat } = require('../services/aiService');
const StudentProfile = require('../models/StudentProfile');
const AssessmentResult = require('../models/AssessmentResult');

// @desc    Interactive AI Tutor Q&A
// @route   POST /api/ai/tutor
// @access  Private
const tutorChat = async (req, res) => {
  try {
    const { query, currentTopic, chatHistory } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Please provide a question for the AI Tutor' });
    }

    const isConnected = mongoose.connection.readyState === 1;
    let profile = null;

    if (isConnected) {
      profile = await StudentProfile.findOne({ user: req.user._id });
    }

    const careerGoal = profile ? profile.careerGoal : 'MERN Stack Developer';

    const tutorResponse = await aiTutorChat({
      query,
      careerGoal,
      currentTopic: currentTopic || 'JavaScript Fundamentals',
      chatHistory: chatHistory || []
    });

    res.json({
      success: true,
      data: tutorResponse
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Analyze student skills via AI
// @route   POST /api/ai/analyze-skills
// @access  Private
const analyzeSkillsEndpoint = async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    let profile = null;
    let assessmentResult = null;

    if (isConnected) {
      profile = await StudentProfile.findOne({ user: req.user._id });
      assessmentResult = await AssessmentResult.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    }

    const analysis = await analyzeSkillGaps(profile, assessmentResult);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  tutorChat,
  analyzeSkillsEndpoint
};
