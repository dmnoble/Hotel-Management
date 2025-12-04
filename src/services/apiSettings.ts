// src/services/apiSettings.ts
import { backendMode, apiClient } from './apiClient';

export type Settings = {
  minBookingLength: number;
  maxBookingLength: number;
  maxGuestsPerBooking: number;
  breakfastPrice: number;
  editedAt?: string;
};

const STORAGE_KEY = 'franken_settings';

const DEFAULT_SETTINGS: Settings = {
  minBookingLength: 1,
  maxBookingLength: 30,
  maxGuestsPerBooking: 4,
  breakfastPrice: 15,
};

// ---------- LocalStorage helpers (dev / offline mode) ----------

async function getSettingsLocal(): Promise<Settings> {
  if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_SETTINGS;

  try {
    const parsed = JSON.parse(raw) as Settings;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

async function saveSettingsLocal(next: Settings): Promise<Settings> {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

// ---------- HTTP helpers (real backend mode) ----------

async function getSettingsHttp(): Promise<Settings> {
  const { settings } = await apiClient.get<{ settings: Settings }>('/settings');
  return settings;
}

async function updateSettingsHttp(update: Partial<Settings>): Promise<Settings> {
  const { settings } = await apiClient.put<{ settings: Settings }>(
    '/settings',
    update
  );
  return settings;
}

// ---------- Public API used by the Settings UI ----------

export async function getSettings(): Promise<Settings> {
  if (backendMode === 'local') {
    return getSettingsLocal();
  }
  return getSettingsHttp();
}

export async function updateSetting(
  update: Partial<Settings>
): Promise<Settings> {
  if (backendMode === 'local') {
    const current = await getSettingsLocal();
    const next: Settings = { ...current, ...update };
    return saveSettingsLocal(next);
  }

  return updateSettingsHttp(update);
}
