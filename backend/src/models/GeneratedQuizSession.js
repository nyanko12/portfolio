const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    type: { type: String, enum: ['choice', 'text'], required: true },
    subject: { type: String, required: true },
    text: { type: String, required: true },
    options: { type: [String], default: [] },
    answer: { type: String, required: true },
    keywords: { type: [String], default: [] },
  },
  { _id: false }
);

const generatedQuizSessionSchema = new mongoose.Schema({
  level: { type: Number, required: true },
  subjects: { type: [String], required: true },
  modelUsed: { type: String, required: true },
  questions: { type: [questionSchema], required: true },
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date, required: true },
});

// TTLインデックス: expireAt を過ぎたドキュメントを自動削除
generatedQuizSessionSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('GeneratedQuizSession', generatedQuizSessionSchema);
