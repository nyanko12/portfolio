const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  await User.create({ username: 'testuser', password: 'password123' });

  const res = await request(app)
    .post('/auth/login')
    .send({ username: 'testuser', password: 'password123' });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('POST /logs', () => {
  test('認証済みでログを登録できる', async () => {
    const res = await request(app)
      .post('/logs')
      .set('Authorization', `Bearer ${token}`)
      .send({ date: '2026-05-10', content: 'Expressを学んだ', tags: ['Node.js'] });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.content).toBe('Expressを学んだ');
  });

  test('未認証で401を返す', async () => {
    const res = await request(app)
      .post('/logs')
      .send({ date: '2026-05-10', content: 'test' });

    expect(res.status).toBe(401);
  });

  test('contentなしで400を返す', async () => {
    const res = await request(app)
      .post('/logs')
      .set('Authorization', `Bearer ${token}`)
      .send({ date: '2026-05-10' });

    expect(res.status).toBe(400);
  });
});

describe('GET /logs', () => {
  test('ログ一覧を取得できる', async () => {
    const res = await request(app).get('/logs');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('タグでフィルタできる', async () => {
    const res = await request(app).get('/logs?tag=Node.js');

    expect(res.status).toBe(200);
    res.body.forEach(log => {
      expect(log.tags).toContain('Node.js');
    });
  });
});

describe('PUT /logs/:id', () => {
  let logId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/logs')
      .set('Authorization', `Bearer ${token}`)
      .send({ date: '2026-05-10', content: '更新前', tags: [] });
    logId = res.body._id;
  });

  test('認証済みでログを更新できる', async () => {
    const res = await request(app)
      .put(`/logs/${logId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: '更新後' });

    expect(res.status).toBe(200);
    expect(res.body.content).toBe('更新後');
  });

  test('存在しないIDで404を返す', async () => {
    const res = await request(app)
      .put('/logs/000000000000000000000000')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'test' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /logs/:id', () => {
  let logId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/logs')
      .set('Authorization', `Bearer ${token}`)
      .send({ date: '2026-05-10', content: '削除対象', tags: [] });
    logId = res.body._id;
  });

  test('認証済みでログを削除できる', async () => {
    const res = await request(app)
      .delete(`/logs/${logId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  test('存在しないIDで404を返す', async () => {
    const res = await request(app)
      .delete('/logs/000000000000000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
