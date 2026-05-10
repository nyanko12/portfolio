const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  // テスト用ユーザーを作成
  await User.create({ username: 'testuser', password: 'password123' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('POST /auth/login', () => {
  test('正しい認証情報でJWTトークンを返す', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('パスワード誤りで401を返す', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'wrongpass' });

    expect(res.status).toBe(401);
  });

  test('存在しないユーザーで401を返す', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'nobody', password: 'password123' });

    expect(res.status).toBe(401);
  });

  test('リクエストボディ不足で400を返す', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser' });

    expect(res.status).toBe(400);
  });
});
