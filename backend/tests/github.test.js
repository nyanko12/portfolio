const request = require('supertest');
const app = require('../src/app');

// GitHub APIはネットワーク依存のためモック化
jest.mock('../src/lib/github', () => ({
  fetchRepos: jest.fn(),
  fetchCommits: jest.fn(),
}));

const { fetchRepos, fetchCommits } = require('../src/lib/github');

describe('GET /github/repos', () => {
  test('リポジトリ一覧を返す', async () => {
    fetchRepos.mockResolvedValue([
      { id: 1, name: 'portfolio', full_name: 'test/portfolio' },
    ]);

    const res = await request(app).get('/github/repos');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].name).toBe('portfolio');
  });

  test('GitHub APIエラー時に500を返す', async () => {
    fetchRepos.mockRejectedValue(new Error('GitHub API error'));

    const res = await request(app).get('/github/repos');

    expect(res.status).toBe(500);
  });
});

describe('GET /github/commits', () => {
  test('最新コミット一覧を返す', async () => {
    fetchCommits.mockResolvedValue([
      { sha: 'abc123', commit: { message: 'initial commit' } },
    ]);

    const res = await request(app).get('/github/commits?repo=portfolio');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].sha).toBe('abc123');
  });

  test('repoなしで400を返す', async () => {
    const res = await request(app).get('/github/commits');
    expect(res.status).toBe(400);
  });

  test('GitHub APIエラー時に500を返す', async () => {
    fetchCommits.mockRejectedValue(new Error('GitHub API error'));

    const res = await request(app).get('/github/commits?repo=portfolio');

    expect(res.status).toBe(500);
  });
});
