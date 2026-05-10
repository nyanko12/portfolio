import type { Log, LogInput, Work, WorkInput } from '@/types';

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
