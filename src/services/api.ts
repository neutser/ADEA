/**
 * API service layer - thin fetch wrapper for future backend integration.
 * Replace with React Query when backend is ready.
 */
import { API_BASE } from '@/config';

export interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err: ApiError = new Error(`API error: ${res.status}`);
    err.status = res.status;
    try {
      err.data = await res.json();
    } catch {
      err.data = await res.text();
    }
    throw err;
  }

  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
