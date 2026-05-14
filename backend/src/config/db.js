const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI ?? '';
  // パスワード部分をマスクしてログ出力（デバッグ用）
  console.log('接続URI:', uri.replace(/:([^:@]+)@/, ':***@'));
  await mongoose.connect(uri);
};

module.exports = connectDB;
