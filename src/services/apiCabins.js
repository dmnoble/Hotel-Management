// DEV-ONLY CABINS/ROOMS STUB
// Replaces Supabase calls with localStorage-backed data for Franken-JRPG.

const STORAGE_KEY = "franken-dev-cabins";

function seedDevCabins() {
  const data = [
    {
      id: "room-1",
      name: "Room 1 – Widow's Walk",
      maxCapacity: 2,
      regularPrice: 80,
      discount: 0,
      description: "A narrow chamber overlooking the fog-shrouded courtyard.",
      image: "",
    },
    {
      id: "room-2",
      name: "Room 2 – Lantern Nook",
      maxCapacity: 3,
      regularPrice: 110,
      discount: 10,
      description: "Warm, candlelit room with a view of the old orchard.",
      image: "",
    },
    {
      id: "room-3",
      name: "Room 3 – Crypt Suite",
      maxCapacity: 4,
      regularPrice: 150,
      discount: 0,
      description:
        "Spacious suite rumored to share a wall with a forgotten cellar.",
      image: "",
    },
  ];

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
      id: makeId("room"),
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
