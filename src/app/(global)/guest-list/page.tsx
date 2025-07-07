"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Info, Search, PlusCircle, Trash2, User, Copy, X, GripVertical, ChevronsDown, RefreshCw } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Inter } from 'next/font/google'
import Image from "next/image"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { collection, getDocs, addDoc, query, orderBy, where, deleteDoc, doc, updateDoc, setDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateInviteCode } from "@/lib/generateInviteCode"
import { createInviteLink } from "@/lib/firebase/invite-service"
import { auth } from "@/lib/firebase"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

const inter = Inter({ subsets: ['latin'] })

interface Guest {
  id: string
  userId: string
  name: string
  email: string
  events: EventType[]
  foodPreference: FoodType
  mobileNumber: string
  createdAt: string
  source?: string
  tableId?: string // New field for table assignment
}

interface TableAssignment {
  id: string
  userId: string
  name: string
  capacity: number
  guests: Guest[]
  createdAt: string
}

interface Event {
  name: EventType
  color: string
  dotColor: string
}

interface PrimaryGuest {
  firstName: string
  lastName: string
  contactNumber: string
  email: string
  foodPreference: FoodType
}

type EventType = "Haldi" | "Sangeet" | "Engagement" | string

type FoodType = "Veg" | "Non Veg"

const EVENTS: Event[] = [
  { name: "Haldi", color: "bg-yellow-50 border-yellow-200 text-yellow-700", dotColor: "bg-yellow-500" },
  { name: "Sangeet", color: "bg-blue-50 border-blue-200 text-blue-700", dotColor: "bg-blue-500" },
  { name: "Engagement", color: "bg-green-50 border-green-200 text-green-700", dotColor: "bg-green-500" }
]

const guestData: Guest[] = [
  {
    id: "mock1",
    userId: "mockUserId",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    events: ["Haldi", "Sangeet", "Engagement"],
    foodPreference: "Veg",
    mobileNumber: "+91 321 213 2342",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    source: "manual"
  },
  {
    id: "mock2",
    userId: "mockUserId",
    name: "Arjun Patel",
    email: "arjun.patel@email.com",
    events: ["Haldi", "Sangeet"],
    foodPreference: "Veg",
    mobileNumber: "+91 321 213 2342",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), // 6 days ago
    source: "manual"
  },
  {
    id: "mock3",
    userId: "mockUserId",
    name: "Neha Kapoor",
    email: "neha.kapoor@email.com",
    events: ["Haldi"],
    foodPreference: "Non Veg",
    mobileNumber: "+91 321 213 2342",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    source: "manual"
  },
  {
    id: "mock4",
    userId: "mockUserId",
    name: "Rohan Singh",
    email: "rohan.singh@email.com",
    events: ["Sangeet"],
    foodPreference: "Non Veg",
    mobileNumber: "+91 321 213 2342",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    source: "manual"
  },
  {
    id: "mock5",
    userId: "mockUserId",
    name: "Anjali Mehta",
    email: "anjali.mehta@email.com",
    events: ["Engagement"],
    foodPreference: "Veg",
    mobileNumber: "+91 321 213 2342",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    source: "manual"
  },
  {
    id: "mock6",
    userId: "mockUserId",
    name: "Vikram Desai",
    email: "vikram.desai@email.com",
    events: ["Sangeet"],
    foodPreference: "Veg",
    mobileNumber: "+91 321 213 2342",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    source: "group"
  },
  {
    id: "mock7",
    userId: "mockUserId",
    name: "Sneha Gupta",
    email: "sneha.gupta@email.com",
    events: ["Engagement"],
    foodPreference: "Non Veg",
    mobileNumber: "+91 321 213 2342",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    source: "manual"
  },
  {
    id: "mock8",
    userId: "mockUserId",
    name: "Karan Malhotra",
    email: "karan.malhotra@email.com",
    events: ["Haldi"],
    foodPreference: "Veg",
    mobileNumber: "+91 321 213 2342",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    source: "manual"
  },
  {
    id: "mock9",
    userId: "mockUserId",
    name: "Ritu Verma",
    email: "ritu.verma@email.com",
    events: ["Haldi", "Engagement"],
    foodPreference: "Veg",
    mobileNumber: "+91 321 213 2342",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    source: "group"
  },
  {
    id: "mock10",
    userId: "mockUserId",
    name: "Sameer Chopra",
    email: "sameer.chopra@email.com",
    events: ["Sangeet"],
    foodPreference: "Veg",
    mobileNumber: "+91 321 213 2342",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    source: "manual"
  },
  {
    id: "mock11",
    userId: "mockUserId",
    name: "Pooja Rastogi",
    email: "pooja.rastogi@email.com",
    events: ["Haldi"],
    foodPreference: "Non Veg",
    mobileNumber: "+91 321 213 2342",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    source: "manual"
  },
  {
    id: "mock12",
    userId: "mockUserId",
    name: "Amit Joshi",
    email: "amit.joshi@email.com",
    events: ["Engagement"],
    foodPreference: "Veg",
    mobileNumber: "+91 321 213 2342",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    source: "group"
  },
  {
    id: "mock13",
    userId: "mockUserId",
    name: "Sonia Khanna",
    email: "sonia.khanna@email.com",
    events: ["Sangeet"],
    foodPreference: "Non Veg",
    mobileNumber: "+91 321 213 2342",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    source: "manual"
  },
  {
    id: "mock14",
    userId: "mockUserId",
    name: "Rajesh Iyer",
    email: "rajesh.iyer@email.com",
    events: ["Haldi", "Sangeet"],
    foodPreference: "Veg",
    mobileNumber: "+91 321 213 2342",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    source: "manual"
  },
  {
    id: "mock15",
    userId: "mockUserId",
    name: "Kavita Nair",
    email: "kavita.nair@email.com",
    events: ["Engagement"],
    foodPreference: "Veg",
    mobileNumber: "+91 321 213 2342",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    source: "manual"
  },
  {
    id: "mock16",
    userId: "mockUserId",
    name: "Vikrant Roy",
    email: "vikrant.roy@email.com",
    events: ["Sangeet"],
    foodPreference: "Non Veg",
    mobileNumber: "+91 321 213 2342",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    source: "group"
  },
  {
    id: "mock17",
    userId: "mockUserId",
    name: "Deepika Sen",
    email: "deepika.sen@email.com",
    events: ["Sangeet"],
    foodPreference: "Non Veg",
    mobileNumber: "+91 321 213 2342",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    source: "manual"
  }
]

interface AddGuestFormProps {
  isOpen: boolean
  onClose: () => void
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>
}

const AddGuestForm = ({ onClose, setGuests }: AddGuestFormProps) => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [selectedEvents, setSelectedEvents] = useState<EventType[]>([])
  const [foodPreference, setFoodPreference] = useState<FoodType>("Veg")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEventSelection = (eventName: EventType) => {
    if (isSubmitting) return;
    if (selectedEvents.includes(eventName)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== eventName))
    } else {
      setSelectedEvents([...selectedEvents, eventName])
    }
  }

  const isEventSelected = (eventName: EventType) => selectedEvents.includes(eventName)

  const handleReset = () => {
    if (isSubmitting) return;
    setFirstName("")
    setLastName("")
    setEmail("")
    setContactNumber("")
    setSelectedEvents([])
    setFoodPreference("Veg")
  }

  const handleSubmit = async () => {
    // Validation checks
    if (!firstName || !lastName) {
      toast.error("Please provide both first and last name")
      return
    }

    if (selectedEvents.length === 0) {
      toast.error("Please select at least one event")
      return
    }

    if (!contactNumber) {
      toast.error("Please provide a contact number")
      return
    }

    try {
      setIsSubmitting(true)

      const guestData = {
        userId: auth.currentUser?.uid,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        email,
        events: selectedEvents,
        foodPreference,
        mobileNumber: contactNumber,
        createdAt: new Date().toISOString(),
        source: "manual"
      }

       const addGuestPromise = addDoc(collection(db, "guests"), guestData);

      let emailPromise = Promise.resolve({ ok: true });
      if (email) {
        // Generate invite link
        const event = selectedEvents[0] || "Wedding";
        const inviteCode = await generateInviteCode();

        const emailData = {
          guestName: `${firstName} ${lastName}`.trim(),
          email,
          events: selectedEvents,
          weddingDate: "January 15, 2025", 
          weddingLocation: "The Grand Ballroom, Mumbai",  
          coupleName: "Rahul & Priya", 
          inviteLink: `${window.location.origin}/guest-list/add?invite=${inviteCode}`
        }

        emailPromise = fetch('/api/send-invitation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });
      }

      // Execute both operations concurrently
      const [docRef, emailResponse] = await Promise.all([
        addGuestPromise,
        emailPromise
      ]);

      // Check email sending result
      if (!emailResponse.ok && email) {
        console.error('Warning: Failed to send invitation email');
        toast.warning("Guest added, but invitation email could not be sent");
      } else if (email) {
        console.log('Invitation email sent successfully');
      }

      // Update local state
      setGuests(prev => [{
        ...guestData,
        id: docRef.id
      } as Guest, ...prev]);

      toast.success("Guest added successfully");
      handleReset();
      onClose();
    } catch (error) {
      console.error("Error adding guest:", error);
      toast.error("Failed to add guest");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6  bg-white rounded-lg max-h-[85vh] overflow-y-auto">
      <header className="p-6 flex justify-between items-center sticky top-0 bg-white z-10 pb-4">
        <DialogTitle className="sr-only">Add Guest Form</DialogTitle>
        <h1 className="text-xl font-semibold text-neutral-900">Add Guest</h1>
        <button
          className="flex items-center justify-center h-6 w-6 rounded-[4px] bg-red-600 hover:bg-red-700 text-white transition-colors"
          onClick={isSubmitting ? undefined : onClose}
          aria-label="Close dialog"
          disabled={isSubmitting}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      <section className="flex flex-col gap-6 px-6">
        <div className="flex gap-4 sm:gap-6 flex-col sm:flex-row">
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-neutral-900" htmlFor="first-name">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="first-name"
              type="text"
              placeholder="Enter First Name"
              className="px-4 w-full h-12 text-sm bg-white rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:text-gray-500"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              aria-label="First name"
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-neutral-900" htmlFor="last-name">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="last-name"
              type="text"
              placeholder="Enter Last Name"
              className="px-4 w-full h-12 text-sm bg-white rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:text-gray-500"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              aria-label="Last name"
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-900" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter Email Address"
            className="px-4 w-full h-12 text-sm bg-white rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:text-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-900" htmlFor="select-event">
            Select Event <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3 flex-wrap sm:flex-nowrap">
            {EVENTS.map((event) => (
              <button
                key={event.name}
                className={`flex-1 h-12 text-sm font-medium rounded-lg border cursor-pointer min-w-[100px] flex items-center justify-center gap-2 transition-colors ${isEventSelected(event.name)
                  ? event.color
                  : "bg-neutral-100 border-neutral-200 text-neutral-900 hover:bg-neutral-200"
                  } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={() => handleEventSelection(event.name)}
                type="button"
                aria-pressed={isEventSelected(event.name)}
                disabled={isSubmitting}
              >
                {isEventSelected(event.name) && <span className={`h-2 w-2 rounded-full ${event.dotColor}`} aria-hidden="true"></span>}
                {event.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-900">Choice of Food</label>
          <div className="flex gap-3">
            <button
              className={`flex-1 h-12 text-sm font-medium rounded-lg border cursor-pointer flex items-center justify-center gap-2 transition-colors ${foodPreference === "Veg"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-neutral-100 border-neutral-200 text-neutral-900 hover:bg-neutral-200"
                } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={() => !isSubmitting && setFoodPreference("Veg")}
              type="button"
              aria-pressed={foodPreference === "Veg"}
              disabled={isSubmitting}
            >
              {foodPreference === "Veg" && <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden="true"></span>}
              Veg
            </button>
            <button
              className={`flex-1 h-12 text-sm font-medium rounded-lg border cursor-pointer flex items-center justify-center gap-2 transition-colors ${foodPreference === "Non Veg"
                ? "bg-orange-50 border-orange-200 text-orange-700"
                : "bg-neutral-100 border-neutral-200 text-neutral-900 hover:bg-neutral-200"
                } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={() => !isSubmitting && setFoodPreference("Non Veg")}
              type="button"
              aria-pressed={foodPreference === "Non Veg"}
              disabled={isSubmitting}
            >
              {foodPreference === "Non Veg" && <span className="h-2 w-2 rounded-full bg-orange-500" aria-hidden="true"></span>}
              Non Veg
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-900" htmlFor="contact-number">
            WhatsApp/Contact Number <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-number"
            type="text"
            placeholder="Enter Contact Number"
            className="px-4 w-full h-12 text-sm bg-white rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:text-gray-500"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            aria-label="Contact number"
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="flex gap-8 justify-end mt-2 mb-4">
          <button
            className={`text-sm font-medium rounded-lg border bg-neutral-100 border-neutral-200 h-[52px] text-neutral-900 w-[120px] transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-200'}`}
            onClick={handleReset}
            type="button"
            disabled={isSubmitting}
          >
            Reset
          </button>
          <button
            className={`text-sm font-medium text-white bg-pink-500 rounded-lg h-[52px] w-[120px] transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-pink-600'}`}
            onClick={handleSubmit}
            type="button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                Adding...
              </div>
            ) : (
              "Add Guest"
            )}
          </button>
        </div>
      </section>
    </div>
  )
}

interface AddGroupFormProps {
  isOpen: boolean
  onClose: () => void
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>
}

 interface TableWiseViewProps {
  guests: Guest[]
  selectedFilter: FilterType
  onAssignGuest: (guestId: string, tableId: string | undefined) => void
  onCreateTable: (tableName: string) => void
  onDeleteTable: (tableId: string) => void
  onAutoGenerate: () => void
  tables: TableAssignment[]
}

const TableWiseView = ({ 
  guests, 
  selectedFilter, 
  onAssignGuest, 
  onCreateTable, 
  onDeleteTable, 
  onAutoGenerate,
  tables 
}: TableWiseViewProps) => {
  const [isCreatingTable, setIsCreatingTable] = useState(false)
  const [newTableName, setNewTableName] = useState("")
  const [draggedGuest, setDraggedGuest] = useState<Guest | null>(null)
  const [enableGuestAccess, setEnableGuestAccess] = useState(false)
  
  // Filter tables based on selected event filter
  const filteredTables = useMemo(() => {
    if (selectedFilter === "All") {
      return tables;
    }
    
    return tables.filter(table => 
      table.guests.some(guest => guest.events.includes(selectedFilter))
    );
  }, [tables, selectedFilter]);

  // Get unassigned guests
  const unassignedGuests = useMemo(() => {
    const filtered = guests.filter(guest => !guest.tableId);
    
    if (selectedFilter === "All") {
      return filtered;
    }
    
    return filtered.filter(guest => guest.events.includes(selectedFilter));
  }, [guests, selectedFilter]);

  const handleDragStart = (guest: Guest) => {
    setDraggedGuest(guest);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, tableId: string) => {
    e.preventDefault();
    
    if (!draggedGuest) return;
    
    const targetTable = tables.find(t => t.id === tableId);
    
    if (!targetTable) return;
    
    // Check if the table is full
    if (targetTable.guests.length >= targetTable.capacity) {
      toast.error(`Table ${targetTable.name} is full`);
      return;
    }
    
    onAssignGuest(draggedGuest.id, tableId);
    setDraggedGuest(null);
  };

  const handleTableCreation = () => {
    if (!newTableName.trim()) {
      toast.error("Please provide a table name");
      return;
    }
    
    onCreateTable(newTableName);
    setNewTableName("");
    setIsCreatingTable(false);
  };

  return (
    <div className="py-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Seating Arrangement</h2>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Enable Guest Access on Wedding Day</label>
            <Switch 
              checked={enableGuestAccess} 
              onCheckedChange={setEnableGuestAccess}
              className={enableGuestAccess ? "bg-[#FF33A0]" : "bg-neutral-200"}
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={onAutoGenerate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Auto-Generate Seating
          </Button>
          
          <Button
            onClick={() => setIsCreatingTable(true)}
            className="flex items-center gap-2 bg-[#FF33A0] hover:bg-[#e62e90] text-white"
          >
            <PlusCircle className="h-4 w-4" />
            Add New Table
          </Button>
        </div>
      </div>
      
      {isCreatingTable && (
        <div className="bg-white rounded-lg p-4 mb-6 shadow border border-gray-200">
          <h3 className="text-lg font-medium mb-3">Create New Table</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              placeholder="Enter table name"
              className="flex-1 px-4 h-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <Button onClick={handleTableCreation} className="bg-[#FF33A0] hover:bg-[#e62e90] text-white">
              Create Table
            </Button>
            <Button variant="outline" onClick={() => setIsCreatingTable(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {filteredTables.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Tables Created Yet</h3>
          <p className="text-gray-500 mb-4">Start by creating a new table or auto-generating a seating plan</p>
          <Button
            onClick={() => setIsCreatingTable(true)}
            className="bg-[#FF33A0] hover:bg-[#e62e90] text-white"
          >
            Add New Table
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTables.map(table => {
            const isFull = table.guests.length >= table.capacity;
            
            return (
              <div 
                key={table.id} 
                className={`bg-white rounded-lg shadow border overflow-hidden ${
                  draggedGuest && !isFull ? "border-blue-500" : "border-gray-200"
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, table.id)}
              >
                <div className={`px-4 py-3 flex justify-between items-center ${
                  isFull ? "bg-red-100" : "bg-green-100"
                }`}>
                  <h3 className="font-semibold text-gray-900">
                    {table.name} ({table.guests.length}/{table.capacity})
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 hover:bg-gray-200"
                      onClick={() => onDeleteTable(table.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  {table.guests.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 italic">
                      No guests assigned to this table
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {table.guests.map(guest => (
                        <li 
                          key={guest.id} 
                          className="p-3 bg-gray-50 rounded-md flex items-center justify-between"
                          draggable
                          onDragStart={() => handleDragStart(guest)}
                        >
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{guest.name}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {guest.events.map((event, idx) => (
                                  <span 
                                    key={idx} 
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                      event === "Haldi" ? "bg-yellow-100 text-yellow-800" :
                                      event === "Sangeet" ? "bg-blue-100 text-blue-800" : 
                                      "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {event}
                                  </span>
                                ))}
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  guest.foodPreference === "Veg" ? "bg-green-100 text-green-800" : 
                                  "bg-orange-100 text-orange-800"
                                }`}>
                                  {guest.foodPreference}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 hover:bg-gray-200 rounded-full"
                            onClick={() => onAssignGuest(guest.id, undefined)}
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {!isFull && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full mt-4 border-dashed border-gray-300 text-gray-600 hover:text-[#FF33A0] hover:border-[#FF33A0]"
                          disabled={unassignedGuests.length === 0}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Guest
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-2" align="center">
                        <h4 className="text-sm font-medium text-gray-900 mb-2 px-2">Select a guest to add</h4>
                        <Command>
                          <CommandInput placeholder="Search guests..." />
                          <CommandEmpty>No guests found</CommandEmpty>
                          <CommandGroup className="max-h-[200px] overflow-auto">
                            {unassignedGuests.map(guest => (
                              <CommandItem 
                                key={guest.id}
                                onSelect={() => {
                                  onAssignGuest(guest.id, table.id)
                                }}
                                className="cursor-pointer"
                              >
                                <div className="flex flex-col">
                                  <span>{guest.name}</span>
                                  <span className="text-xs text-gray-500">
                                    {guest.events.join(", ")} • {guest.foodPreference}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Unassigned Guests Section */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mt-8">
        <div className="px-4 py-3 bg-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">
            Unassigned Guests ({unassignedGuests.length})
          </h3>
        </div>
        
        <div className="p-4">
          {unassignedGuests.length === 0 ? (
            <div className="text-center py-8 text-gray-500 italic">
              All guests have been assigned to tables
            </div>
          ) : (
            <div className="space-y-2">
              {unassignedGuests.map(guest => (
                <div 
                  key={guest.id} 
                  className="p-3 bg-gray-50 rounded-md flex items-center justify-between"
                  draggable
                  onDragStart={() => handleDragStart(guest)}
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{guest.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {guest.events.map((event, idx) => (
                          <span 
                            key={idx} 
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              event === "Haldi" ? "bg-yellow-100 text-yellow-800" :
                              event === "Sangeet" ? "bg-blue-100 text-blue-800" : 
                              "bg-green-100 text-green-800"
                            }`}
                          >
                            {event}
                          </span>
                        ))}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          guest.foodPreference === "Veg" ? "bg-green-100 text-green-800" : 
                          "bg-orange-100 text-orange-800"
                        }`}>
                          {guest.foodPreference}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        Assign to Table
                        <ChevronsDown className="h-3 w-3 ml-1" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search tables..." />
                        <CommandEmpty>No tables found</CommandEmpty>
                        <CommandGroup>
                          {tables
                            .filter(table => table.guests.length < table.capacity)
                            .map(table => (
                              <CommandItem 
                                key={table.id}
                                onSelect={() => onAssignGuest(guest.id, table.id)}
                                className="cursor-pointer"
                              >
                                <Check 
                                  className="mr-2 h-4 w-4 opacity-0" 
                                />
                                {table.name} ({table.guests.length}/{table.capacity})
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const AddGroupForm = ({ onClose, setGuests }: AddGroupFormProps) => {
  const [primaryGuest, setPrimaryGuest] = useState<PrimaryGuest>({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    foodPreference: "Veg"
  })
  const [selectedEvents, setSelectedEvents] = useState<EventType[]>([])
  const [everyoneParticipatesSame, setEveryoneParticipatesSame] = useState(false)
  const [additionalGuests, setAdditionalGuests] = useState<PrimaryGuest[]>([
    {
      firstName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      foodPreference: "Veg"
    },
  ])
  const [additionalGuestEvents, setAdditionalGuestEvents] = useState<{ [key: number]: EventType[] }>({
    0: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEventSelection = (event: EventType) => {
    if (isSubmitting) return;
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== event))
    } else {
      setSelectedEvents([...selectedEvents, event])
    }
  }

  const handleAdditionalGuestEventSelection = (index: number, event: EventType) => {
    if (isSubmitting) return;
    const currentEvents = additionalGuestEvents[index] || []
    if (currentEvents.includes(event)) {
      setAdditionalGuestEvents({
        ...additionalGuestEvents,
        [index]: currentEvents.filter(e => e !== event)
      })
    } else {
      setAdditionalGuestEvents({
        ...additionalGuestEvents,
        [index]: [...currentEvents, event]
      })
    }
  }

  const isEventSelected = (event: EventType) => selectedEvents.includes(event)

  const isAdditionalGuestEventSelected = (index: number, event: EventType) => {
    return (additionalGuestEvents[index] || []).includes(event)
  }

  const handlePrimaryGuestChange = (field: keyof PrimaryGuest, value: string) => {
    if (isSubmitting) return;
    setPrimaryGuest({
      ...primaryGuest,
      [field]: value,
    })
  }

  const handleAdditionalGuestChange = (index: number, field: keyof PrimaryGuest, value: string) => {
    if (isSubmitting) return;
    const updatedGuests = [...additionalGuests]
    updatedGuests[index] = {
      ...updatedGuests[index],
      [field]: value,
    }
    setAdditionalGuests(updatedGuests)
  }

  const addGuest = () => {
    if (isSubmitting) return;
    const newIndex = additionalGuests.length
    setAdditionalGuests([...additionalGuests, {
      firstName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      foodPreference: "Veg"
    }])
    setAdditionalGuestEvents({
      ...additionalGuestEvents,
      [newIndex]: []
    })
  }

  const removeGuest = (index: number) => {
    if (isSubmitting) return;
    const updatedGuests = additionalGuests.filter((_, i) => i !== index)
    setAdditionalGuests(updatedGuests)

    // Update events object by removing the deleted guest's events
    const updatedEvents = { ...additionalGuestEvents }
    delete updatedEvents[index]

    // Reindex remaining guests' events
    const newEvents: { [key: number]: EventType[] } = {}
    updatedGuests.forEach((_, i) => {
      const originalIndex = additionalGuests.findIndex((__, j) => j !== index && _ === additionalGuests[j])
      if (originalIndex >= 0) {
        newEvents[i] = updatedEvents[originalIndex] || []
      }
    })

    setAdditionalGuestEvents(newEvents)
  }

  const handleReset = () => {
    if (isSubmitting) return;
    setPrimaryGuest({
      firstName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      foodPreference: "Veg"
    })
    setSelectedEvents([])
    setEveryoneParticipatesSame(false)
    setAdditionalGuests([{
      firstName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      foodPreference: "Veg"
    }])
    setAdditionalGuestEvents({ 0: [] })
  }

  const validateForm = () => {
    // Validate primary guest
    if (!primaryGuest.firstName || !primaryGuest.lastName) {
      toast.error("Please provide both first and last name for the primary guest")
      return false
    }

    if (selectedEvents.length === 0) {
      toast.error("Please select at least one event for the primary guest")
      return false
    }

    // Validate additional guests
    for (let i = 0; i < additionalGuests.length; i++) {
      const guest = additionalGuests[i]
      if (!guest.firstName || !guest.lastName) {
        toast.error(`Please provide both first and last name for guest #${i + 1}`)
        return false
      }

      if (!everyoneParticipatesSame && (additionalGuestEvents[i]?.length || 0) === 0) {
        toast.error(`Please select at least one event for guest #${i + 1}`)
        return false
      }
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true)

      // Create and collect all the promises for guest additions and email sending
      const allPromises = []
      const addedGuests: Guest[] = []

      // Add primary guest
      const primaryGuestData = {
        userId: auth.currentUser?.uid,
        name: `${primaryGuest.firstName} ${primaryGuest.lastName}`.trim(),
        email: primaryGuest.email,
        events: selectedEvents,
        foodPreference: primaryGuest.foodPreference,
        mobileNumber: primaryGuest.contactNumber,
        createdAt: new Date().toISOString(),
        source: "group"
      }

      // Create a promise for adding the primary guest
      const primaryAddPromise = addDoc(collection(db, "guests"), primaryGuestData)
        .then(docRef => {
          addedGuests.push({
            ...primaryGuestData,
            id: docRef.id
          } as Guest);
          return docRef;
        });

      allPromises.push(primaryAddPromise);

      // Send invitation email to primary guest if email is provided
      if (primaryGuest.email) {
        try {
          // Generate invite link
          const event = selectedEvents[0] || "Wedding";
          const inviteCode = await generateInviteCode();

          const emailData = {
            guestName: `${primaryGuest.firstName} ${primaryGuest.lastName}`.trim(),
            email: primaryGuest.email,
            events: selectedEvents,
            weddingDate: "January 15, 2025", // You should customize this or fetch from settings
            weddingLocation: "The Grand Ballroom, Mumbai", // You should customize this or fetch from settings 
            coupleName: "Rahul & Priya", // You should customize this or fetch from settings
            inviteLink: `${window.location.origin}/guest-list/add?invite=${inviteCode}`
          }

          const emailPromise = fetch('/api/send-invitation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
          }).catch(emailError => {
            console.error('Error sending invitation email to primary guest:', emailError);
            // We catch the error here to prevent it from breaking the entire operation
            return { ok: false };
          });

          allPromises.push(emailPromise);
        } catch (emailError) {
          console.error('Error preparing invitation email to primary guest:', emailError);
          // Don't block the flow for email preparation failure
        }
      }

      // Add additional guests
      for (let i = 0; i < additionalGuests.length; i++) {
        const guest = additionalGuests[i];
        const guestData = {
          userId: auth.currentUser?.uid,
          name: `${guest.firstName} ${guest.lastName}`.trim(),
          email: guest.email,
          events: everyoneParticipatesSame ? selectedEvents : (additionalGuestEvents[i] || []),
          foodPreference: guest.foodPreference,
          mobileNumber: guest.contactNumber,
          createdAt: new Date().toISOString(),
          source: "group"
        };

        // Create a promise for adding this guest
        const guestAddPromise = addDoc(collection(db, "guests"), guestData)
          .then(docRef => {
            addedGuests.push({
              ...guestData,
              id: docRef.id
            } as Guest);
            return docRef;
          });

        allPromises.push(guestAddPromise);

        // Send invitation email if email is provided
        if (guest.email) {
          try {
            // Generate invite link
            const guestEvents = everyoneParticipatesSame ?
              selectedEvents :
              (additionalGuestEvents[i] || []);
            const event = guestEvents[0] || "Wedding";
            const inviteCode = await generateInviteCode();

            const emailData = {
              guestName: `${guest.firstName} ${guest.lastName}`.trim(),
              email: guest.email,
              events: guestEvents,
              weddingDate: "January 15, 2025", // You should customize this or fetch from settings
              weddingLocation: "The Grand Ballroom, Mumbai", // You should customize this or fetch from settings 
              coupleName: "Rahul & Priya", // You should customize this or fetch from settings
              inviteLink: `${window.location.origin}/guest-list/add?invite=${inviteCode}`
            };

            const emailPromise = fetch('/api/send-invitation', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(emailData),
            }).catch(emailError => {
              console.error(`Error sending invitation email to additional guest ${i + 1}:`, emailError);
              // We catch the error here to prevent it from breaking the entire operation
              return { ok: false };
            });

            allPromises.push(emailPromise);
          } catch (emailError) {
            console.error(`Error preparing invitation email to additional guest ${i + 1}:`, emailError);
            // Don't block the flow for email preparation failure
          }
        }
      }

      // Wait for all operations to complete
      await Promise.all(allPromises);

      // Update the guest list locally
      setGuests(prev => [...addedGuests, ...prev]);

      toast.success(`Successfully added ${additionalGuests.length + 1} guests`);
      handleReset();
      onClose();
    } catch (error) {
      console.error("Error adding guests:", error);
      toast.error("Failed to add guests");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col bg-white rounded-lg max-h-[90vh] overflow-y-auto">
      <header className="flex justify-between items-center sticky top-0 bg-white z-10 mb-6 p-6">
        <h1 className="text-2xl font-semibold text-[#252525]">Add Group of Guests</h1>
        <button
          className="flex items-center justify-center h-6 w-6 rounded-[4px] bg-red-600 hover:bg-red-700 text-white transition-colors"
          onClick={isSubmitting ? undefined : onClose}
          aria-label="Close dialog"
          disabled={isSubmitting}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      <div className="flex flex-col px-6">
        {/* Primary Guest Info */}
        <div className="">
          <div className="flex gap-5 mb-6">
            <div className="flex-1">
              <label className="block mb-2 text-[14px] font-medium text-[#252525]" htmlFor="primary-first-name">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="primary-first-name"
                type="text"
                placeholder="Enter First Name"
                className="px-[14px] w-full h-12 text-[14px] bg-white rounded-[8px] border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:text-gray-500"
                value={primaryGuest.firstName}
                onChange={(e) => handlePrimaryGuestChange("firstName", e.target.value)}
                aria-label="First name"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-[14px] font-medium text-[#252525]" htmlFor="primary-last-name">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="primary-last-name"
                type="text"
                placeholder="Enter Last Name"
                className="px-[14px] w-full h-12 text-[14px] bg-white rounded-[8px] border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:text-gray-500"
                value={primaryGuest.lastName}
                onChange={(e) => handlePrimaryGuestChange("lastName", e.target.value)}
                aria-label="Last name"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-[14px] font-medium text-[#252525]" htmlFor="primary-email">Email Address</label>
            <input
              id="primary-email"
              type="email"
              placeholder="Enter Email Address"
              className="px-[14px] w-full h-12 text-[14px] bg-white rounded-[8px] border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:text-gray-500"
              value={primaryGuest.email}
              onChange={(e) => handlePrimaryGuestChange("email", e.target.value)}
              aria-label="Email address"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-[14px] font-medium text-[#252525]">Choice of Food</label>
            <div className="flex gap-3">
              <button
                className={`flex-1 h-12 text-[14px] font-medium rounded-[8px] border cursor-pointer flex items-center justify-center gap-2 transition-colors ${primaryGuest.foodPreference === "Veg"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-neutral-100 border-neutral-200 text-neutral-900 hover:bg-neutral-200"
                  }`}
                onClick={() => handlePrimaryGuestChange("foodPreference", "Veg")}
                type="button"
              >
                {primaryGuest.foodPreference === "Veg" && <span className="h-2 w-2 rounded-full bg-green-500"></span>}
                Veg
              </button>
              <button
                className={`flex-1 h-12 text-[14px] font-medium rounded-[8px] border cursor-pointer flex items-center justify-center gap-2 transition-colors ${primaryGuest.foodPreference === "Non Veg"
                  ? "bg-orange-50 border-orange-200 text-orange-700"
                  : "bg-neutral-100 border-neutral-200 text-neutral-900 hover:bg-neutral-200"
                  }`}
                onClick={() => handlePrimaryGuestChange("foodPreference", "Non Veg")}
                type="button"
              >
                {primaryGuest.foodPreference === "Non Veg" && <span className="h-2 w-2 rounded-full bg-orange-500"></span>}
                Non Veg
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-[14px] font-medium text-[#252525]" htmlFor="primary-contact-number">WhatsApp/Contact Number <span className="text-red-500">*</span></label>
            <input
              id="primary-contact-number"
              type="text"
              placeholder="Enter Contact Number"
              className="px-[14px] w-full h-12 text-[14px] bg-white rounded-[8px] border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:text-gray-500"
              value={primaryGuest.contactNumber}
              onChange={(e) => handlePrimaryGuestChange("contactNumber", e.target.value)}
              aria-label="Contact number"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Add primary guest events selection */}
          <div className="mb-6">
            <label className="block mb-2 text-[14px] font-medium text-[#252525]" htmlFor="primary-select-event">
              Select Event <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-[7px] flex-wrap">
              {["Haldi", "Sangeet", "Engagement"].map((event) => (
                <button
                  key={event}
                  className={`h-[42px] px-4 text-[14px] leading-[18px] font-medium rounded-[8px] border-0 cursor-pointer flex items-center justify-center gap-2 transition-colors ${isEventSelected(event as EventType)
                    ? event === "Haldi"
                      ? "bg-[#FFFBE8] text-[#677500]"
                      : event === "Sangeet"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-green-50 text-green-700"
                    : "bg-gray-50 text-gray-700"
                    } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  onClick={() => !isSubmitting && handleEventSelection(event as EventType)}
                  type="button"
                  aria-pressed={isEventSelected(event as EventType)}
                  disabled={isSubmitting}
                >
                  <span className={`h-2 w-2 rounded-full ${event === "Haldi" ? "bg-[#677500]" :
                    event === "Sangeet" ? "bg-blue-700" : "bg-green-700"
                    }`} aria-hidden="true"></span>
                  {event}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-neutral-200 w-full my-6"></div>

          {/* Everyone Participate Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-[14px] font-medium text-[#252525]" htmlFor="everyone-participates-same">
              Everyone Participate Same Events
            </label>
            <Switch
              id="everyone-participates-same"
              checked={everyoneParticipatesSame}
              onCheckedChange={(checked) => !isSubmitting && setEveryoneParticipatesSame(checked)}
              className={`${everyoneParticipatesSame ? "bg-[#FF33A0]" : "bg-neutral-200"} ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            />
          </div>

          <div className="h-px bg-neutral-200 w-full my-6"></div>
        </div>

        <div className="h-px bg-neutral-200 w-full my-6"></div>

        {additionalGuests.length > 0 && (
          <div className="space-y-8 mb-8">
            {additionalGuests.map((guest, index) => (
              <div key={index} className="bg-white  rounded-[8px] p-6 relative">
                <button
                  onClick={() => removeGuest(index)}
                  className="absolute left-6 top-6 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-red-600 hover:text-red-700 transition-colors"
                  aria-label="Remove guest"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="flex flex-col ml-[48px]">
                  <div className="flex gap-5 mb-6">
                    <div className="flex-1">
                      <label className="block mb-2 text-[14px] font-medium text-[#252525]" htmlFor={`additional-first-name-${index}`}>
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`additional-first-name-${index}`}
                        type="text"
                        placeholder="Enter First Name"
                        className="px-[14px] w-full h-12 text-[14px] bg-white rounded-[8px] border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:text-gray-500"
                        value={guest.firstName}
                        onChange={(e) => handleAdditionalGuestChange(index, "firstName", e.target.value)}
                        aria-label="First name"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block mb-2 text-[14px] font-medium text-[#252525]" htmlFor={`additional-last-name-${index}`}>
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`additional-last-name-${index}`}
                        type="text"
                        placeholder="Enter Last Name"
                        className="px-[14px] w-full h-12 text-[14px] bg-white rounded-[8px] border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:text-gray-500"
                        value={guest.lastName}
                        onChange={(e) => handleAdditionalGuestChange(index, "lastName", e.target.value)}
                        aria-label="Last name"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-[14px] font-medium text-[#252525]" htmlFor={`additional-email-${index}`}>Email Address</label>
                    <input
                      id={`additional-email-${index}`}
                      type="email"
                      placeholder="Enter Email Address"
                      className="px-[14px] w-full h-12 text-[14px] bg-white rounded-[8px] border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:text-gray-500"
                      value={guest.email}
                      onChange={(e) => handleAdditionalGuestChange(index, "email", e.target.value)}
                      aria-label="Email address"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-[14px] font-medium text-[#252525]">Choice of Food</label>
                    <div className="flex gap-3">
                      <button
                        className={`flex-1 h-12 text-[14px] font-medium rounded-[8px] border cursor-pointer flex items-center justify-center gap-2 transition-colors ${guest.foodPreference === "Veg"
                          ? "bg-green-50 border-green-200 text-green-700"
                          : "bg-neutral-100 border-neutral-200 text-neutral-900 hover:bg-neutral-200"
                          } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        onClick={() => !isSubmitting && handleAdditionalGuestChange(index, "foodPreference", "Veg")}
                        type="button"
                        disabled={isSubmitting}
                      >
                        {guest.foodPreference === "Veg" && <span className="h-2 w-2 rounded-full bg-green-500"></span>}
                        Veg
                      </button>
                      <button
                        className={`flex-1 h-12 text-[14px] font-medium rounded-[8px] border cursor-pointer flex items-center justify-center gap-2 transition-colors ${guest.foodPreference === "Non Veg"
                          ? "bg-orange-50 border-orange-200 text-orange-700"
                          : "bg-neutral-100 border-neutral-200 text-neutral-900 hover:bg-neutral-200"
                          } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        onClick={() => !isSubmitting && handleAdditionalGuestChange(index, "foodPreference", "Non Veg")}
                        type="button"
                        disabled={isSubmitting}
                      >
                        {guest.foodPreference === "Non Veg" && <span className="h-2 w-2 rounded-full bg-orange-500"></span>}
                        Non Veg
                      </button>
                    </div>
                  </div>

                  {!everyoneParticipatesSame && (
                    <div className="mb-6">
                      <label className="block mb-2 text-[14px] font-medium text-[#252525]" htmlFor={`additional-select-event-${index}`}>
                        Select Event <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-[7px] flex-wrap">
                        {["Haldi", "Sangeet", "Engagement"].map((event) => (
                          <button
                            key={`${index}-${event}`}
                            className={`h-[42px] px-4 text-[14px] leading-[18px] font-medium rounded-[8px] border-0 cursor-pointer flex items-center justify-center gap-2 transition-colors ${isAdditionalGuestEventSelected(index, event as EventType)
                              ? event === "Haldi"
                                ? "bg-[#FFFBE8] text-[#677500]"
                                : event === "Sangeet"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-green-50 text-green-700"
                              : "bg-gray-50 text-gray-700"
                              } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            onClick={() => !isSubmitting && handleAdditionalGuestEventSelection(index, event as EventType)}
                            type="button"
                            aria-pressed={isAdditionalGuestEventSelected(index, event as EventType)}
                            disabled={isSubmitting}
                          >
                            <span className={`h-2 w-2 rounded-full ${event === "Haldi" ? "bg-[#677500]" :
                              event === "Sangeet" ? "bg-blue-700" : "bg-green-700"
                              }`} aria-hidden="true"></span>
                            {event}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[14px] font-medium text-[#252525]" htmlFor={`additional-contact-number-${index}`}>
                      WhatsApp/Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`additional-contact-number-${index}`}
                      type="text"
                      placeholder="Enter Contact Number"
                      className="px-[14px] w-full h-12 text-[14px] bg-white rounded-[8px] border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:text-gray-500"
                      value={guest.contactNumber}
                      onChange={(e) => handleAdditionalGuestChange(index, "contactNumber", e.target.value)}
                      aria-label="Contact number"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}




        <button
          onClick={addGuest}
          className={`flex items-center justify-start gap-2 text-[16px] font-medium text-[#252525] transition-colors mb-12 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-700'}`}
          type="button"
          disabled={isSubmitting}
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add a guest to this group</span>
        </button>

        {/* Bottom Buttons */}
        <div className="flex gap-3 justify-end pb-4">
          <button
            className={`text-[14px] font-semibold rounded-[8px] bg-[#F6F6F6] border-0 h-[52px] text-[#252525] w-[120px] transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
            onClick={handleReset}
            type="button"
            disabled={isSubmitting}
          >
            Reset
          </button>
          <button
            className={`text-[14px] font-semibold text-white bg-[#FF33A0] rounded-[8px] h-[52px] w-[120px] transition-colors border-0 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#e62e90]'}`}
            onClick={handleSubmit}
            type="button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                Adding...
              </div>
            ) : (
              "Add Guest"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

type FilterType = "All" | "Haldi" | "Sangeet" | "Engagement";

const GuestList: React.FC = () => {
  const [activeView, setActiveView] = useState<"individual" | "table">("individual")
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false)
  const [isAddGuestFormOpen, setIsAddGuestFormOpen] = useState(false)
  const [isAddGroupFormOpen, setIsAddGroupFormOpen] = useState(false)

  // State for tracking selected guests and confirmation dialog
  const [selectedGuests, setSelectedGuests] = useState<Set<string>>(new Set())
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Tables management state
  const [tables, setTables] = useState<TableAssignment[]>([])
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [isSavingTables, setIsSavingTables] = useState(false)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [guests, setGuests] = useState<Guest[]>([])
  const [shareableLink, setShareableLink] = useState<string>('')
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);

  const filterOptions: FilterType[] = ["All", "Haldi", "Sangeet", "Engagement"];

  // Define pagination utils here before it's used
  const paginationUtils = useMemo(() => {
    // Filter guests based on search query and selected filter
    let filteredGuests = guests

    if (debouncedSearchQuery) {
      filteredGuests = filteredGuests.filter(guest => {
        const lowerCaseQuery = debouncedSearchQuery.toLowerCase();
        return (
          guest.name.toLowerCase().includes(lowerCaseQuery) ||
          (guest.email && guest.email.toLowerCase().includes(lowerCaseQuery)) ||
          (guest.mobileNumber && guest.mobileNumber.includes(debouncedSearchQuery)) ||
          guest.events.some(event => event.toLowerCase().includes(lowerCaseQuery)) ||
          guest.foodPreference.toLowerCase().includes(lowerCaseQuery)
        );
      });
    }

    if (selectedFilter !== "All") {
      filteredGuests = filteredGuests.filter(guest => guest.events.includes(selectedFilter));
    }

    const startIndex = pageIndex * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredGuests.length);
    const currentPageItems = filteredGuests.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredGuests.length / pageSize);

    return {
      filteredGuests,
      startIndex,
      endIndex,
      currentPageItems,
      totalPages,
      canPreviousPage: pageIndex > 0,
      canNextPage: pageIndex < totalPages - 1,
    };
  }, [guests, debouncedSearchQuery, selectedFilter, pageIndex, pageSize]);

  // Computed properties for checkbox state
  const pageItems = paginationUtils?.currentPageItems || []
  const pageItemIds = useMemo(() => new Set(pageItems.map(guest => guest.id)), [pageItems])

  const allCurrentPageSelected = useMemo(() =>
    pageItems.length > 0 &&
    pageItems.every(guest => selectedGuests.has(guest.id)),
    [selectedGuests, pageItems])

  const someCurrentPageSelected = useMemo(() =>
    !allCurrentPageSelected &&
    pageItems.some(guest => selectedGuests.has(guest.id)),
    [selectedGuests, pageItems, allCurrentPageSelected])

  // Toggle single guest selection
  const toggleGuestSelection = (guestId: string) => {
    setSelectedGuests(prev => {
      const newSet = new Set(prev)
      if (newSet.has(guestId)) {
        newSet.delete(guestId)
      } else {
        newSet.add(guestId)
      }
      return newSet
    })
  }

  // Toggle selection of all guests on current page
  const toggleAllCurrentPage = () => {
    setSelectedGuests(prev => {
      const newSet = new Set(prev)

      // If all are selected, unselect them all
      if (allCurrentPageSelected) {
        pageItems.forEach(guest => {
          newSet.delete(guest.id)
        })
      }
      // Otherwise, select all on current page
      else {
        pageItems.forEach(guest => {
          newSet.add(guest.id)
        })
      }

      return newSet
    })
  }
  const clearSelections = () => {
    setSelectedGuests(new Set())
  }

  const deleteSelectedGuests = async () => {
    setIsDeleting(true)

    try {
      const guestIdsToDelete = Array.from(selectedGuests)


      const isMockData = guests.some(g => g.id.startsWith("mock"))


      if (!isMockData && auth.currentUser) {
        const deletePromises = guestIdsToDelete.map(async (id) => {
          await deleteDoc(doc(db, "guests", id))
          return id
        })

        await Promise.all(deletePromises)
      }


      setGuests(prevGuests => prevGuests.filter(guest => !selectedGuests.has(guest.id)))


      setSelectedGuests(new Set())
      setIsDeleteDialogOpen(false)

      toast.success(`${selectedGuests.size} guest${selectedGuests.size > 1 ? 's' : ''} deleted successfully`)
    } catch (error) {
      console.error("Error deleting guests:", error)
      toast.error("Failed to delete guests")
    } finally {
      setIsDeleting(false)
    }
  }

  const openAddGuestModal = () => {
    setIsAddGuestModalOpen(true)
    setShareableLink("") 
  }

  const closeAddGuestModal = () => {
    setIsAddGuestModalOpen(false)
  }

  const copyLink = useCallback(() => {
    if (!shareableLink) return
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        toast.success("Link copied to clipboard!")
      })
      .catch(() => {
        toast.error("Could not copy link.")
      })
  }, [shareableLink])

  const generateShareableLink = async (event: EventType) => {
    try {
      setIsGeneratingLink(true);
      setSelectedEvent(event);

      if (!auth.currentUser?.uid) {
        console.error("Cannot generate link: User not authenticated");
        throw new Error("User not authenticated");
      }

      console.log(`Generating invite link for event: ${event}, userId: ${auth.currentUser.uid}`);
      const code = await createInviteLink(event, auth.currentUser.uid);
      console.log(`Generated invite code: ${code}`);

      const inviteLink = `${window.location.origin}/guest-list/add?invite=${code}`;
      console.log(`Full invite link: ${inviteLink}`);

      setShareableLink(inviteLink);
      toast.success("Link generated successfully!");
    } catch (error) {
      console.error("Error generating link:", error);
      toast.error("Failed to generate link");
    } finally {
      setIsGeneratingLink(false);
      setSelectedEvent(null);
    }
  };

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        setIsLoading(true);
        const guestsRef = collection(db, "guests")
        const q = query(
          guestsRef,
          where("userId", "==", auth.currentUser?.uid),
          orderBy("createdAt", "desc")
        )
        const querySnapshot = await getDocs(q)

        const guestList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Guest[]

        if (guestList.length === 0) {
          console.log("No guests found in database, using mock data")
          setGuests(guestData)
        } else {
          setGuests(guestList)
        }
      } catch (error) {
        console.error("Error fetching guests:", error)
        toast.error("Failed to load guests")
        setGuests(guestData)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchTables = async () => {
      try {
        setIsTableLoading(true);
        
        if (!auth.currentUser) {
          // Use mock tables for demo
          const mockTables: TableAssignment[] = [
            {
              id: "table_mock_1",
              userId: "mockUserId",
              name: "Table 1",
              capacity: 8,
              guests: [],
              createdAt: new Date().toISOString()
            },
            {
              id: "table_mock_2",
              userId: "mockUserId",
              name: "Table 2",
              capacity: 8,
              guests: [],
              createdAt: new Date().toISOString()
            },
            {
              id: "table_mock_3",
              userId: "mockUserId",
              name: "Table 3",
              capacity: 8,
              guests: [],
              createdAt: new Date().toISOString()
            }
          ];
          setTables(mockTables);
          return;
        }
        
        const tablesRef = collection(db, "tables");
        const q = query(
          tablesRef,
          where("userId", "==", auth.currentUser.uid),
          orderBy("createdAt", "asc")
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          // Create default tables if none exist
          const defaultTables: TableAssignment[] = [
            {
              id: `table_${Date.now()}_1`,
              userId: auth.currentUser.uid,
              name: "Table 1",
              capacity: 8,
              guests: [],
              createdAt: new Date().toISOString()
            },
            {
              id: `table_${Date.now()}_2`,
              userId: auth.currentUser.uid,
              name: "Table 2",
              capacity: 8,
              guests: [],
              createdAt: new Date().toISOString()
            }
          ];
          
          // Add tables to Firestore
          const batch = writeBatch(db);
          defaultTables.forEach(table => {
            const tableRef = doc(db, "tables", table.id);
            batch.set(tableRef, table);
          });
          
          await batch.commit();
          setTables(defaultTables);
        } else {
          // Load tables from Firestore
          const tablesList = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            guests: [] // We'll populate guests later
          })) as unknown as TableAssignment[];
          
          setTables(tablesList);
        }
      } catch (error) {
        console.error("Error fetching tables:", error);
        toast.error("Failed to load tables");
        
        // Set default mock tables
        const mockTables: TableAssignment[] = [
          {
            id: "table_mock_1",
            userId: "mockUserId",
            name: "Table 1",
            capacity: 8,
            guests: [],
            createdAt: new Date().toISOString()
          },
          {
            id: "table_mock_2",
            userId: "mockUserId",
            name: "Table 2",
            capacity: 8,
            guests: [],
            createdAt: new Date().toISOString()
          }
        ];
        setTables(mockTables);
      } finally {
        setIsTableLoading(false);
      }
    };

    const loadData = async () => {
      await fetchGuests();
      await fetchTables();
    };
    
    loadData();
  }, [auth.currentUser]);
  
  // Synchronize guests with tables whenever either changes
  useEffect(() => {
    if (isLoading || isTableLoading) return;
    
    // Populate tables with their assigned guests
    const updatedTables = tables.map(table => {
      const tableGuests = guests.filter(guest => guest.tableId === table.id);
      return { ...table, guests: tableGuests };
    });
    
    setTables(updatedTables);
  }, [guests, isLoading, isTableLoading]);

  // Handle guest assignment to tables
  const handleAssignGuest = async (guestId: string, tableId: string | undefined) => {
    // Find the guest
    const guestToAssign = guests.find(g => g.id === guestId);
    if (!guestToAssign) return;
    
    // If the guest is already assigned to a table, remove them from that table
    if (guestToAssign.tableId) {
      const oldTable = tables.find(t => t.id === guestToAssign.tableId);
      if (oldTable) {
        setTables(prev => prev.map(t => 
          t.id === oldTable.id 
            ? { ...t, guests: t.guests.filter(g => g.id !== guestId) } 
            : t
        ));
      }
    }
    
    // If tableId is undefined, we're just removing from the current table
    if (tableId === undefined) {
      setGuests(prev => prev.map(g => 
        g.id === guestId ? { ...g, tableId: undefined } : g
      ));
      return;
    }
    
    // Assign to the new table
    const targetTable = tables.find(t => t.id === tableId);
    if (!targetTable) return;
    
    // Check if the table is full
    if (targetTable.guests.length >= targetTable.capacity) {
      toast.error(`Table ${targetTable.name} is full`);
      return;
    }
    
    // Update the guests state
    setGuests(prev => prev.map(g => 
      g.id === guestId ? { ...g, tableId } : g
    ));
    
    // If not using mock data, update in Firestore
    if (!guestToAssign.id.startsWith("mock") && auth.currentUser) {
      try {
        await updateDoc(doc(db, "guests", guestId), {
          tableId
        });
      } catch (error) {
        console.error("Error updating guest table assignment:", error);
        toast.error("Failed to update table assignment");
      }
    }
  };
  
  // Create a new table
  const handleCreateTable = async (tableName: string) => {
    const newTable: TableAssignment = {
      id: `table_${Date.now()}`,
      userId: auth.currentUser?.uid || "mockUserId",
      name: tableName,
      capacity: 8, // Fixed capacity as per requirements
      guests: [],
      createdAt: new Date().toISOString()
    };
    
    setTables(prev => [...prev, newTable]);
    
    // If not using mock data, save to Firestore
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "tables", newTable.id), newTable);
        toast.success(`Table "${tableName}" created successfully`);
      } catch (error) {
        console.error("Error creating table:", error);
        toast.error("Failed to create table");
      }
    } else {
      toast.success(`Table "${tableName}" created successfully`);
    }
  };
  
  // Delete a table
  const handleDeleteTable = async (tableId: string) => {
    // Find the table to delete
    const tableToDelete = tables.find(t => t.id === tableId);
    if (!tableToDelete) return;
    
    // Confirm deletion if there are guests assigned
    if (tableToDelete.guests.length > 0) {
      if (!window.confirm(`Are you sure you want to delete table "${tableToDelete.name}"? All ${tableToDelete.guests.length} guests will be unassigned.`)) {
        return;
      }
    }
    
    // Unassign all guests from this table
    const guestsToUpdate = tableToDelete.guests.map(g => g.id);
    
    // Update guests state
    setGuests(prev => prev.map(g => 
      guestsToUpdate.includes(g.id) ? { ...g, tableId: undefined } : g
    ));
    
    // Remove the table
    setTables(prev => prev.filter(t => t.id !== tableId));
    
    // If not using mock data, delete from Firestore
    if (!tableId.startsWith("table_mock") && auth.currentUser) {
      try {
        // Delete the table document
        await deleteDoc(doc(db, "tables", tableId));
        
        // Update all guests that were assigned to this table
        const batch = writeBatch(db);
        guestsToUpdate.forEach(guestId => {
          if (!guestId.startsWith("mock")) {
            const guestRef = doc(db, "guests", guestId);
            batch.update(guestRef, { tableId: null });
          }
        });
        
        await batch.commit();
        
        toast.success(`Table "${tableToDelete.name}" deleted successfully`);
      } catch (error) {
        console.error("Error deleting table:", error);
        toast.error("Failed to delete table");
      }
    } else {
      toast.success(`Table "${tableToDelete.name}" deleted successfully`);
    }
  };
  
  // Auto-generate seating plan
  const handleAutoGenerateSeating = () => {
    // Group guests by event and food preference for better matching
    const guestGroups: Record<string, Guest[]> = {};
    
    // Reset all table assignments first
    const resetGuests = guests.map(g => ({ ...g, tableId: undefined }));
    
    // Group guests by events
    resetGuests.forEach(guest => {
      const key = `${guest.events.sort().join("_")}_${guest.foodPreference}`;
      if (!guestGroups[key]) {
        guestGroups[key] = [];
      }
      guestGroups[key].push(guest);
    });
    
    // Create new tables based on these groups
    const newTables: TableAssignment[] = [];
    let tableCounter = 1;
    
    Object.entries(guestGroups).forEach(([groupKey, groupGuests]) => {
      // Create tables of 8 guests each for this group
      for (let i = 0; i < groupGuests.length; i += 8) {
        const tableGuests = groupGuests.slice(i, i + 8);
        const tableName = `Table ${tableCounter++}`;
        const tableId = `table_auto_${Date.now()}_${newTables.length}`;
        
        // Add table assignments to guests
        tableGuests.forEach(guest => {
          guest.tableId = tableId;
        });
        
        newTables.push({
          id: tableId,
          userId: auth.currentUser?.uid || "mockUserId",
          name: tableName,
          capacity: 8,
          guests: tableGuests,
          createdAt: new Date().toISOString()
        });
      }
    });
    
    // Update states
    setTables(newTables);
    setGuests(resetGuests.map(g => {
      const tableWithGuest = newTables.find(t => 
        t.guests.some(tg => tg.id === g.id)
      );
      return { ...g, tableId: tableWithGuest?.id };
    }));
    
    toast.success(`Auto-generated ${newTables.length} tables`);
  };

  const VIEW_ICONS = {
    individual: {
      active: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743310202/User_Rounded_hsrf2b.png",
      inactive: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743967650/Vector_ivm2gu.png"
    },
    table: {
      active: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743966471/Vector_hrrrwk.png",
      inactive: "https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743310366/marrygold/Vector_xlqand.png"
    }
  };

  function highlightMatch(text: string, query: string) {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} className="bg-yellow-100 text-gray-900">{part}</mark>
        : part
    )
  }

  useEffect(() => {
    if (debouncedSearchQuery) {
      console.log('Search performed:', {
        query: debouncedSearchQuery,
        results: paginationUtils.filteredGuests.length,
        timestamp: new Date()
      })
    }
  }, [debouncedSearchQuery, paginationUtils.filteredGuests.length])

  const previousPage = useCallback(() => {
    setPageIndex(old => Math.max(0, old - 1))
  }, [])

  const nextPage = useCallback(() => {
    setPageIndex(old => Math.min(old + 1, paginationUtils.totalPages - 1))
  }, [paginationUtils.totalPages])

  const firstPage = useCallback(() => {
    setPageIndex(0)
  }, [])

  const lastPage = useCallback(() => {
    setPageIndex(paginationUtils.totalPages - 1)
  }, [paginationUtils.totalPages])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-4 sm:px-8 md:px-[4.625em] py-4 md:py-6 border-b relative">
        <div className="text-[#252525] text-[16px] md:text-[19px] font-bold tracking-[0.15em] uppercase font-jakarta">LOGO</div>

        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
          >
            <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <Image
              src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743277061/marrygold/d2efa043c01668221a1799a874d19aca051d5e7c_akkred.svg"
              className="w-4 md:w-5 h-4 md:h-5"
              alt="Ceremony list icon"
              width={20}
              height={20}
            />
            <span className="text-[#252525] text-xs md:text-sm font-medium">Ceremony List</span>
          </div>
          <div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <Image
              src="https://cdn.builder.io/api/v1/image/assets/9ea454d764f547dcb1c52d84320094c5/899c24019f6b0ba80bc257c75303a5335bf84a13"
              className="w-4 md:w-5 h-4 md:h-5"
              alt="Share icon"
              width={20}
              height={20}
            />
            <span className="text-[#252525] text-xs md:text-sm font-medium">Share</span>
          </div>
          <div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <Image
              src="https://cdn.builder.io/api/v1/image/assets/9ea454d764f547dcb1c52d84320094c5/940ddd386bccfc2b10ffdd392e760c19d4b6fdd7"
              className="w-4 md:w-5 h-4 md:h-5"
              alt="Support icon"
              width={20}
              height={20}
            />
            <span className="text-[#252525] text-xs md:text-sm font-medium">Support</span>
          </div>
          <div className="ml-2 md:ml-4">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743256112/Avatar_kdd9nj.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[60px] left-0 right-0 bg-white shadow-lg z-40 
          border-t border-gray-200 transform transition-transform duration-200 ease-out">
          <div className="flex flex-col py-4">
            <a href="#" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50">
              <Image
                src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743277061/marrygold/d2efa043c01668221a1799a874d19aca051d5e7c_akkred.svg"
                className="w-5 h-5"
                alt="Ceremony list icon"
                width={20}
                height={20}
              />
              <span className="text-[#252525] text-sm font-medium">Ceremony List</span>
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets/9ea454d764f547dcb1c52d84320094c5/899c24019f6b0ba80bc257c75303a5335bf84a13"
                className="w-5 h-5"
                alt="Share icon"
                width={20}
                height={20}
              />
              <span className="text-[#252525] text-sm font-medium">Share</span>
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets/9ea454d764f547dcb1c52d84320094c5/940ddd386bccfc2b10ffdd392e760c19d4b6fdd7"
                className="w-5 h-5"
                alt="Support icon"
                width={20}
                height={20}
              />
              <span className="text-[#252525] text-sm font-medium">Support</span>
            </a>
          </div>
        </div>
      )}

      <main className="mx-auto px-4 sm:px-[4.625em] py-6 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4 md:gap-6 mt-[1.875rem]">
          <h1 className={`w-36 text-[1.5rem] font-bold text-[#252525] ${inter.className}`}>Guest List</h1>


          <div className="flex flex-col md:flex-row w-full md:items-center gap-4 md:gap-6">

            <div className="w-full md:max-w-[632px] flex">

              <div className="shrink-0">
                <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className={`inline-flex items-center rounded-l-md border border-gray-300 bg-white px-5 py-0 text-[0.875rem] font-medium text-gray-700 h-[52px] ${inter.className}`}
                    >
                      <Image
                        src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743307955/filter_unmuu0.png"
                        alt="Filter"
                        className="mr-[10px] w-4 h-4"
                        width={20}
                        height={20}
                      />
                      <span className="font-medium text-[0.875rem] mr-[37px]">{selectedFilter}</span>
                      <Image
                        src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743308018/down_ff8vb1.png"
                        alt="Down arrow"
                        className={`w-4 h-4 transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''}`}
                        width={20}
                        height={20}
                      />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search filter..." className="h-9" />
                      <CommandEmpty>No filter found.</CommandEmpty>
                      <CommandGroup>
                        {filterOptions.map((option) => (
                          <CommandItem
                            key={option}
                            onSelect={() => {
                              setSelectedFilter(option);
                              setFilterOpen(false);
                            }}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedFilter === option ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {option}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Search input */}
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 inset-y-0 flex items-center">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    name="search"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`block w-full rounded-r-md border border-l-0 border-gray-300 py-0 pl-9 pr-4 text-gray-900 
                      placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500 
                      h-[52px] text-[0.875rem] ${inter.className}`}
                    placeholder="Search by name, email or phone"
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setSearchQuery('')
                      }
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-500"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="sr-only">Clear search</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto md:ml-auto flex gap-2">
              {selectedGuests.size > 0 && activeView === "individual" && (
                <Button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="inline-flex items-center justify-center px-3 py-0 h-[52px] 
                    text-[0.875rem] font-medium rounded-md shadow-sm text-white bg-red-600 
                    hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                    focus:ring-red-500 transition-colors"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  {selectedGuests.size === 1 ? 'Delete Guest' : `Delete ${selectedGuests.size} Guests`}
                </Button>
              )}
              <Button
                onClick={openAddGuestModal}
                className="inline-flex items-center justify-center px-3 py-0 h-[52px] 
                  text-[0.875rem] font-medium rounded-md shadow-sm text-white bg-[#FF33A0] 
                  hover:bg-[#e62e90] focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-pink-500 transition-colors"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add New Guest
              </Button>
            </div>
          </div>
        </div>

        <div className="flex mt-6 mb-8 gap-[10px]">
          <button
            onClick={() => setActiveView("individual")}
            className={`inline-flex items-center px-3 py-4 text-[14px] font-semibold rounded-[12px] ${activeView === "individual" ? "bg-gray-900 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              } ${inter.className}`}
          >
            <Image
              src={activeView === "individual" ? VIEW_ICONS.individual.active : VIEW_ICONS.individual.inactive}
              alt="Individual icon"
              className="w-5 h-5 mr-2 object-contain"
              width={20}
              height={20}
            />
            <span>Individual</span>
          </button>
          <button
            onClick={() => setActiveView("table")}
            className={`inline-flex items-center px-3 py-4 text-[14px] font-semibold rounded-[12px] ${activeView === "table" ? "bg-gray-900 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              } ${inter.className}`}
          >
            <Image
              src={activeView === "table" ? VIEW_ICONS.table.active : VIEW_ICONS.table.inactive}
              alt="Table icon"
              className="w-5 h-5 mr-2"
              width={20}
              height={20}
            />
            <span>Table Wise</span>
          </button>
        </div>

        {/* Table Wise View */}
        {activeView === "table" ? (
          isTableLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          ) : (
            <TableWiseView 
              guests={guests}
              selectedFilter={selectedFilter}
              onAssignGuest={handleAssignGuest}
              onCreateTable={handleCreateTable}
              onDeleteTable={handleDeleteTable}
              onAutoGenerate={handleAutoGenerateSeating}
              tables={tables}
            />
          )
        ) : (
          /* Individual View (Original table) */
          <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className={`w-10 py-3 px-4 text-xs font-medium text-[#252525] ${inter.className}`}>
                        <label className="sr-only" htmlFor="selectAll">Select all guests</label>
                        <input
                          id="selectAll"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 shadow-md focus:ring-2 focus:ring-indigo-500"
                          checked={allCurrentPageSelected}
                          ref={input => {
                            if (input) {
                              input.indeterminate = someCurrentPageSelected
                            }
                          }}
                          onChange={toggleAllCurrentPage}
                          aria-label="Select all guests"
                        />
                      </TableHead>
                      <TableHead className={`flex items-center gap-1 py-3 px-4 text-xs font-medium text-[#252525] uppercase tracking-wider text-left ${inter.className}`}>
                        #{" "}
                        <Image
                          src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1743310626/marrygold/column-sorting_rz0xzo.png"
                          alt=""
                          className="w-4 h-4"
                          width={20}
                          height={20}
                        />
                      </TableHead>
                      <TableHead className={`py-3 px-4 text-xs font-medium text-[#252525] uppercase tracking-wider text-left ${inter.className}`}>
                        Guest Name
                      </TableHead>
                      <TableHead className={`py-3 px-4 text-xs font-medium text-[#252525] uppercase tracking-wider text-left ${inter.className}`}>
                        <div className="flex items-center gap-1">
                          Event Tags
                          <Info className="h-4 w-4 text-gray-400" />
                        </div>
                      </TableHead>
                      <TableHead className={`py-3 px-4 text-xs font-medium text-[#252525] uppercase tracking-wider text-left ${inter.className}`}>
                        Choice of Food
                      </TableHead>
                      <TableHead className={`py-3 px-4 text-xs font-medium text-[#252525] uppercase tracking-wider text-right ${inter.className}`}>
                        Mobile Number
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <div className="flex justify-center items-center">
                            <span className="loading loading-spinner loading-md"></span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : paginationUtils.currentPageItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-sm text-gray-500">
                          No guests found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginationUtils.currentPageItems.map((guest, index) => (
                        <TableRow key={guest.id} className={`hover:bg-gray-50 ${selectedGuests.has(guest.id) ? 'bg-gray-50' : ''}`}>
                          <TableCell className="px-4 py-4">
                            <input
                              title="Select"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                              checked={selectedGuests.has(guest.id)}
                              onChange={() => toggleGuestSelection(guest.id)}
                            />
                          </TableCell>
                          <TableCell className={`px-4 py-4 text-[0.875rem] font-normal text-[#252525] ${inter.className}`}>
                            {paginationUtils.startIndex + index + 1}
                          </TableCell>
                          <TableCell className="px-4 py-4">
                            <div className={`text-[0.875rem] font-normal text-[#252525] ${inter.className}`}>{highlightMatch(guest.name, searchQuery)}</div>
                          </TableCell>
                          <TableCell className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              {guest.events.map((event, index) => (
                                <span key={index}
                                  className={`inline-flex items-center rounded-[0.5rem] px-[1.25rem] py-[0.875rem] text-[0.875rem] 
                                  ${event === "Haldi" ? "bg-[#FFFBE8] text-[#677500]" : ""}
                                  ${event === "Sangeet" ? "bg-blue-50 text-blue-700" : ""}
                                  ${event === "Engagement" ? "bg-green-50 text-green-700" : ""}
                                  ${inter.className}`}>
                                  <span className={`h-2 w-2 rounded-full mr-[0.375rem]
                                      ${event === "Haldi" ? "bg-[#677500]" : ""}
                                      ${event === "Sangeet" ? "bg-blue-700" : ""}
                                    `}></span>
                                  {highlightMatch(event, searchQuery)}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-4">
                            <span className={`inline-flex items-center rounded-[0.5rem] px-[1.25rem] py-[0.875rem] text-[0.875rem]
                              ${guest.foodPreference === "Veg" ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"}
                              ${inter.className}`}>
                              <span className={`h-2 w-2 rounded-full mr-[0.375rem]
                                  ${guest.foodPreference === "Veg" ? "bg-green-700" : "bg-orange-700"}
                                `}></span>
                              {highlightMatch(guest.foodPreference, searchQuery)}
                            </span>
                          </TableCell>
                          <TableCell className={`px-4 py-4 text-[0.875rem] font-normal text-[#252525] text-right ${inter.className}`}>{highlightMatch(guest.mobileNumber, searchQuery)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
              <div>
                <p className="text-sm text-gray-700">
                  {`${Math.min(paginationUtils.startIndex + 1, paginationUtils.filteredGuests.length)}-${paginationUtils.endIndex} of ${paginationUtils.filteredGuests.length}`}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">Rows per page:</span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(value) => {
                      const newSize = Number(value);
                      setPageSize(newSize);
                      const newMaxPage = Math.ceil(paginationUtils.filteredGuests.length / newSize) - 1;
                      setPageIndex(Math.min(pageIndex, Math.max(0, newMaxPage)));
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue>{pageSize}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 20, 30, 40, 50].map((size) => (
                        <SelectItem key={size} value={String(size)}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 hover:bg-gray-50"
                    onClick={firstPage}
                    disabled={!paginationUtils.canPreviousPage}
                  >
                    <span className="sr-only">First page</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                      <path d="M12.5 15L7.5 10L12.5 5M7.5 15L2.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative inline-flex items-center px-2 py-2 text-gray-400 hover:bg-gray-50"
                    onClick={() => previousPage()}
                    disabled={!paginationUtils.canPreviousPage}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                      <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Button>
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
                    {pageIndex + 1} / {Math.max(1, paginationUtils.totalPages)}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative inline-flex items-center px-2 py-2 text-gray-400 hover:bg-gray-50"
                    onClick={() => nextPage()}
                    disabled={!paginationUtils.canNextPage}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                      <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 hover:bg-gray-50"
                    onClick={lastPage}
                    disabled={!paginationUtils.canNextPage}
                  >
                    <span className="sr-only">Last page</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
                      <path d="M7.5 5L12.5 10L7.5 15M12.5 5L17.5 10L12.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Delete Guest{selectedGuests.size > 1 ? 's' : ''}</DialogTitle>
          <div className="py-4">
            <p className="text-sm text-gray-700">
              Are you sure you want to delete {selectedGuests.size} guest{selectedGuests.size > 1 ? 's' : ''}?
              This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteSelectedGuests}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddGuestModalOpen} onOpenChange={(open) => !open && closeAddGuestModal()}>
        <DialogContent className="max-w-[600px] p-6 overflow-hidden border-none rounded-xl">
          <div className="flex flex-col w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <DialogTitle className="text-xl font-semibold text-[#252525]">Add Guest</DialogTitle>
              <button
                onClick={() => setIsAddGuestModalOpen(false)}
                className="flex items-center justify-center h-8 w-8 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>


            {shareableLink && shareableLink.startsWith("http") && (
              <div className="flex items-center gap-3 bg-pink-50 rounded-xl p-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    value={shareableLink}
                    readOnly
                    className="w-full h-12 px-4 text-sm bg-white rounded-lg border border-pink-200 text-neutral-600 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
                <button
                  onClick={copyLink}
                  className="h-12 px-6 text-sm font-medium bg-[#FF3B99] text-white rounded-lg hover:bg-[#FF3B99]/90 transition-colors flex items-center gap-2 whitespace-nowrap"
                  disabled={!shareableLink || !shareableLink.startsWith("http")}
                >
                  <Copy className="h-4 w-4" />
                  Copy Link
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 mb-6">
              {EVENTS.map((event) => (
                <button
                  key={event.name}
                  onClick={() => generateShareableLink(event.name)}
                  disabled={isGeneratingLink && selectedEvent === event.name}
                  className={`relative h-[60px] p-4 rounded-xl border border-neutral-200 hover:border-[#FF3B99] transition-colors flex items-center justify-between ${isGeneratingLink && selectedEvent === event.name ? 'opacity-50' : ''
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${event.name === "Haldi" ? "bg-yellow-50" : event.name === "Sangeet" ? "bg-blue-50" : "bg-green-50"} flex items-center justify-center`}>
                      <span className={`h-3 w-3 rounded-full ${event.name === "Haldi" ? "bg-yellow-500" : event.name === "Sangeet" ? "bg-blue-500" : "bg-green-500"}`}></span>
                    </div>
                    <span className="text-base font-medium text-[#252525]">Generate {event.name} Invite Link</span>
                  </div>
                  {isGeneratingLink && selectedEvent === event.name ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FF3B99]"></div>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4.16666 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setIsAddGuestModalOpen(false)
                  setIsAddGuestFormOpen(true)
                }}
                className="group relative h-[100px] p-6 rounded-2xl border border-neutral-200 hover:border-[#FF3B99] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-pink-50 flex items-center justify-center group-hover:bg-pink-100 transition-colors p-3">
                    <User className="h-8 w-8 text-[#FF3B99]" />
                  </div>
                  <span className="text-lg font-medium text-[#252525]">Individual Guest</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsAddGuestModalOpen(false)
                  setIsAddGroupFormOpen(true)
                }}
                className="group relative h-[100px] p-6 rounded-2xl border border-neutral-200 hover:border-[#FF3B99] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-pink-50 flex items-center justify-center group-hover:bg-pink-100 transition-colors p-3">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[#FF3B99]">
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H7C5.93913 15 4.92172 15.4214 4.17157 16.1716C3.42143 16.9217 3 17.9391 3 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 11C12.2091 11 14 9.20914 14 7C14 4.79086 12.2091 3 10 3C7.79086 3 6 4.79086 6 7C6 9.20914 7.79086 11 10 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 21V19C20.9993 18.1137 20.7044 17.2528 20.1614 16.5523C19.6184 15.8519 18.8581 15.3516 18 15.13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14 3.13C14.8604 3.35031 15.623 3.85071 16.1676 4.55232C16.7122 5.25392 17.0078 6.11683 17.0078 7.005C17.0078 7.89318 16.7122 8.75608 16.1676 9.45769C15.623 10.1593 14.8604 10.6597 14 10.88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-[#252525]">Group of Guest</span>
                </div>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isAddGuestFormOpen} onOpenChange={(open) => !open && setIsAddGuestFormOpen(false)}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none rounded-lg">
          <DialogTitle className="sr-only">Add Individual Guest</DialogTitle>
          <AddGuestForm
            isOpen={isAddGuestFormOpen}
            onClose={() => setIsAddGuestFormOpen(false)}
            setGuests={setGuests}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isAddGroupFormOpen} onOpenChange={(open) => !open && setIsAddGroupFormOpen(false)}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none rounded-lg bg-white">
          <DialogTitle className="sr-only">Add Group of Guests</DialogTitle>
          <div className="scrollbar-hide max-h-[90vh] overflow-y-auto">
            <AddGroupForm
              isOpen={isAddGroupFormOpen}
              onClose={() => setIsAddGroupFormOpen(false)}
              setGuests={setGuests}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GuestList

