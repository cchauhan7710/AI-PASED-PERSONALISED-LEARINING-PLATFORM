const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  completedTopics: [{
    type: String // Topic names
  }],
  currentTopic: {
    type: String,
    default: ''
  },
  skillProgress: [{
    skill: String,
    percentage: Number
  }],
  overallProgressPercentage: {
    type: Number,
    default: 0
  },
  weeklyStudyHours: {
    type: Number,
    default: 0
  },
  learningStreakDays: {
    type: Number,
    default: 1
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Progress', progressSchema);
