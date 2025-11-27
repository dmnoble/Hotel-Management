// src/services/apiBookings.ts

// Use the original seed data for now.
// Adjust this import if data-bookings uses a default export instead.
import { bookings as seedBookings } from "../data/data-bookings";

export type Booking = any;

// Simple in-memory "DB" seeded from the data file.
// This will reset on full page reload, which is fine for dev.
let inMemoryBookings: Booking[] = Array.isArray(seedBookings)
    ? [...seedBookings]
    : [];

function bookingDate(b: any): Date {
    // Try a few likely fields; fall back to epoch if missing.
    return new Date(b.startDate ?? b.created_at ?? b.date ?? 0);
}

// List/paginate bookings
export async function getBookings(
    _options?: unknown
): Promise<{ data: Booking[]; count: number }> {
    // For now ignore filters/sorting/pagination.
    return {
        data: inMemoryBookings,
        count: inMemoryBookings.length,
    };
}

// Recent bookings for dashboard
export async function getBookingsAfterDate(date: string): Promise<Booking[]> {
    const after = new Date(date);
    return inMemoryBookings.filter((b) => bookingDate(b) >= after);
}

// "Stays" are just bookings for now.
// Later, we can differentiate if we want.
export async function getStaysAfterDate(date: string): Promise<Booking[]> {
    const after = new Date(date);
    return inMemoryBookings.filter((b) => bookingDate(b) >= after);
}

// Single booking
export async function getBooking(
    id: number | string
): Promise<Booking | undefined> {
    return inMemoryBookings.find((b) => (b as any).id === id);
}

// Update booking
export async function updateBooking(
    id: number | string,
    update: Partial<Booking>
): Promise<Booking | undefined> {
    const idx = inMemoryBookings.findIndex((b) => (b as any).id === id);
    if (idx === -1) return undefined;

    const updated = { ...inMemoryBookings[idx], ...update };
    inMemoryBookings[idx] = updated;
    return updated;
}

// Delete booking
export async function deleteBooking(
    id: number | string
): Promise<void> {
    inMemoryBookings = inMemoryBookings.filter((b) => (b as any).id !== id);
}

// Check-in / check-out helpers used by the check-in flows
export async function checkin(
    id: number | string,
    update: Partial<Booking> = {}
): Promise<Booking | undefined> {
    return updateBooking(id, {
        ...(update as any),
        status: "checked-in",
    });
}

export async function checkout(
    id: number | string
): Promise<Booking | undefined> {
    return updateBooking(id, { status: "checked-out" });
}
