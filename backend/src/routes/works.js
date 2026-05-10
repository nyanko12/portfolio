const express = require('express');
const Work = require('../models/Work');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// 一覧取得（公開）
router.get('/', async (req, res) => {
  const works = await Work.find().sort({ createdAt: -1 });
  res.json(works);
});

// 詳細取得（公開）
router.get('/:id', async (req, res) => {
  const work = await Work.findById(req.params.id);
  if (!work) {
    return res.status(404).json({ message: '制作物が見つかりません' });
  }
  res.json(work);
});

// 登録（認証必須）
router.post('/', authMiddleware, async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'titleとdescriptionは必須です' });
  }

  const work = await Work.create(req.body);
  res.status(201).json(work);
});

// 更新（認証必須）
router.put('/:id', authMiddleware, async (req, res) => {
  const work = await Work.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
  if (!work) {
    return res.status(404).json({ message: '制作物が見つかりません' });
  }
  res.json(work);
});

// 削除（認証必須）
router.delete('/:id', authMiddleware, async (req, res) => {
  const work = await Work.findByIdAndDelete(req.params.id);
  if (!work) {
    return res.status(404).json({ message: '制作物が見つかりません' });
  }
  res.json({ message: '削除しました' });
});

module.exports = router;
