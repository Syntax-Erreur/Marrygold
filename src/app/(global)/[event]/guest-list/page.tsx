"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import GuestListHeader from "./guest-list-header"
import GuestListControls from "./guest-list-controls"
import GuestListTable from "./guest-list-table"
import AddGuestDialog from "./add-guest-dialog"
import TableWiseView from "./table-view"
import { Chatbot } from "./chatbot/Chatbot"
import { getGuestsByEvent, validateEvent } from "@/lib/firebase/guest-service"
import type { Guest } from "@/lib/types/guest"
import { toast } from "sonner"
import { auth } from "@/lib/firebase"

export default function GuestList() {
  const { event } = useParams()
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<'individual' | 'table'>('individual')
  const [guests, setGuests] = useState<Guest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [userId, setUserId] = useState<string>('')
  const [normalizedEventName, setNormalizedEventName] = useState<string>('')

  const fetchGuests = useCallback(async () => {
    try {
      setIsLoading(true)
      console.log("Fetching guests for event:", event)
      console.log("Event param type:", typeof event)

      // Normalize the event name for consistency (first letter uppercase, rest lowercase)
      const eventNameNormalized = String(event).charAt(0).toUpperCase() + String(event).slice(1).toLowerCase()
      setNormalizedEventName(eventNameNormalized)
      console.log("Normalized event name:", eventNameNormalized)

      const eventExists = await validateEvent(eventNameNormalized)
      console.log("Event validation result:", eventExists)

      if (!eventExists) {
        console.log("Event validation failed")
        throw new Error(`Event ${eventNameNormalized} not found`)
      }

      // Check if user is authenticated
      if (!auth.currentUser) {
        console.error("No authenticated user")
        throw new Error("You must be logged in to view guests")
      }

      setUserId(auth.currentUser.uid)
      
      // Get all guests for this event
      const fetchedGuests = await getGuestsByEvent(auth.currentUser.uid, eventNameNormalized)
      console.log("Fetched guests:", fetchedGuests, "for event:", eventNameNormalized)
      
      if (fetchedGuests.length === 0) {
        console.log("No guests found for this event")
      }

      setGuests(fetchedGuests)
      setError(null)
    } catch (error) {
      console.error("Error in fetchGuests:", error)
      toast.error(`Error loading guests: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setError(error instanceof Error ? error : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }, [event])

  // Refresh data after operations
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  useEffect(() => {
    if (event) {
      // We need to ensure auth is initialized before fetching guests
      const checkAuthAndFetchGuests = async () => {
        // Wait a bit for auth to initialize if it hasn't already
        if (!auth.currentUser) {
          // Add a small delay to give auth time to initialize
          setIsLoading(true);
          console.log("Waiting for authentication to initialize...");

          // Set up an auth state listener
          const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
              console.log("User authenticated, fetching guests");
              setUserId(user.uid);
              fetchGuests();
            } else {
              console.log("No user logged in");
              setIsLoading(false);
              setError(new Error("You must be logged in to view guests"));
            }
            unsubscribe(); // Clean up the listener
          });
        } else {
          // User is already authenticated
          console.log("User already authenticated, fetching guests");
          setUserId(auth.currentUser.uid);
          fetchGuests();
        }
      };

      checkAuthAndFetchGuests();
    }
  }, [event, fetchGuests, refreshTrigger]);

  // Debug: Log whenever guests update
  useEffect(() => {
    console.log("Guests state updated:", guests);
    
    // Log guests that match the event
    if (normalizedEventName) {
      const matchingGuests = guests.filter(guest => 
        guest.events.some(e => e.toLowerCase() === normalizedEventName.toLowerCase())
      );
      console.log(`Found ${matchingGuests.length} guests for ${normalizedEventName}:`, matchingGuests);
    }
  }, [guests, normalizedEventName]);

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleGuestAdded = async () => {
    refreshData()
  }

  const handleGuestsDeleted = async () => {
    refreshData()
    toast.success("Guests deleted successfully")
  }

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
        ) : viewMode === 'individual' ? (
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
  )
}

