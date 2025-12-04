// src/services/apiClient.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';
const BACKEND_MODE = import.meta.env.VITE_BACKEND_MODE ?? 'local';
// 'local' | 'http'

export type BackendMode = 'local' | 'http';

export const backendMode: BackendMode = BACKEND_MODE as BackendMode;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${path}`;

    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
        ...options,
    });

    if (!res.ok) {
        throw new Error(`API error ${res.status} for ${url}`);
    }

    return (await res.json()) as T;
}

export const apiClient = {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body: unknown) =>
        request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(path: string, body: unknown) =>
        request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
    del: <T>(path: string) => request<T>(path, { method: 'DELETE' })
};
