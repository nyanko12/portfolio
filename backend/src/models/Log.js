const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Log', logSchema);
