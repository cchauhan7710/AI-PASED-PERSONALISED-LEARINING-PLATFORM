const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  skillName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Basic', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  estimatedHours: {
    type: Number,
    default: 4
  },
  prerequisites: [{
    type: String // Name of prerequisite topics
  }],
  description: {
    type: String,
    required: true
  },
  learningObjectives: [{
    type: String
  }],
  resources: [{
    title: String,
    type: { type: String, enum: ['Video', 'Article', 'Documentation', 'Practice', 'Project'] },
    url: String,
    estimatedTime: String
  }],
  practiceExercise: {
    title: String,
    instructions: String,
    starterCode: String
  },
  miniProject: {
    title: String,
    description: String,
    requirements: [String]
  }
});

module.exports = mongoose.model('Topic', topicSchema);
