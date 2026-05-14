const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: Number, required: true },
    questionType: { type: String, enum: ['choice', 'text'], required: true },
    subject: { type: String, required: true },
    questionText: { type: String, required: true },
    userAnswer: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    score: { type: Number, required: true },
    feedback: { type: String, default: null },
  },
  { _id: false }
);

const quizSessionSchema = new mongoose.Schema(
  {
    playedAt: { type: Date, default: Date.now },
    level: { type: Number, required: true },
    subjects: { type: [String], required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    modelUsed: { type: String, required: true },
    answers: { type: [answerSchema], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuizSession', quizSessionSchema);
