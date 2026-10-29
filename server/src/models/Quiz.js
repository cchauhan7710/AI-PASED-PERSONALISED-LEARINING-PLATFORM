const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  topicName: {
    type: String,
    required: true,
    unique: true
  },
  questions: [{
    questionId: String,
    question: String,
    options: [String],
    correctAnswer: Number, // index 0..3
    explanation: String
  }]
});

module.exports = mongoose.model('Quiz', quizSchema);
