const mongoose = require('mongoose');

const workSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: { type: [String], default: [] },
    reason: String,
    effort: String,
    difficulty: String,
    improvement: String,
    githubUrl: String,
    demoUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Work', workSchema);
