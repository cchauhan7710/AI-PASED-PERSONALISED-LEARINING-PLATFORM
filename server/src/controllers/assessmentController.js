const mongoose = require('mongoose');
const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const StudentProfile = require('../models/StudentProfile');
const { evaluateAssessment } = require('../utils/calculateScores');
const { assessmentsData } = require('../utils/seedData');

const memoryResults = new Map();

// @desc    Get diagnostic assessment questions by career goal
// @route   GET /api/assessment/questions
// @access  Private
const getQuestions = async (req, res) => {
  try {
    const goal = req.query.goal || 'MERN Stack Developer';
    const isConnected = mongoose.connection.readyState === 1;

    let assessment = null;
    if (isConnected) {
      assessment = await Assessment.findOne({ careerGoal: goal });
    }

    if (!assessment) {
      const foundSeed = assessmentsData.find((a) => a.careerGoal.toLowerCase() === goal.toLowerCase());
      assessment = foundSeed || assessmentsData[0];
    }

    const clientQuestions = assessment.questions.map((q) => ({
      questionId: q.questionId,
      question: q.question,
      options: q.options,
      skill: q.skill,
      difficulty: q.difficulty
    }));

    res.json({
      success: true,
      careerGoal: assessment.careerGoal,
      count: clientQuestions.length,
      questions: clientQuestions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit assessment answers, calculate scores & store result
// @route   POST /api/assessment/submit
// @access  Private
const submitAssessment = async (req, res) => {
  try {
    const { careerGoal, userAnswers } = req.body;

    if (!userAnswers) {
      return res.status(400).json({ success: false, message: 'Please provide user answers' });
    }

    const goal = careerGoal || 'MERN Stack Developer';
    const isConnected = mongoose.connection.readyState === 1;

    let assessment = null;
    if (isConnected) {
      assessment = await Assessment.findOne({ careerGoal: goal });
    }

    if (!assessment) {
      const foundSeed = assessmentsData.find((a) => a.careerGoal.toLowerCase() === goal.toLowerCase());
      assessment = foundSeed || assessmentsData[0];
    }

    const evaluation = evaluateAssessment(userAnswers, assessment.questions);

    let missingSkills = ['React', 'Node.js', 'Express.js', 'MongoDB'];

    const resultData = {
      user: req.user._id,
      careerGoal: goal,
      totalScore: evaluation.totalScore,
      totalQuestions: evaluation.totalQuestions,
      percentage: evaluation.percentage,
      skillBreakdown: evaluation.skillBreakdown,
      strongSkills: evaluation.strongSkills,
      improvementSkills: evaluation.improvementSkills,
      missingSkills,
      createdAt: Date.now()
    };

    if (isConnected) {
      const saved = await AssessmentResult.create(resultData);
      return res.status(201).json({
        success: true,
        message: 'Assessment completed successfully',
        data: saved
      });
    } else {
      memoryResults.set(String(req.user._id), resultData);
      return res.status(201).json({
        success: true,
        message: 'Assessment completed successfully',
        data: resultData
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recent assessment results
// @route   GET /api/assessment/results
// @access  Private
const getAssessmentResults = async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    let result = null;

    if (isConnected) {
      result = await AssessmentResult.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    } else {
      result = memoryResults.get(String(req.user._id));
    }

    if (!result) {
      result = {
        careerGoal: 'MERN Stack Developer',
        totalScore: 4,
        totalQuestions: 7,
        percentage: 57,
        skillBreakdown: [
          { skill: 'HTML', score: 1, total: 1, percentage: 100, level: 'Advanced' },
          { skill: 'CSS', score: 1, total: 1, percentage: 100, level: 'Advanced' },
          { skill: 'JavaScript', score: 1, total: 2, percentage: 50, level: 'Basic' },
          { skill: 'React', score: 0, total: 1, percentage: 0, level: 'Beginner' },
          { skill: 'Express.js', score: 1, total: 1, percentage: 100, level: 'Advanced' },
          { skill: 'MongoDB', score: 0, total: 1, percentage: 0, level: 'Beginner' }
        ],
        strongSkills: ['HTML', 'CSS', 'Express.js'],
        improvementSkills: ['JavaScript'],
        missingSkills: ['React', 'MongoDB']
      };
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getQuestions,
  submitAssessment,
  getAssessmentResults
};
