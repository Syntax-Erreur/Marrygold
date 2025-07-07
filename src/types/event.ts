export interface EventFormData {
    eventName: string;
    eventTag: string;
    tables: string;
    peoplePerTable: string;
    themeColorIndex: number | null;
    startDateTime: string;
    endDateTime: string;
    budget: string;
}

export interface FirestoreEventData {
    name: string;
    tag: string;
    tables: number;
    peoplePerTable: number;
    themeColorIndex: number;
    totalCapacity: number;
    createdAt: string;
    isDefault?: boolean;
    userId?: string;
    startDateTime: string;
    endDateTime: string;
    budget: number | null;
} 