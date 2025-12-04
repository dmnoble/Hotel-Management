// src/services/chambersHttp.ts
import { apiClient } from './apiClient';
import type { Chamber } from '../types';

export async function getChambersHttp(): Promise<Chamber[]> {
    const { chambers } = await apiClient.get<{ chambers: Chamber[] }>('/chambers');
    return chambers;
}
