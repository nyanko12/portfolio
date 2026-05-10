require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

// サーバーレス環境でのDB接続をキャッシュ（コールドスタート対策）
let connectionPromise = null;

const getConnection = () => {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI);
  }
  return connectionPromise;
};

module.exports = async (req, res) => {
  await getConnection();
  return app(req, res);
};
