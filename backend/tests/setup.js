// テスト用環境変数（本番の.envとは独立して設定）
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/portfolio-test';
