require('dotenv').config();
const mongoose = require('mongoose');
const Subject = require('../src/models/Subject');

const defaultSubjects = [
  { name: 'OS', description: 'OSに関する問題', order: 1 },
  { name: 'ネットワーク', description: 'ネットワークに関する問題', order: 2 },
  { name: 'アルゴリズム', description: 'アルゴリズムとデータ構造に関する問題', order: 3 },
  { name: 'データベース', description: 'データベースに関する問題', order: 4 },
  { name: 'セキュリティ', description: 'セキュリティに関する問題', order: 5 },
  { name: 'JavaScript', description: 'JavaScriptに関する問題', order: 6 },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('DB接続成功');

  await Subject.deleteMany({});
  await Subject.insertMany(defaultSubjects);
  console.log(`${defaultSubjects.length}件のジャンルを登録しました`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
