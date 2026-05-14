const mongoose = require('mongoose');

const quizStatsSchema = new mongoose.Schema(
  {
    totalAnswered: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    currentLevel: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    lastPlayedDate: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuizStats', quizStatsSchema);
