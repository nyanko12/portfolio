const GITHUB_USER = process.env.GITHUB_USER;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};

async function githubFetch(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${path}`);
  return res.json();
}

const fetchRepos = () =>
  githubFetch(`/users/${GITHUB_USER}/repos?sort=updated&per_page=30`);

const fetchCommits = (repo) =>
  githubFetch(`/repos/${GITHUB_USER}/${repo}/commits?per_page=10`);

// 日付と複数ログからMarkdown文字列を生成
function buildLogMarkdown(date, logs) {
  const sections = logs.map((log) => {
    const tags = log.tags && log.tags.length > 0 ? `\n**タグ:** ${log.tags.join(', ')}` : '';
    return `${log.content}${tags}`;
  });
  return `# 学習ログ ${date}\n\n${sections.join('\n\n---\n\n')}\n`;
}

// ファイルのSHAを取得（存在しない場合はnull）
async function getFileSha(path) {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${path}`,
    { headers }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${path}`);
  const data = await res.json();
  return data.sha;
}

// 学習ログをGitHubのMarkdownファイルとしてコミット（作成・更新）
async function upsertLogFile(date, logs) {
  if (!GITHUB_TOKEN || !GITHUB_REPO) return;

  const filePath = `logs/${date}.md`;
  const content = buildLogMarkdown(date, logs);
  const sha = await getFileSha(filePath);

  const body = {
    message: `docs: 学習ログを更新 (${date})`,
    content: Buffer.from(content).toString('base64'),
    ...(sha ? { sha } : {}),
  };

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${filePath}`,
    {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`GitHub API ${res.status}: upsert ${filePath}`);
}

// 学習ログのMarkdownファイルをGitHubから削除
async function deleteLogFile(date) {
  if (!GITHUB_TOKEN || !GITHUB_REPO) return;

  const filePath = `logs/${date}.md`;
  const sha = await getFileSha(filePath);
  if (!sha) return;

  const body = {
    message: `docs: 学習ログを削除 (${date})`,
    sha,
  };

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${filePath}`,
    {
      method: 'DELETE',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`GitHub API ${res.status}: delete ${filePath}`);
}

module.exports = { fetchRepos, fetchCommits, upsertLogFile, deleteLogFile };
