// DEV-ONLY CABINS/ROOMS STUB
// Replaces Supabase calls with localStorage-backed data for Franken-JRPG.

import { cabins as seedCabins } from "../data/data-cabins";

const STORAGE_KEY = "franken-dev-cabins";

function seedDevCabins() {
  // Take the static seed data and give each cabin a stable id if it doesn't have one
  const data = seedCabins.map((cabin, index) => ({
    // id: use existing id if present, otherwise derive one
    id: cabin.id ?? index + 1,
    ...cabin,
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function readCabins() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedDevCabins();

  try {
    return JSON.parse(raw);
  } catch {
    return seedDevCabins();
  }
}

function writeCabins(cabins) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cabins));
}

// Small helper for IDs
function makeId(prefix = "dev-cabin") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export async function getCabins() {
  return readCabins();
}

export async function createEditCabin(newCabin, id) {
  const cabins = readCabins();

  // CREATE
  if (!id) {
    const cabin = {
      id: makeId("chamber"),
      ...newCabin,
    };
    cabins.push(cabin);
    writeCabins(cabins);
    return cabin;
  }

  // EDIT
  const index = cabins.findIndex((cabin) => cabin.id === id);
  if (index === -1) {
    const cabin = { id, ...newCabin };
    cabins.push(cabin);
    writeCabins(cabins);
    return cabin;
  }

  const updated = {
    ...cabins[index],
    ...newCabin,
    id,
  };
  cabins[index] = updated;
  writeCabins(cabins);
  return updated;
}

export async function deleteCabin(id) {
  const cabins = readCabins().filter((cabin) => cabin.id !== id);
  writeCabins(cabins);
  return;
}
