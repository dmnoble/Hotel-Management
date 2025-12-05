// src/services/apiClient.ts
// src/services/apiClient.ts

export type BackendMode = 'local' | 'http';

// Read backend mode from Vite env; default to 'local' for dev
const BACKEND_MODE_RAW = import.meta.env.VITE_BACKEND_MODE ?? 'local';
export const backendMode: BackendMode = BACKEND_MODE_RAW as BackendMode;

// Helper: normalize API base URL
// VITE_API_BASE_URL can be:
//   - http://localhost:3000
//   - http://your-alb-dns-name
//   - or already http://.../api/v1
const RAW_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

// strip trailing slash if present
const withoutTrailingSlash = RAW_API_BASE_URL.replace(/\/$/, '');

// ensure we end up with .../api/v1 exactly once
const BASE_URL = withoutTrailingSlash.endsWith('/api/v1')
  ? withoutTrailingSlash
  : `${withoutTrailingSlash}/api/v1`;

// Core HTTP request helper used when BACKEND_MODE === 'http'
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // expect paths like "/chambers", "/settings", etc.
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status} for ${url}`);
  }

  return (await res.json()) as T;
}

export const apiClient = {
  get:    <T>(path: string) => request<T>(path),
  post:   <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  del:    <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
};
