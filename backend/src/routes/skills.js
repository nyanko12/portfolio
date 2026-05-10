const express = require('express');
const Skill = require('../models/Skill');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// 一覧取得（公開）
router.get('/', async (req, res) => {
  const skills = await Skill.find().sort({ level: 1, name: 1 });
  res.json(skills);
});

// 詳細取得（公開）
router.get('/:id', async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) {
    return res.status(404).json({ message: 'スキルが見つかりません' });
  }
  res.json(skill);
});

// 登録（認証必須）
router.post('/', authMiddleware, async (req, res) => {
  const { name, category, level } = req.body;

  if (!name || !category || !level) {
    return res.status(400).json({ message: 'name・category・level は必須です' });
  }

  const skill = await Skill.create(req.body);
  res.status(201).json(skill);
});

// 更新（認証必須）
router.put('/:id', authMiddleware, async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
  if (!skill) {
    return res.status(404).json({ message: 'スキルが見つかりません' });
  }
  res.json(skill);
});

// 削除（認証必須）
router.delete('/:id', authMiddleware, async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) {
    return res.status(404).json({ message: 'スキルが見つかりません' });
  }
  res.json({ message: '削除しました' });
});

module.exports = router;
