const GITHUB_USER = process.env.GITHUB_USER;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

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

module.exports = { fetchRepos, fetchCommits };
