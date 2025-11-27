// src/services/apiSettings.ts

export type Settings = {
  minBookingLength: number;
  maxBookingLength: number;
  maxGuestsPerBooking: number;
  breakfastPrice: number;
};

const STORAGE_KEY = 'franken_settings';

const DEFAULT_SETTINGS: Settings = {
  minBookingLength: 1,
  maxBookingLength: 30,
  maxGuestsPerBooking: 4,
  breakfastPrice: 15,
};

export async function getSettings(): Promise<Settings> {
  if (typeof localStorage === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }

  try {
    return JSON.parse(raw) as Settings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSetting(
  update: Partial<Settings>
): Promise<Settings> {
  const current = await getSettings();
  const next: Settings = { ...current, ...update };

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return next;
}
