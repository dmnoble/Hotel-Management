// src/services/apiCabins.ts
// DEV-ONLY CABINS/CHAMBERS API LAYER

import { backendMode } from './apiClient';
import { getChambersLocal } from './chambersLocal';
import { getChambersHttp } from './chambersHttp';
import type { Chamber } from '../types';

const STORAGE_KEY = 'franken_chambers';

async function getLocalChambers(): Promise<Chamber[]> {
  // Reuse the helper that already reads from localStorage
  return getChambersLocal();
}

function saveLocalChambers(chambers: Chamber[]) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chambers));
}

export async function getCabins(): Promise<Chamber[]> {
  if (backendMode === 'local') {
    return getLocalChambers();
  }
  // HTTP mode – fetch from backend (already wired in Phase 2)
  return getChambersHttp();
}

// Matches the original Wild-Oasis-style interface:
// createEditCabin(newCabin) -> create
// createEditCabin(newCabin, id) -> update
export async function createEditCabin(
  newCabin: Partial<Chamber>,
  id?: string
): Promise<Chamber> {
  if (backendMode === 'http') {
    // TODO: wire to real POST/PUT /chambers later
    throw new Error('createEditCabin over HTTP not implemented yet');
  }

  const chambers = await getLocalChambers();

  if (id) {
    const index = chambers.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Chamber with id ${id} not found`);
    }
    const updated: Chamber = { ...chambers[index], ...newCabin, id } as Chamber;
    chambers[index] = updated;
    saveLocalChambers(chambers);
    return updated;
  }

  const newId = `CHAMBER_${Date.now()}`;
  const created: Chamber = { ...(newCabin as Chamber), id: newId };
  chambers.push(created);
  saveLocalChambers(chambers);
  return created;
}

export async function deleteCabin(id: string): Promise<void> {
  if (backendMode === 'http') {
    // TODO: wire to DELETE /chambers/:id later
    throw new Error('deleteCabin over HTTP not implemented yet');
  }

  const chambers = await getLocalChambers();
  const filtered = chambers.filter((c) => c.id !== id);
  saveLocalChambers(filtered);
}
