const mongoose = require('mongoose');

const assessmentResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  careerGoal: {
    type: String,
    required: true
  },
  totalScore: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  skillBreakdown: [{
    skill: String,
    score: Number,
    total: Number,
    percentage: Number,
    level: {
      type: String,
      enum: ['Beginner', 'Basic', 'Intermediate', 'Advanced']
    }
  }],
  strongSkills: [String],
  improvementSkills: [String],
  missingSkills: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AssessmentResult', assessmentResultSchema);
