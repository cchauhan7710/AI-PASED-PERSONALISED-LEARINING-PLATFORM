const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  educationLevel: {
    type: String,
    enum: ['High School', 'Undergraduate', 'Postgraduate', 'Self-Taught', 'Other'],
    default: 'Undergraduate'
  },
  careerGoal: {
    type: String,
    required: [true, 'Please select or enter a career goal'],
    trim: true
  },
  experienceLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  existingSkills: [{
    type: String,
    trim: true
  }],
  interests: [{
    type: String,
    trim: true
  }],
  dailyStudyHours: {
    type: Number,
    required: true,
    min: 0.5,
    max: 16,
    default: 2
  },
  weeklyStudyDays: {
    type: Number,
    required: true,
    min: 1,
    max: 7,
    default: 5
  },
  preferredLearningStyle: {
    type: String,
    enum: ['Video-based', 'Reading', 'Practice-based', 'Project-based', 'Mixed'],
    default: 'Project-based'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
