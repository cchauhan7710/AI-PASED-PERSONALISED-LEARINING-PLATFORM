const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  careerGoal: {
    type: String,
    required: true
  },
  questions: [{
    questionId: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: Number, // Index of correct option (0, 1, 2, 3)
      required: true
    },
    skill: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Basic', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    }
  }]
});

module.exports = mongoose.model('Assessment', assessmentSchema);
