const mongoose = require('mongoose');

const learningPathSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goal: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  estimatedDuration: {
    type: String,
    required: true
  },
  phases: [{
    phase: Number,
    title: String,
    duration: String,
    reason: String,
    topics: [{
      topicId: String,
      name: String,
      difficulty: String,
      estimatedHours: Number,
      prerequisites: [String],
      description: String,
      whyRecommended: String,
      resources: [{
        title: String,
        type: String,
        url: String,
        estimatedTime: String
      }],
      isCompleted: {
        type: Boolean,
        default: false
      },
      completedAt: Date
    }]
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 're-adjusted'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LearningPath', learningPathSchema);
