// src/services/apiCabins.ts

import { backendMode, apiClient } from './apiClient';
import { getChambersLocal } from './chambersLocal';
import { getChambersHttp } from './chambersHttp';
import type { Chamber } from '../types';

const STORAGE_KEY = 'franken_chambers';

// Reuse the Chamber shape from shared types
export type Cabin = Chamber;

// ---------- Local helpers (dev / offline mode) ----------

async function getLocalChambers(): Promise<Cabin[]> {
  if (typeof localStorage === 'undefined') {
    // No localStorage (SSR or test) – fall back to seed data helper
    return getChambersLocal();
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    // No saved data yet – start from seed
    const seed = await getChambersLocal();
    saveLocalChambers(seed);
    return seed;
  }

  try {
    const parsed = JSON.parse(raw) as Cabin[];
    return parsed;
  } catch {
    // Corrupt local data – reset to seed
    const seed = await getChambersLocal();
    saveLocalChambers(seed);
    return seed;
  }
}

function saveLocalChambers(chambers: Cabin[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chambers));
}

// ---------- HTTP helpers (real backend mode) ----------

async function getChambersFromHttp(): Promise<Cabin[]> {
  // /api/v1/chambers returns { chambers: [...] }
  const chambers = await getChambersHttp();
  return chambers;
}

async function createCabinHttp(
  payload: Omit<Cabin, 'id'>
): Promise<Cabin> {
  return apiClient.post<Cabin>('/chambers', payload);
}

async function updateCabinHttp(
  id: string | number,
  payload: Partial<Cabin>
): Promise<Cabin> {
  return apiClient.put<Cabin>(`/chambers/${id}`, payload);
}

async function deleteCabinHttp(id: string | number): Promise<void> {
  await apiClient.del<void>(`/chambers/${id}`);
}

// ---------- Public API used by the cabins UI ----------

export async function getCabins(): Promise<Cabin[]> {
  if (backendMode === 'http') {
    return getChambersFromHttp();
  }

  return getLocalChambers();
}

export async function getCabin(
  id: string | number
): Promise<Cabin | undefined> {
  const cabins = await getCabins();
  return cabins.find((c) => String(c.id) === String(id));
}

export async function createEditCabin(
  newCabin: Omit<Cabin, 'id'>,
  id?: string | number
): Promise<Cabin> {
  // ---- HTTP mode: talk to franken-inn-api ----
  if (backendMode === 'http') {
    if (id != null) {
      // Edit existing chamber
      return updateCabinHttp(id, newCabin);
    } else {
      // Create new chamber
      return createCabinHttp(newCabin);
    }
  }

  // ---- Local mode: mutate localStorage-backed chambers ----
  const chambers = await getLocalChambers();

  // Helper to generate the next string id from existing ids
  const getNextId = (): string => {
    const maxId = chambers.reduce(
      (max, c) => Math.max(max, Number(c.id) || 0),
      0
    );
    return String(maxId + 1);
  };

  if (id != null) {
    const idx = chambers.findIndex((c) => String(c.id) === String(id));

    if (idx === -1) {
      // Not found → treat as create
      const created: Cabin = {
        ...newCabin,
        id: getNextId(), // string, matches Chamber.id
      };
      const next = [...chambers, created];
      saveLocalChambers(next);
      return created;
    }

    const updated: Cabin = {
      ...chambers[idx],
      ...newCabin,
    };
    const next = [...chambers];
    next[idx] = updated;
    saveLocalChambers(next);
    return updated;
  }

  // Create new in local mode
  const created: Cabin = {
    ...newCabin,
    id: getNextId(), // string here as well
  };

  const next = [...chambers, created];
  saveLocalChambers(next);
  return created;
}


export async function deleteCabin(id: string): Promise<void> {
  if (backendMode === 'http') {
    await deleteCabinHttp(id);
    return;
  }

  const chambers = await getLocalChambers();
  const filtered = chambers.filter((c) => String(c.id) !== String(id));
  saveLocalChambers(filtered);
}
