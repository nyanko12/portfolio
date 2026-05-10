const express = require('express');
const { fetchRepos, fetchCommits } = require('../lib/github');

const router = express.Router();

// リポジトリ一覧（公開）
router.get('/repos', async (req, res) => {
  try {
    const repos = await fetchRepos();
    res.json(repos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 最新コミット取得（公開）
// クエリ: ?repo=リポジトリ名（省略時はGITHUB_USERのデフォルトリポジトリ）
router.get('/commits', async (req, res) => {
  const repo = req.query.repo || process.env.GITHUB_REPO;
  if (!repo) {
    return res.status(400).json({ message: 'repoクエリまたはGITHUB_REPO環境変数が必要です' });
  }
  try {
    const commits = await fetchCommits(repo);
    res.json(commits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
