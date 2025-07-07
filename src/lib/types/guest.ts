// Guest and event related types

export type EventName = "Haldi" | "Sangeet" | "Engagement";
export type CustomEventName = string;
export type EventType = EventName | CustomEventName;

export type FoodPreference = "Veg" | "Non Veg";

export interface Guest {
    id: string;
    userId: string;
    name: string;
    email?: string;
    mobileNumber: string;
    events: EventType[];
    foodPreference: FoodPreference;
    tableNumber?: number;
    tableId?: string;
    createdAt: string;
    source?: "manual" | "group" | "invite";
}

export interface Event {
    name: EventType;
    color: string;
    dotColor: string;
}

export interface PrimaryGuest {
    firstName: string;
    lastName: string;
    contactNumber: string;
    email?: string;
    foodPreference: FoodPreference;
}

export const DEFAULT_EVENTS: EventName[] = ["Haldi", "Sangeet", "Engagement"]; 