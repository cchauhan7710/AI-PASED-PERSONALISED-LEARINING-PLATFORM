const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Video', 'Article', 'Documentation', 'Practice', 'Project'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  estimatedTime: {
    type: String,
    default: '30 mins'
  },
  topicName: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Resource', resourceSchema);
