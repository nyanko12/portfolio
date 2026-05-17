import type { Log, LogInput, Work, WorkInput, Skill, SkillInput, Subject, QuizQuestion, QuizAnswer, GradeResult, QuizStats, QuizSessionSummary } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// localStorageはSSRで使えないためクライアント側でのみ参照
const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const authHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

// --- 認証 ---

export async function login(username: string, password: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await handleResponse<{ token: string }>(res);
  return data.token;
}

// --- 学習ログ ---

export async function getLogs(tag?: string): Promise<Log[]> {
  const url = tag ? `${BASE_URL}/logs?tag=${encodeURIComponent(tag)}` : `${BASE_URL}/logs`;
  const res = await fetch(url);
  return handleResponse<Log[]>(res);
}

export async function createLog(input: LogInput): Promise<Log> {
  const res = await fetch(`${BASE_URL}/logs`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
  return handleResponse<Log>(res);
}

export async function updateLog(id: string, input: Partial<LogInput>): Promise<Log> {
  const res = await fetch(`${BASE_URL}/logs/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
  return handleResponse<Log>(res);
}

export async function deleteLog(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/logs/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  await handleResponse<unknown>(res);
}

// --- 制作物 ---

export async function getWorks(): Promise<Work[]> {
  const res = await fetch(`${BASE_URL}/works`);
  return handleResponse<Work[]>(res);
}

export async function getWork(id: string): Promise<Work> {
  const res = await fetch(`${BASE_URL}/works/${id}`);
  return handleResponse<Work>(res);
}

export async function createWork(input: WorkInput): Promise<Work> {
  const res = await fetch(`${BASE_URL}/works`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
  return handleResponse<Work>(res);
}

export async function updateWork(id: string, input: Partial<WorkInput>): Promise<Work> {
  const res = await fetch(`${BASE_URL}/works/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
  return handleResponse<Work>(res);
}

export async function deleteWork(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/works/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  await handleResponse<unknown>(res);
}

// --- スキル ---

export async function getSkills(): Promise<Skill[]> {
  const res = await fetch(`${BASE_URL}/skills`);
  return handleResponse<Skill[]>(res);
}

export async function getSkill(id: string): Promise<Skill> {
  const res = await fetch(`${BASE_URL}/skills/${id}`);
  return handleResponse<Skill>(res);
}

export async function createSkill(input: SkillInput): Promise<Skill> {
  const res = await fetch(`${BASE_URL}/skills`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
  return handleResponse<Skill>(res);
}

export async function updateSkill(id: string, input: Partial<SkillInput>): Promise<Skill> {
  const res = await fetch(`${BASE_URL}/skills/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
  return handleResponse<Skill>(res);
}

export async function deleteSkill(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/skills/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  await handleResponse<unknown>(res);
}

// --- GitHub ---

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
};

export type GitHubCommit = {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
  html_url: string;
};

export async function getGitHubRepos(): Promise<GitHubRepo[]> {
  const res = await fetch(`${BASE_URL}/github/repos`);
  return handleResponse<GitHubRepo[]>(res);
}

export async function getGitHubCommits(repo: string): Promise<GitHubCommit[]> {
  const res = await fetch(`${BASE_URL}/github/commits?repo=${encodeURIComponent(repo)}`);
  return handleResponse<GitHubCommit[]>(res);
}

// --- ギーク道場 ---

export async function getSubjects(): Promise<Subject[]> {
  const res = await fetch(`${BASE_URL}/quiz/subjects`, { headers: authHeaders() });
  const data = await handleResponse<{ subjects: Subject[] }>(res);
  return data.subjects;
}

export async function createSubject(name: string, description: string): Promise<Subject> {
  const res = await fetch(`${BASE_URL}/quiz/subjects`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name, description }),
  });
  return handleResponse(res);
}

export async function deleteSubject(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/quiz/subjects/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  await handleResponse<unknown>(res);
}

export async function generateQuiz(
  level: number,
  subjects: string[]
): Promise<{ sessionId: string; questions: QuizQuestion[]; model: string }> {
  const res = await fetch(`${BASE_URL}/quiz/generate`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ level, subjects }),
  });
  return handleResponse(res);
}

export async function gradeQuiz(
  sessionId: string,
  answers: QuizAnswer[]
): Promise<{ results: GradeResult[]; score: number; total: number }> {
  const res = await fetch(`${BASE_URL}/quiz/grade`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ sessionId, answers }),
  });
  return handleResponse(res);
}

export async function saveQuizSession(
  sessionId: string,
  answers: QuizAnswer[],
  gradeResults: GradeResult[]
): Promise<{ sessionId: string; nextLevel: number }> {
  const res = await fetch(`${BASE_URL}/quiz/sessions`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ sessionId, answers, gradeResults }),
  });
  return handleResponse(res);
}

export async function getQuizStats(): Promise<QuizStats> {
  const res = await fetch(`${BASE_URL}/quiz/stats`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function getQuizSessions(limit = 20, subject?: string): Promise<{ sessions: QuizSessionSummary[] }> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (subject) params.set('subject', subject);
  const res = await fetch(`${BASE_URL}/quiz/sessions?${params}`, { headers: authHeaders() });
  return handleResponse(res);
}
