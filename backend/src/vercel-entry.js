require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

// サーバーレス環境でのDB接続をキャッシュ（コールドスタート対策）
let connectionPromise = null;

const getConnection = () => {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI);
    // 失敗時はキャッシュをリセットして次回再試行できるようにする
    connectionPromise.catch(() => { connectionPromise = null; });
  }
  return connectionPromise;
};

module.exports = async (req, res) => {
  try {
    await getConnection();
    return app(req, res);
  } catch (err) {
    console.error('DB接続エラー:', err.message);
    res.status(500).json({ message: 'DB接続エラー', detail: err.message });
  }
};
