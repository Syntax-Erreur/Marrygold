"use client"

import { useState, useRef } from "react"
import { useParams } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
 import {  Download, Upload } from "lucide-react"
import { toast } from "sonner"
import { addDoc, collection, doc, writeBatch } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { Guest } from "@/types"

interface AddGuestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGuestAdded: () => void
}

export default function AddGuestDialog({ open, onOpenChange, onGuestAdded }: AddGuestDialogProps) {
  const { event } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [foodPreference, setFoodPreference] = useState<"Veg" | "Non Veg">("Veg")

   const normalizedEvent = String(event).charAt(0).toUpperCase() + String(event).slice(1).toLowerCase()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth.currentUser) return

    setIsLoading(true)
    try {
      const guestData = {
        userId: auth.currentUser.uid,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        email,
        events: [normalizedEvent],
        foodPreference,
        mobileNumber: contactNumber,
        createdAt: new Date().toISOString(),
        source: "manual"
      }

      const docRef = await addDoc(collection(db, "guests"), guestData)
      const newGuest = {
        id: docRef.id,
        ...guestData
      }

      toast.success("Guest added successfully!")
      onGuestAdded() 
      onOpenChange(false)
      setFirstName("")
      setLastName("")
      setEmail("")
      setContactNumber("")
      setFoodPreference("Veg")
      return newGuest
    } catch (error) {
      console.error("Error adding guest:", error)
      toast.error("Failed to add guest")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] p-6 overflow-hidden border-none rounded-xl">
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between mb-6">
            <DialogTitle className="text-xl font-semibold text-[#252525]">Add Guest</DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="flex items-center justify-center h-8 w-8 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="flex gap-4 sm:gap-6 flex-col sm:flex-row">
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium text-neutral-900">First Name</label>
                <input
                  type="text"
                  placeholder="Enter First Name"
                  className="px-4 w-full h-12 text-sm bg-white rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium text-neutral-900">Last Name</label>
                <input
                  type="text"
                  placeholder="Enter Last Name"
                  className="px-4 w-full h-12 text-sm bg-white rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-neutral-900">Email Address</label>
              <input
                type="email"
                placeholder="Enter Email Address"
                className="px-4 w-full h-12 text-sm bg-white rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-neutral-900">Choice of Food</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  className={`flex-1 h-12 text-sm font-medium rounded-lg border cursor-pointer flex items-center justify-center gap-2 transition-colors ${
                    foodPreference === "Veg"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-neutral-100 border-neutral-200 text-neutral-900 hover:bg-neutral-200"
                  }`}
                  onClick={() => setFoodPreference("Veg")}
                >
                  {foodPreference === "Veg" && <span className="h-2 w-2 rounded-full bg-green-500"></span>}
                  Veg
                </button>
                <button
                  type="button"
                  className={`flex-1 h-12 text-sm font-medium rounded-lg border cursor-pointer flex items-center justify-center gap-2 transition-colors ${
                    foodPreference === "Non Veg"
                      ? "bg-orange-50 border-orange-200 text-orange-700"
                      : "bg-neutral-100 border-neutral-200 text-neutral-900 hover:bg-neutral-200"
                  }`}
                  onClick={() => setFoodPreference("Non Veg")}
                >
                  {foodPreference === "Non Veg" && <span className="h-2 w-2 rounded-full bg-orange-500"></span>}
                  Non Veg
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-neutral-900">WhatsApp/Contact Number</label>
              <input
                type="text"
                placeholder="Enter Contact Number"
                className="px-4 w-full h-12 text-sm bg-white rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>

            <div className="flex gap-8 justify-end mt-2">
              <button
                type="button"
                onClick={() => {
                  setFirstName("")
                  setLastName("")
                  setEmail("")
                  setContactNumber("")
                  setFoodPreference("Veg")
                }}
                className="text-sm font-medium rounded-lg border bg-neutral-100 border-neutral-200 h-[52px] text-neutral-900 w-[120px] hover:bg-neutral-200 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="text-sm font-medium text-white bg-pink-500 rounded-lg h-[52px] w-[120px] hover:bg-pink-600 transition-colors disabled:opacity-50"
              >
                Add Guest
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface AddGroupFormProps {
  isOpen: boolean
  onClose: () => void
  onGuestsAdded: () => void
  event: string
}

export function AddGroupForm({ isOpen, onClose, onGuestsAdded, event }: AddGroupFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = e.target.files?.[0]
      if (!file) return
      
      setIsLoading(true)
      const text = await file.text()
      const rows = text.split('\n').filter(Boolean)
      
      if (rows.length === 0) {
        toast.error('CSV file is empty')
        return
      }
      
      const batch = writeBatch(db)
      const guestsRef = collection(db, 'events', event, 'guests')
      
      const guests = rows.slice(1).map(row => {
        const [name, email, phone, dietaryRestrictions, plusOne] = row.split(',').map(cell => cell.trim())
        return {
          name,
          email,
          phone,
          dietaryRestrictions,
          plusOne: plusOne === 'true',
          status: 'pending',
          createdAt: new Date().toISOString(),
          createdBy: auth.currentUser?.uid
        } as Guest
      })
      
      guests.forEach(guest => {
        const docRef = doc(guestsRef)
        batch.set(docRef, guest)
      })
      
      await batch.commit()
      toast.success(`Added ${guests.length} guests successfully`)
      onGuestsAdded()
      onClose()
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error({ error })
      toast.error('Failed to add guests')
    } finally {
      setIsLoading(false)
    }
  }
  
  function onDownloadTemplate() {
    const template = 'Name,Email,Phone,Dietary Restrictions,Plus One\nJohn Doe,john@example.com,1234567890,None,false'
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'guest-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Add Multiple Guests</DialogTitle>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4 items-center">
            <button
              onClick={onDownloadTemplate}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <Download className="h-4 w-4" />
              Download CSV Template
            </button>
            
            <label 
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">CSV file only</p>
              </div>
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                className="hidden"
                accept=".csv"
                onChange={onFileChange}
                disabled={isLoading}
              />
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { AddGuestDialog }
