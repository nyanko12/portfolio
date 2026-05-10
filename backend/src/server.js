require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3001;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`サーバー起動: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB接続エラー:', err);
    process.exit(1);
  });
