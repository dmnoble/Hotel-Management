// src/services/chambersLocal.ts
import type { Chamber } from '../types'; // or define locally

const STORAGE_KEY = 'franken_chambers';

export async function getChambersLocal(): Promise<Chamber[]> {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
}
