const express = require('express');
const Log = require('../models/Log');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// 一覧取得（公開）
router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.tag) {
    filter.tags = req.query.tag;
  }
  const logs = await Log.find(filter).sort({ date: -1, createdAt: -1 });
  res.json(logs);
});

// 登録（認証必須）
router.post('/', authMiddleware, async (req, res) => {
  const { date, content, tags } = req.body;

  if (!date || !content) {
    return res.status(400).json({ message: 'dateとcontentは必須です' });
  }

  const log = await Log.create({ date, content, tags: tags ?? [] });
  res.status(201).json(log);
});

// 更新（認証必須）
router.put('/:id', authMiddleware, async (req, res) => {
  const log = await Log.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
  if (!log) {
    return res.status(404).json({ message: 'ログが見つかりません' });
  }
  res.json(log);
});

// 削除（認証必須）
router.delete('/:id', authMiddleware, async (req, res) => {
  const log = await Log.findByIdAndDelete(req.params.id);
  if (!log) {
    return res.status(404).json({ message: 'ログが見つかりません' });
  }
  res.json({ message: '削除しました' });
});

module.exports = router;
