// src/services/apiBookings.ts

import { backendMode, apiClient } from './apiClient';
// @ts-ignore - JS data file from the original app
import { bookings as seedBookings } from '../data/data-bookings';

export type Booking = any;

// Local in-memory copy seeded from the data file.
// Resets on full reload; fine for dev.
let inMemoryBookings: Booking[] = Array.isArray(seedBookings)
    ? [...seedBookings]
    : [];

function clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

/* ========= LOCAL HELPERS ========= */

async function getBookingsLocal(): Promise<{ data: Booking[]; count: number }> {
    return {
        data: clone(inMemoryBookings),
        count: inMemoryBookings.length,
    };
}

async function getBookingLocal(
    id: number | string
): Promise<Booking | undefined> {
    return clone(
        inMemoryBookings.find((b) => String((b as any).id) === String(id))
    );
}

async function updateBookingLocal(
    id: number | string,
    update: Partial<Booking>
): Promise<Booking | undefined> {
    const idx = inMemoryBookings.findIndex(
        (b) => String((b as any).id) === String(id)
    );
    if (idx === -1) return undefined;

    const updated = { ...inMemoryBookings[idx], ...update };
    inMemoryBookings[idx] = updated;
    return clone(updated);
}

async function deleteBookingLocal(id: number | string): Promise<void> {
    inMemoryBookings = inMemoryBookings.filter(
        (b) => String((b as any).id) !== String(id)
    );
}

function filterAfterDate(list: Booking[], isoDate: string): Booking[] {
    const from = new Date(isoDate);
    return list.filter((b) => {
        const d =
            (b as any).startDate ||
            (b as any).created_at ||
            (b as any).date ||
            null;
        if (!d) return false;
        return new Date(d) >= from;
    });
}

/* ========= HTTP HELPERS ========= */

async function getBookingsHttp(): Promise<{ data: Booking[]; count: number }> {
    const { stays } = await apiClient.get<{ stays: Booking[] }>('/stays');
    return { data: stays, count: stays.length };
}

async function getBookingHttp(
    id: number | string
): Promise<Booking | undefined> {
    return apiClient.get<Booking>(`/stays/${id}`);
}

async function updateBookingHttp(
    id: number | string,
    update: Partial<Booking>
): Promise<Booking | undefined> {
    return apiClient.put<Booking>(`/stays/${id}`, update);
}

async function deleteBookingHttp(id: number | string): Promise<void> {
    await apiClient.del<void>(`/stays/${id}`);
}

/* ========= PUBLIC API (USED BY HOOKS) ========= */

// getBookings({ filter, sortBy, page }) in the original app is more complex.
// For now we ignore options and just return all.
export async function getBookings(
    _options?: unknown
): Promise<{ data: Booking[]; count: number }> {
    if (backendMode === 'http') {
        return getBookingsHttp();
    }
    return getBookingsLocal();
}

export async function getBooking(
    id: number | string
): Promise<Booking | undefined> {
    if (backendMode === 'http') {
        return getBookingHttp(id);
    }
    return getBookingLocal(id);
}

export async function updateBooking(
    id: number | string,
    update: Partial<Booking>
): Promise<Booking | undefined> {
    if (backendMode === 'http') {
        return updateBookingHttp(id, update);
    }
    return updateBookingLocal(id, update);
}

export async function deleteBooking(
    id: number | string
): Promise<void> {
    if (backendMode === 'http') {
        return deleteBookingHttp(id);
    }
    return deleteBookingLocal(id);
}

// Recent bookings for dashboard
export async function getBookingsAfterDate(date: string): Promise<Booking[]> {
    const { data } =
        backendMode === 'http'
            ? await getBookingsHttp()
            : await getBookingsLocal();
    return filterAfterDate(data, date);
}

// "Stays" after date – for charts
export async function getStaysAfterDate(date: string): Promise<Booking[]> {
    const { data } =
        backendMode === 'http'
            ? await getBookingsHttp()
            : await getBookingsLocal();
    return filterAfterDate(data, date);
}

// Check-in / check-out helpers
export async function checkin(
    id: number | string,
    update: Partial<Booking> = {}
): Promise<Booking | undefined> {
    const payload = { ...(update as any), status: 'checked-in' };
    return updateBooking(id, payload);
}

export async function checkout(
    id: number | string
): Promise<Booking | undefined> {
    return updateBooking(id, { status: 'checked-out' });
}
