const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const logsRoutes = require('./routes/logs');
const worksRoutes = require('./routes/works');
const githubRoutes = require('./routes/github');
const skillsRoutes = require('./routes/skills');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/logs', logsRoutes);
app.use('/works', worksRoutes);
app.use('/github', githubRoutes);
app.use('/skills', skillsRoutes);

// グローバルエラーハンドラー
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'サーバーエラーが発生しました' });
});

module.exports = app;
