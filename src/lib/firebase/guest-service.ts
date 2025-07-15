import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import {
  Guest,
  EventType,
  DEFAULT_EVENTS,
  FoodPreference,
} from "../types/guest";

// Form validation functions
function validateGuestData(guest: Partial<Guest>): boolean {
  if (
    !guest.name ||
    !guest.mobileNumber ||
    !guest.events ||
    !guest.foodPreference
  ) {
    return false;
  }
  return true;
}

function validateEventData(events: EventType[]): boolean {
  return (
    events.length > 0 &&
    events.every(
      (event) =>
        DEFAULT_EVENTS.includes(event as any) || typeof event === "string"
    )
  );
}

export async function validateEvent(eventName: string) {
  try {
    console.log("Validating event:", eventName);
    if (!auth.currentUser) {
      console.log("No authenticated user found");
      throw new Error("No authenticated user");
    }
    console.log("Current user ID:", auth.currentUser.uid);

    const normalizedEventName = decodeURIComponent(eventName).toLowerCase();
    console.log("Normalized event name:", normalizedEventName);

    const isDefaultEvent = DEFAULT_EVENTS.some(
      (event) => event.toLowerCase() === normalizedEventName
    );

    if (isDefaultEvent) {
      console.log("Valid default event:", normalizedEventName);
      return true;
    }

    const eventsRef = collection(db, "events");
    const eventsQuery = query(
      eventsRef,
      where("userId", "==", auth.currentUser.uid)
    );
    const eventsSnapshot = await getDocs(eventsQuery);
    console.log("Events collection check result:", !eventsSnapshot.empty);

    const eventExists = eventsSnapshot.docs.some((doc) => {
      const docEventName = doc.data().name;
      return docEventName.toLowerCase() === normalizedEventName;
    });

    if (eventExists) {
      console.log("Valid custom event:", normalizedEventName);
      return true;
    }

    const guestsRef = collection(db, "guests");
    const guestsQuery = query(
      guestsRef,
      where("userId", "==", auth.currentUser.uid)
    );
    const guestsSnapshot = await getDocs(guestsQuery);
    console.log("Checking guests for event:", normalizedEventName);

    const hasGuestWithEvent = guestsSnapshot.docs.some((doc) => {
      const guestEvents = doc.data().events || [];
      return guestEvents.some(
        (event: string) => event.toLowerCase() === normalizedEventName
      );
    });

    console.log("Guests with event check result:", hasGuestWithEvent);
    if (hasGuestWithEvent) {
      console.log("Event found in guest records:", normalizedEventName);
      return true;
    }

    console.log("Event not found:", normalizedEventName);
    return false;
  } catch (error) {
    console.error("Error validating event:", error);
    return false;
  }
}

export async function getGuestsByEvent(
  userId: string,
  event: EventType
): Promise<Guest[]> {
  try {
    if (!userId) {
      console.error(
        "getGuestsByEvent: userId is required but was not provided"
      );
      throw new Error("User ID is required");
    }

    if (!event) {
      console.error("getGuestsByEvent: event is required but was not provided");
      throw new Error("Event name is required");
    }

    const normalizedEvent =
      typeof event === "string"
        ? decodeURIComponent(event).toLowerCase()
        : event;

    console.log(
      `Getting guests for user ${userId} and event ${normalizedEvent}`
    );

    const guestsRef = collection(db, "guests");
    const q = query(
      guestsRef,
      where("userId", "==", userId),
      where("events", "array-contains", normalizedEvent)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Guest
    );
  } catch (error) {
    console.error("Error fetching guests by event:", error);
    return [];
  }
}

export async function addGuest(
  userId: string,
  guestData: Omit<Guest, "id" | "userId" | "createdAt">
): Promise<Guest | null> {
  try {
    if (!validateGuestData(guestData)) {
      throw new Error("Invalid guest data");
    }
    if (!validateEventData(guestData.events)) {
      throw new Error("Invalid events");
    }

    const guestRef = collection(db, "guests");
    const newGuest: Omit<Guest, "id"> = {
      ...guestData,
      userId,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(guestRef, newGuest);
    return { ...newGuest, id: docRef.id };
  } catch (error) {
    console.error("Error adding guest:", error);
    return null;
  }
}

export async function addGuestToEvent(guestId: string, eventName: string) {
  try {
    if (!auth.currentUser) throw new Error("No authenticated user");

    const normalizedEvent = decodeURIComponent(eventName).toLowerCase();
    const eventExists = await validateEvent(normalizedEvent);
    if (!eventExists) {
      throw new Error(`Event ${normalizedEvent} not found`);
    }

    const guestRef = doc(db, "guests", guestId);
    const guestDoc = await getDoc(guestRef);

    if (!guestDoc.exists()) {
      throw new Error("Guest not found");
    }

    const guestData = guestDoc.data();
    if (guestData.userId !== auth.currentUser.uid) {
      throw new Error("Unauthorized");
    }

    const events = guestData.events || [];
    if (!events.includes(normalizedEvent)) {
      events.push(normalizedEvent);
      await updateDoc(guestRef, { events });
    }

    return true;
  } catch (error) {
    console.error("Error adding guest to event:", error);
    throw error;
  }
}

export async function deleteGuest(guestId: string): Promise<boolean> {
  try {
    if (!auth.currentUser) throw new Error("No authenticated user");

    const guestRef = doc(db, "guests", guestId);
    const guestDoc = await getDoc(guestRef);

    if (!guestDoc.exists()) {
      throw new Error("Guest not found");
    }

    const guestData = guestDoc.data();
    if (guestData.userId !== auth.currentUser.uid) {
      throw new Error("Unauthorized");
    }

    await deleteDoc(guestRef);
    return true;
  } catch (error) {
    console.error("Error deleting guest:", error);
    return false;
  }
}
