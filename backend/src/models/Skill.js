const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['language', 'frontend', 'backend', 'database'],
      required: true,
    },
    level: {
      type: String,
      enum: ['advanced', 'basic', 'learning', 'experienced'],
      required: true,
    },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
