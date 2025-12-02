// src/types.ts
// TODO: flesh out once /stays and /settings API are designed
export type ChamberStatus = 'available' | 'occupied' | 'maintenance' | 'closed';
export type StayStatus = 'available' | 'occupied' | 'maintenance' | 'closed';
export type SettingStatus = 'available' | 'occupied' | 'maintenance' | 'closed';

export interface Chamber {
    id: string;
    name: string;
    floor: number | null;
    capacity: number;
    baseNightlyRate: number;
    active: boolean;

    description: string;
    tags: string[];

    currentStayId?: string | null;
}


export interface Setting {
    minBookingLength: number;
    maxBookingLength: number;
    maxGuestsPerBooking: number;
    breakfastPrice: number;
    editedAt?: string;
}

export interface Stay {
}