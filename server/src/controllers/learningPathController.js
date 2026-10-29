const mongoose = require('mongoose');
const LearningPath = require('../models/LearningPath');
const StudentProfile = require('../models/StudentProfile');
const AssessmentResult = require('../models/AssessmentResult');
const Progress = require('../models/Progress');
const { analyzeSkillGaps, generateLearningRoadmap, fallbackGenerateRoadmap } = require('../services/aiService');

const memoryPaths = new Map();

// @desc    Generate personalized learning path
// @route   POST /api/learning-path/generate
// @access  Private
const generatePath = async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;

    let profile = null;
    let assessmentResult = null;

    if (isConnected) {
      profile = await StudentProfile.findOne({ user: req.user._id });
      assessmentResult = await AssessmentResult.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    }

    const skillGaps = await analyzeSkillGaps(profile, assessmentResult);
    const roadmapJSON = await generateLearningRoadmap(profile, assessmentResult, skillGaps);

    if (isConnected) {
      let learningPath = await LearningPath.findOne({ user: req.user._id });

      if (learningPath) {
        learningPath.goal = roadmapJSON.goal;
        learningPath.summary = roadmapJSON.summary;
        learningPath.estimatedDuration = roadmapJSON.estimatedDuration;
        learningPath.phases = roadmapJSON.phases;
        learningPath.status = 'active';
        learningPath.updatedAt = Date.now();
        await learningPath.save();
      } else {
        learningPath = await LearningPath.create({
          user: req.user._id,
          goal: roadmapJSON.goal,
          summary: roadmapJSON.summary,
          estimatedDuration: roadmapJSON.estimatedDuration,
          phases: roadmapJSON.phases,
          status: 'active'
        });
      }
      return res.status(201).json({
        success: true,
        message: 'Personalized Learning Path generated successfully',
        data: learningPath
      });
    } else {
      const memoryPath = {
        _id: `mem-lp-${Date.now()}`,
        user: req.user._id,
        goal: roadmapJSON.goal,
        summary: roadmapJSON.summary,
        estimatedDuration: roadmapJSON.estimatedDuration,
        phases: roadmapJSON.phases,
        status: 'active'
      };
      memoryPaths.set(String(req.user._id), memoryPath);
      return res.status(201).json({
        success: true,
        message: 'Personalized Learning Path generated successfully',
        data: memoryPath
      });
    }
  } catch (error) {
    console.error('Generate path error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user learning path
// @route   GET /api/learning-path
// @access  Private
const getLearningPath = async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    let learningPath = null;

    if (isConnected) {
      learningPath = await LearningPath.findOne({ user: req.user._id });
    } else {
      learningPath = memoryPaths.get(String(req.user._id));
    }

    if (!learningPath) {
      const fallback = fallbackGenerateRoadmap({ careerGoal: 'MERN Stack Developer' });
      learningPath = {
        user: req.user._id,
        goal: fallback.goal,
        summary: fallback.summary,
        estimatedDuration: fallback.estimatedDuration,
        phases: fallback.phases,
        status: 'active'
      };
      if (!isConnected) {
        memoryPaths.set(String(req.user._id), learningPath);
      }
    }

    res.json({ success: true, data: learningPath });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update topic status (complete / toggle)
// @route   PUT /api/learning-path/update-topic-status
// @access  Private
const updateTopicStatus = async (req, res) => {
  try {
    const { topicName, isCompleted } = req.body;
    const isConnected = mongoose.connection.readyState === 1;

    let learningPath = isConnected
      ? await LearningPath.findOne({ user: req.user._id })
      : memoryPaths.get(String(req.user._id));

    if (!learningPath) {
      const fallback = fallbackGenerateRoadmap({ careerGoal: 'MERN Stack Developer' });
      learningPath = {
        user: req.user._id,
        goal: fallback.goal,
        summary: fallback.summary,
        estimatedDuration: fallback.estimatedDuration,
        phases: fallback.phases,
        status: 'active'
      };
    }

    let totalTopics = 0;
    let completedCount = 0;

    learningPath.phases.forEach((phase) => {
      phase.topics.forEach((t) => {
        totalTopics++;
        if (t.name.toLowerCase() === topicName.toLowerCase()) {
          t.isCompleted = isCompleted;
          if (isCompleted) t.completedAt = Date.now();
        }
        if (t.isCompleted) completedCount++;
      });
    });

    if (isConnected) {
      learningPath.updatedAt = Date.now();
      await learningPath.save();
    } else {
      memoryPaths.set(String(req.user._id), learningPath);
    }

    const overallPct = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

    res.json({
      success: true,
      message: `Topic ${topicName} updated to ${isCompleted ? 'Completed' : 'Incomplete'}`,
      overallProgressPercentage: overallPct,
      data: learningPath
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generatePath,
  getLearningPath,
  updateTopicStatus
};
