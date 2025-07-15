"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import GuestListHeader from "./guest-list-header";
import GuestListControls from "./guest-list-controls";
import GuestListTable from "./guest-list-table";
import AddGuestDialog from "./add-guest-dialog";
import TableWiseView from "./table-view";
import { Chatbot } from "./chatbot/Chatbot";
import { getGuestsByEvent, validateEvent } from "@/lib/firebase/guest-service";
import type { Guest } from "@/lib/types/guest";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";

export default function GuestList() {
  const { event } = useParams();
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"individual" | "table">(
    "individual"
  );
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [userId, setUserId] = useState<string>("");
  const [normalizedEventName, setNormalizedEventName] = useState<string>("");

  const fetchGuests = useCallback(async () => {
    try {
      setIsLoading(true);

      // ✅ Updated normalization
      const eventNameNormalized = decodeURIComponent(
        String(event)
      ).toLowerCase();
      console.log("Normalized event name:", eventNameNormalized);

      setNormalizedEventName(eventNameNormalized);

      const eventExists = await validateEvent(eventNameNormalized);
      console.log("Event validation result:", eventExists);

      if (!eventExists) {
        throw new Error(`Event ${eventNameNormalized} not found`);
      }

      if (!auth.currentUser) {
        throw new Error("You must be logged in to view guests");
      }

      setUserId(auth.currentUser.uid);

      const fetchedGuests = await getGuestsByEvent(
        auth.currentUser.uid,
        eventNameNormalized
      );
      setGuests(fetchedGuests);
      setError(null);
    } catch (error) {
      console.error("Error in fetchGuests:", error);
      toast.error(
        `Error loading guests: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      setError(error instanceof Error ? error : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, [event]);

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (event) {
      const checkAuthAndFetchGuests = async () => {
        if (!auth.currentUser) {
          setIsLoading(true);
          console.log("Waiting for authentication to initialize...");

          const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
              setUserId(user.uid);
              fetchGuests();
            } else {
              setIsLoading(false);
              setError(new Error("You must be logged in to view guests"));
            }
            unsubscribe();
          });
        } else {
          setUserId(auth.currentUser.uid);
          fetchGuests();
        }
      };

      checkAuthAndFetchGuests();
    }
  }, [event, fetchGuests, refreshTrigger]);

  useEffect(() => {
    console.log("Guests state updated:", guests);

    if (normalizedEventName) {
      const matchingGuests = guests.filter((guest) =>
        guest.events.some((e) => e.toLowerCase() === normalizedEventName)
      );
      console.log(
        `Found ${matchingGuests.length} guests for ${normalizedEventName}:`,
        matchingGuests
      );
    }
  }, [guests, normalizedEventName]);

  const handleSearch = (query: string) => setSearchQuery(query);

  const handleGuestAdded = async () => refreshData();

  const handleGuestsDeleted = async () => {
    refreshData();
    toast.success("Guests deleted successfully");
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      <GuestListHeader />
      <div className="bg-white w-full">
        <GuestListControls
          onOpenChatbot={() => setIsChatbotOpen(true)}
          onSearch={handleSearch}
          onViewModeChange={setViewMode}
          onRefreshData={refreshData}
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error.message}</p>
          </div>
        ) : viewMode === "individual" ? (
          <GuestListTable
            guests={guests}
            searchQuery={searchQuery}
            isLoading={isLoading}
            error={error}
            onGuestsDeleted={handleGuestsDeleted}
          />
        ) : (
          <TableWiseView
            guests={guests}
            userId={userId}
            onRefreshData={refreshData}
          />
        )}
      </div>

      <AddGuestDialog
        open={isAddGuestOpen}
        onOpenChange={setIsAddGuestOpen}
        onGuestAdded={handleGuestAdded}
      />

      <Chatbot isOpen={isChatbotOpen} onOpenChange={setIsChatbotOpen} />
    </div>
  );
}
