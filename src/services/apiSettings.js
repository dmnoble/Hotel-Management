// DEV-ONLY SETTINGS STUB
// Replaces Supabase "settings" table with localStorage-backed house rules.

// import supabase from "./supabase";

const STORAGE_KEY = "franken-dev-settings";

const DEFAULT_SETTINGS = {
  minBookingLength: 1,
  maxBookingLength: 30,
  maxGuestsPerBooking: 4,
  breakfastPrice: 15, // you can rename/use differently later for your inn
};

function readSettings() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return { ...DEFAULT_SETTINGS };
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return { ...DEFAULT_SETTINGS };
  }
}

function writeSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export async function getSettings() {
  // In the original app this returned a single row from "settings".
  return readSettings();
}

// We expect a newSetting object that looks like { settingName: newValue }
export async function updateSetting(newSetting) {
  const current = readSettings();
  const updated = { ...current, ...newSetting };
  writeSettings(updated);
  return updated;
}
