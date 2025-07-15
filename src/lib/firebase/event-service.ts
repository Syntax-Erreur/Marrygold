import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, orderBy, addDoc, serverTimestamp } from "firebase/firestore"
import type { FirestoreEventData } from "@/types/event"

export const DEFAULT_EVENTS: FirestoreEventData[] = [
    {
        name: "Haldi",
        tag: "Pre-Wedding",
        tables: 4,
        peoplePerTable: 6,
        themeColorIndex: 1,
        totalCapacity: 24,
        createdAt: new Date().toISOString(),
        isDefault: true,
        startDateTime: new Date().toISOString(),
        endDateTime: new Date(Date.now() + 86400000).toISOString(), // Next day
        budget: null
    },
    {
        name: "Sangeet",
        tag: "Pre-Wedding",
        tables: 6,
        peoplePerTable: 8,
        themeColorIndex: 2,
        totalCapacity: 48,
        createdAt: new Date().toISOString(),
        isDefault: true,
        startDateTime: new Date().toISOString(),
        endDateTime: new Date(Date.now() + 86400000).toISOString(), // Next day
        budget: null
    },
    {
        name: "Engagement",
        tag: "Ceremony",
        tables: 8,
        peoplePerTable: 8,
        themeColorIndex: 3,
        totalCapacity: 64,
        createdAt: new Date().toISOString(),
        isDefault: true,
        startDateTime: new Date().toISOString(),
        endDateTime: new Date(Date.now() + 86400000).toISOString(), // Next day
        budget: null
    }
]

export async function fetchUserEvents(userId: string | null): Promise<(FirestoreEventData & { id: string })[]> {
    try {

        if (!userId) {

            return DEFAULT_EVENTS.map((event, index) => ({
                ...event,
                id: `default-${index}`
            }))
        }

        // Try to fetch user events with simplified query
        try {
            const eventsRef = collection(db, "events")
            const q = query(
                eventsRef,
                where("userId", "==", userId)
                // Removed orderBy temporarily until index is created
            )

            const querySnapshot = await getDocs(q)
            const userEvents = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as (FirestoreEventData & { id: string })[]

            // Sort events in memory instead
            userEvents.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )

            // If no user events, return defaults
            // if (userEvents.length === 0) {
            //     return DEFAULT_EVENTS.map((event, index) => ({
            //         ...event,
            //         id: `default-${index}`
            //     }))
            // }

            return userEvents
        } catch (error) {
            console.error("Error fetching user events:", error)
            return DEFAULT_EVENTS.map((event, index) => ({
                ...event,
                id: `default-${index}`
            }))
        }
    } catch (error) {
        console.error("Error in fetchUserEvents:", error)
        throw error
    }
} 