/**
 * 初期スキルデータ投入スクリプト
 * 使い方: node scripts/seed-skills.js
 */
require('dotenv').config({ path: `${__dirname}/../.env` });

const mongoose = require('mongoose');
const Skill = require('../src/models/Skill');

// docs/skill_stack.md の表示例に基づくデータ
const SEED_SKILLS = [
  // ── advanced（自力で実装可能）──
  { name: 'C++', category: 'language', level: 'advanced', description: '競技プログラミング・システムプログラミングで主に使用' },

  // ── basic（基礎理解あり）──
  { name: 'HTML / CSS', category: 'frontend', level: 'basic', description: 'マークアップ・スタイリングの基礎を理解' },

  // ── learning（学習中）──
  { name: 'JavaScript', category: 'language', level: 'learning', description: 'フロントエンド・Node.js で学習中' },
  { name: 'Python', category: 'language', level: 'learning', description: 'スクリプト・データ処理で学習中' },
  { name: 'Node.js / Express', category: 'backend', level: 'learning', description: 'REST API 構築で学習中' },

  // ── experienced（AI補助・コード理解可）──
  { name: 'React / Next.js', category: 'frontend', level: 'experienced', description: 'AI補助のもとポートフォリオを構築' },
  { name: 'TypeScript', category: 'language', level: 'experienced', description: '型安全なコードの読み書きが可能' },
  { name: 'Flutter（Dart）', category: 'frontend', level: 'experienced', description: 'モバイルアプリ開発で使用経験あり' },
  { name: 'Tailwind CSS', category: 'frontend', level: 'experienced', description: 'ユーティリティファーストCSSを使用経験あり' },
  { name: 'WebGL', category: 'frontend', level: 'experienced', description: '3Dグラフィクス描画で使用経験あり' },
  { name: 'Spring Boot', category: 'backend', level: 'experienced', description: 'Java系WebフレームワークをAI補助で使用' },
  { name: 'Go', category: 'backend', level: 'experienced', description: 'バックエンド開発で使用経験あり' },
  { name: 'Java', category: 'language', level: 'experienced', description: 'オブジェクト指向プログラミングで使用経験あり' },
  { name: 'PostgreSQL', category: 'database', level: 'experienced', description: 'RDBMSの基礎的な操作が可能' },
  { name: 'MongoDB', category: 'database', level: 'experienced', description: 'ドキュメントDBをポートフォリオで使用' },
  { name: 'Firebase', category: 'database', level: 'experienced', description: 'BaaSとして認証・DBで使用経験あり' },
  { name: 'Supabase', category: 'database', level: 'experienced', description: 'オープンソースBaaSとして使用経験あり' },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('DB接続成功');

  await Skill.deleteMany({});
  console.log('既存スキルデータを削除');

  await Skill.insertMany(SEED_SKILLS);
  console.log(`${SEED_SKILLS.length} 件のスキルデータを投入しました`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
