const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const logsRoutes = require('./routes/logs');
const worksRoutes = require('./routes/works');
const githubRoutes = require('./routes/github');
const skillsRoutes = require('./routes/skills');
const quizRoutes = require('./routes/quiz');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/logs', logsRoutes);
app.use('/works', worksRoutes);
app.use('/github', githubRoutes);
app.use('/skills', skillsRoutes);
app.use('/quiz', quizRoutes);

// GitHub疎通確認（デバッグ用・後で削除）
app.get('/debug/github', async (req, res) => {
  const TOKEN = process.env.GITHUB_TOKEN;
  const USER = process.env.GITHUB_USER;
  const REPO = process.env.GITHUB_REPO;
  const result = { TOKEN_SET: !!TOKEN, TOKEN_PREFIX: TOKEN?.slice(0, 8), USER, REPO };

  try {
    const headers = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      Authorization: `Bearer ${TOKEN}`,
    };
    const testPath = `logs/debug-test.md`;
    const putRes = await fetch(`https://api.github.com/repos/${USER}/${REPO}/contents/${testPath}`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'debug: 疎通確認', content: Buffer.from('test').toString('base64') }),
    });
    const putData = await putRes.json();
    result.write_status = putRes.status;
    result.write_message = putData.message ?? 'ok';
    if (putRes.ok) {
      await fetch(`https://api.github.com/repos/${USER}/${REPO}/contents/${testPath}`, {
        method: 'DELETE',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'debug: 削除', sha: putData.content.sha }),
      });
    }
  } catch (e) {
    result.error = e.message;
  }
  res.json(result);
});

// グローバルエラーハンドラー
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'サーバーエラーが発生しました' });
});

module.exports = app;
