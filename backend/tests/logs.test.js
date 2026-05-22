const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

// GitHub API 呼び出しをモック（テスト環境では実際にコミットしない）
jest.mock('../src/lib/github', () => ({
  fetchRepos: jest.fn(),
  fetchCommits: jest.fn(),
  upsertLogFile: jest.fn().mockResolvedValue(undefined),
  deleteLogFile: jest.fn().mockResolvedValue(undefined),
}));

const githubLib = require('../src/lib/github');

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('認証済みでログを登録できる', async () => {
    const res = await request(app)
      .post('/logs')
      .set('Authorization', `Bearer ${token}`)
      .send({ date: '2026-05-10', content: 'Expressを学んだ', tags: ['Node.js'] });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.content).toBe('Expressを学んだ');
  });

  test('ログ登録時にGitHubへのコミットが呼ばれる', async () => {
    await request(app)
      .post('/logs')
      .set('Authorization', `Bearer ${token}`)
      .send({ date: '2026-05-10', content: 'GitHubコミットテスト', tags: [] });

    expect(githubLib.upsertLogFile).toHaveBeenCalledWith(
      '2026-05-10',
      expect.any(Array)
    );
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('認証済みでログを更新できる', async () => {
    const res = await request(app)
      .put(`/logs/${logId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: '更新後' });

    expect(res.status).toBe(200);
    expect(res.body.content).toBe('更新後');
  });

  test('ログ更新時にGitHubへのコミットが呼ばれる', async () => {
    await request(app)
      .put(`/logs/${logId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'GitHub更新テスト' });

    expect(githubLib.upsertLogFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Array)
    );
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('認証済みでログを削除できる', async () => {
    const res = await request(app)
      .delete(`/logs/${logId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  test('ログ削除時にGitHub操作が呼ばれる', async () => {
    const createRes = await request(app)
      .post('/logs')
      .set('Authorization', `Bearer ${token}`)
      .send({ date: '2026-05-20', content: 'GitHub削除テスト', tags: [] });
    const targetId = createRes.body._id;

    jest.clearAllMocks();

    await request(app)
      .delete(`/logs/${targetId}`)
      .set('Authorization', `Bearer ${token}`);

    // 残ログなしの場合は deleteLogFile、ありの場合は upsertLogFile が呼ばれる
    const called =
      githubLib.deleteLogFile.mock.calls.length > 0 ||
      githubLib.upsertLogFile.mock.calls.length > 0;
    expect(called).toBe(true);
  });

  test('存在しないIDで404を返す', async () => {
    const res = await request(app)
      .delete('/logs/000000000000000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
