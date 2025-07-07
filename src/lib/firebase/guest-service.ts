import { collection, query, where, getDocs, addDoc, orderBy, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { Guest, EventType, DEFAULT_EVENTS, FoodPreference } from '../types/guest'

// Form validation functions
function validateGuestData(guest: Partial<Guest>): boolean {
    if (!guest.name || !guest.mobileNumber || !guest.events || !guest.foodPreference) {
        return false;
    }
    return true;
}

function validateEventData(events: EventType[]): boolean {
    return events.length > 0 && events.every(event =>
        DEFAULT_EVENTS.includes(event as any) || typeof event === 'string'
    );
}

export async function validateEvent(eventName: string) {
    try {
        console.log("Validating event:", eventName)
        if (!auth.currentUser) {
            console.log("No authenticated user found")
            throw new Error("No authenticated user")
        }
        console.log("Current user ID:", auth.currentUser.uid)

        // Normalize event name to Title Case for consistency
        const normalizedEventName = eventName.charAt(0).toUpperCase() + eventName.slice(1).toLowerCase()
        console.log("Normalized event name:", normalizedEventName)

        // First check if it's a default event
        const isDefaultEvent = DEFAULT_EVENTS.some(
            event => event.toLowerCase() === normalizedEventName.toLowerCase()
        );

        if (isDefaultEvent) {
            console.log("Valid default event:", normalizedEventName);
            return true;
        }

        // If not a default event, check in events collection for custom events
        const eventsRef = collection(db, "events")
        const eventsQuery = query(
            eventsRef,
            where("userId", "==", auth.currentUser.uid)
        )
        const eventsSnapshot = await getDocs(eventsQuery)
        console.log("Events collection check result:", !eventsSnapshot.empty)

        // Check if any event matches case-insensitively
        const eventExists = eventsSnapshot.docs.some(doc => {
            const docEventName = doc.data().name;
            return docEventName.toLowerCase() === normalizedEventName.toLowerCase();
        });

        // If event exists in events collection, return true
        if (eventExists) {
            console.log("Valid custom event:", normalizedEventName);
            return true;
        }

        // If not found in events collection, check if any guests have this event
        const guestsRef = collection(db, "guests")
        const guestsQuery = query(
            guestsRef,
            where("userId", "==", auth.currentUser.uid)
        )
        const guestsSnapshot = await getDocs(guestsQuery)
        console.log("Checking guests for event:", normalizedEventName)

        // Check if any guest has the event (case-insensitive)
        const hasGuestWithEvent = guestsSnapshot.docs.some(doc => {
            const guestEvents = doc.data().events || [];
            return guestEvents.some((event: string) =>
                event.toLowerCase() === normalizedEventName.toLowerCase()
            );
        });

        console.log("Guests with event check result:", hasGuestWithEvent)
        if (hasGuestWithEvent) {
            console.log("Event found in guest records:", normalizedEventName);
            return true;
        }

        console.log("Event not found:", normalizedEventName);
        return false;
    } catch (error) {
        console.error("Error validating event:", error)
        return false
    }
}

export async function getGuestsByEvent(userId: string, event: EventType): Promise<Guest[]> {
    try {
        if (!userId) {
            console.error('getGuestsByEvent: userId is required but was not provided');
            throw new Error('User ID is required');
        }

        if (!event) {
            console.error('getGuestsByEvent: event is required but was not provided');
            throw new Error('Event name is required');
        }

        // Normalize event name to match how it's stored in the database
        const normalizedEvent = typeof event === 'string'
            ? event.charAt(0).toUpperCase() + event.slice(1).toLowerCase()
            : event;

        console.log(`Getting guests for user ${userId} and event ${normalizedEvent}`);

        const guestsRef = collection(db, 'guests');
        const q = query(
            guestsRef,
            where('userId', '==', userId),
            where('events', 'array-contains', normalizedEvent)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Guest));
    } catch (error) {
        console.error('Error fetching guests by event:', error);
        return [];
    }
}

export async function addGuest(userId: string, guestData: Omit<Guest, 'id' | 'userId' | 'createdAt'>): Promise<Guest | null> {
    try {
        if (!validateGuestData(guestData)) {
            throw new Error('Invalid guest data');
        }
        if (!validateEventData(guestData.events)) {
            throw new Error('Invalid events');
        }

        const guestRef = collection(db, 'guests');
        const newGuest: Omit<Guest, 'id'> = {
            ...guestData,
            userId,
            createdAt: new Date().toISOString(),
        };

        const docRef = await addDoc(guestRef, newGuest);
        return { ...newGuest, id: docRef.id };
    } catch (error) {
        console.error('Error adding guest:', error);
        return null;
    }
}

export async function addGuestToEvent(guestId: string, eventName: string) {
    try {
        if (!auth.currentUser) throw new Error("No authenticated user")

        // First validate the event exists
        const eventExists = await validateEvent(eventName)
        if (!eventExists) {
            throw new Error(`Event ${eventName} not found`)
        }

        // Get the guest document
        const guestRef = doc(db, "guests", guestId)
        const guestDoc = await getDoc(guestRef)

        if (!guestDoc.exists()) {
            throw new Error("Guest not found")
        }

        const guestData = guestDoc.data()
        if (guestData.userId !== auth.currentUser.uid) {
            throw new Error("Unauthorized")
        }

        // Add the event to the guest's events array if not already present
        const events = guestData.events || []
        if (!events.includes(eventName)) {
            events.push(eventName)
            await updateDoc(guestRef, { events })
        }

        return true
    } catch (error) {
        console.error("Error adding guest to event:", error)
        throw error
    }
}

export async function deleteGuest(guestId: string): Promise<boolean> {
    try {
        if (!auth.currentUser) throw new Error("No authenticated user")

        // Get the guest document to verify ownership
        const guestRef = doc(db, "guests", guestId)
        const guestDoc = await getDoc(guestRef)

        if (!guestDoc.exists()) {
            throw new Error("Guest not found")
        }

        const guestData = guestDoc.data()
        if (guestData.userId !== auth.currentUser.uid) {
            throw new Error("Unauthorized")
        }

        // Delete the guest document
        await deleteDoc(guestRef)
        return true
    } catch (error) {
        console.error("Error deleting guest:", error)
        return false
    }
} 