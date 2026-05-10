const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

let mongoServer;
let token;

const sampleWork = {
  title: 'テトリス',
  description: 'バトルテトリスゲーム',
  technologies: ['JavaScript', 'WebGL'],
  reason: '技術習得のため',
  effort: 'WebGLの描画最適化',
  difficulty: 'マルチプレイヤー同期',
  improvement: 'モバイル対応',
  githubUrl: 'https://github.com/example/tetris',
  demoUrl: 'https://example.com/tetris',
};

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

describe('POST /works', () => {
  test('認証済みで制作物を登録できる', async () => {
    const res = await request(app)
      .post('/works')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleWork);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('テトリス');
  });

  test('未認証で401を返す', async () => {
    const res = await request(app).post('/works').send(sampleWork);
    expect(res.status).toBe(401);
  });

  test('titleなしで400を返す', async () => {
    const res = await request(app)
      .post('/works')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: '説明のみ' });

    expect(res.status).toBe(400);
  });
});

describe('GET /works', () => {
  test('制作物一覧を取得できる', async () => {
    const res = await request(app).get('/works');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /works/:id', () => {
  let workId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/works')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleWork);
    workId = res.body._id;
  });

  test('制作物詳細を取得できる', async () => {
    const res = await request(app).get(`/works/${workId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(workId);
  });

  test('存在しないIDで404を返す', async () => {
    const res = await request(app).get('/works/000000000000000000000000');
    expect(res.status).toBe(404);
  });
});

describe('PUT /works/:id', () => {
  let workId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/works')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleWork);
    workId = res.body._id;
  });

  test('認証済みで制作物を更新できる', async () => {
    const res = await request(app)
      .put(`/works/${workId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '更新後タイトル' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('更新後タイトル');
  });
});

describe('DELETE /works/:id', () => {
  let workId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/works')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleWork);
    workId = res.body._id;
  });

  test('認証済みで制作物を削除できる', async () => {
    const res = await request(app)
      .delete(`/works/${workId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
