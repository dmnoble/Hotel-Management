// DEV-ONLY BOOKINGS/STAYS STUB
// Replaces Supabase with localStorage-backed bookings for Franken-JRPG.

// import { getToday } from "../utils/helpers";
// import { PAGE_SIZE } from "../utils/constants";

import { bookings as seedBookings } from "../data/data-bookings";
import { cabins as seedCabins } from "../data/data-cabins";
import { guests as seedGuests } from "../data/data-guests";

const STORAGE_KEY = "franken-dev-bookings";
const PAGE_SIZE = 10;

function todayISODate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function seedDevBookings() {
  const data = seedBookings.map((booking) => {
    // Match cabin and guest by id
    const cabin = seedCabins.find((c) => c.id === booking.cabinId);
    const guest = seedGuests.find((g) => g.id === booking.guestId);

    return {
      // Keep all original booking fields (status, dates, prices, etc.)
      ...booking,

      // Ensure we have an id field (if not already present)
      id: booking.id ?? `booking-${booking.cabinId}-${booking.guestId}-${booking.startDate}`,

      // Ensure created_at exists for “recent bookings” queries
      created_at: booking.created_at ?? new Date().toISOString(),

      // Join cabin info like Supabase `select("*, cabins(name)")` would
      cabins: cabin
        ? { name: cabin.name }
        : { name: "Unknown chamber" },

      // Join guest info like Supabase `select("*, guests(fullName, email, nationality, countryFlag)")`
      guests: guest
        ? {
          fullName: guest.fullName,
          email: guest.email,
          nationality: guest.nationality,
          countryFlag: guest.countryFlag,
        }
        : {
          fullName: "Unknown guest",
          email: "",
        },
    };
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function readBookings() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedDevBookings();

  try {
    return JSON.parse(raw);
  } catch {
    return seedDevBookings();
  }
}

function writeBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function makeId(prefix = "booking") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

function compareValues(a, b, direction) {
  const dir = direction === "asc" ? 1 : -1;

  if (a == null && b == null) return 0;
  if (a == null) return -1 * dir;
  if (b == null) return 1 * dir;

  if (typeof a === "number" && typeof b === "number") {
    return (a - b) * dir;
  }

  const sa = String(a);
  const sb = String(b);
  return sa.localeCompare(sb) * dir;
}

// --------- PUBLIC API ----------

export async function getBookings({ filter, sortBy, page } = {}) {
  let rows = [...readBookings()];

  // FILTER: simple equals on top-level field (e.g., status)
  if (filter && filter.field && filter.value !== undefined && filter.value !== null) {
    rows = rows.filter((booking) => {
      const value = booking[filter.field];
      return String(value) === String(filter.value);
    });
  }

  // Save total count BEFORE pagination
  const totalCount = rows.length;

  // SORT
  if (sortBy && sortBy.field) {
    rows.sort((a, b) =>
      compareValues(a[sortBy.field], b[sortBy.field], sortBy.direction)
    );
  }

  // PAGINATION
  if (page && typeof page === "number") {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    rows = rows.slice(from, to);
  }

  // Match original API shape: { data, count }
  return {
    data: rows,
    count: totalCount,
  };
}


export async function getBooking(id) {
  const bookings = readBookings();
  const booking = bookings.find((b) => b.id === id) || null;
  return booking;
}

// BOOKINGS created after given date (ISOString)
export async function getBookingsAfterDate(date) {
  const since = new Date(date);
  const now = new Date();

  const bookings = readBookings().filter((b) => {
    const created = new Date(b.created_at);
    return created >= since && created <= now;
  });

  return bookings;
}

// STAYS after given start date
export async function getStaysAfterDate(date) {
  const stays = readBookings().filter((b) => {
    const start = new Date(b.startDate);
    return start >= new Date(date);
  });

  // In original app, these are "stays", but here we just reuse bookings
  return stays;
}

// Activity: check-ins/check-outs for today
export async function getStaysTodayActivity() {
  const today = todayISODate();

  const stays = readBookings().filter((stay) => {
    const isCheckInToday =
      stay.status === "unconfirmed" && stay.startDate === today;
    const isCheckOutToday =
      stay.status === "checked-in" && stay.endDate === today;
    return isCheckInToday || isCheckOutToday;
  });

  // Original used guests(fullName, nationality, countryFlag).
  // Our stub already has guests.fullName; nationality/flag omitted for now.
  return stays;
}

export async function updateBooking(id, obj) {
  const bookings = readBookings();
  const index = bookings.findIndex((b) => b.id === id);

  if (index === -1) {
    const created = { id, ...obj };
    bookings.push(created);
    writeBookings(bookings);
    return created;
  }

  const updated = { ...bookings[index], ...obj, id };
  bookings[index] = updated;
  writeBookings(bookings);
  return updated;
}

export async function deleteBooking(id) {
  const bookings = readBookings().filter((b) => b.id !== id);
  writeBookings(bookings);
  return;
}
