"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import ColorThemeSelector from "./colorTheme"
import EventFormField from "./eventformFeild"
import { toast } from "sonner"
import type { EventFormData, FirestoreEventData } from "@/types/event"
import { auth } from "@/lib/firebase"
import { DatePicker } from "@/components/ui/date-picker"

type CreateEventModalProps = {
  onClose?: () => void
  onSubmit?: (formData: EventFormData) => void
}

export default function CreateEventModal({ onClose, onSubmit }: CreateEventModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<EventFormData>({
    eventName: "",
    eventTag: "",
    tables: "",
    peoplePerTable: "",
    themeColorIndex: 1,
    startDateTime: "",
    endDateTime: "",
    budget: "",
  })
  const [totalCapacity, setTotalCapacity] = useState(0)

  // Generate range of numbers for dropdowns
  const generateRange = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString())
  }

  const tableOptions = generateRange(1, 100)
  const peopleOptions = generateRange(1, 8)

  // Calculate total capacity whenever tables or peoplePerTable changes
  useEffect(() => {
    if (formData.tables && formData.peoplePerTable) {
      const tables = parseInt(formData.tables)
      const peoplePerTable = parseInt(formData.peoplePerTable)
      const capacity = tables * peoplePerTable
      setTotalCapacity(capacity)
    } else {
      setTotalCapacity(0)
    }
  }, [formData.tables, formData.peoplePerTable])

  const handleInputChange = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleColorSelect = (colorIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      themeColorIndex: colorIndex,
    }))
  }

  const handleReset = () => {
    setFormData({
      eventName: "",
      eventTag: "",
      tables: "",
      peoplePerTable: "",
      themeColorIndex: 1,
      startDateTime: "",
      endDateTime: "",
      budget: "",
    })
  }

  const validateForm = (): boolean => {
    if (!formData.eventName.trim()) {
      toast.error("Event name is required")
      return false
    }
    if (!formData.eventTag.trim()) {
      toast.error("Event tag is required")
      return false
    }
    if (!formData.tables) {
      toast.error("Number of tables is required")
      return false
    }
    if (!formData.peoplePerTable) {
      toast.error("People per table is required")
      return false
    }
    if (!formData.startDateTime) {
      toast.error("Start date is required")
      return false
    }
    if (!formData.endDateTime) {
      toast.error("End date is required")
      return false
    }
    if (new Date(formData.endDateTime) <= new Date(formData.startDateTime)) {
      toast.error("End date must be after start date")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return

      setIsSubmitting(true)

      const firestoreData: FirestoreEventData = {
        name: formData.eventName.toLowerCase(),
        tag: formData.eventTag,
        tables: parseInt(formData.tables),
        peoplePerTable: parseInt(formData.peoplePerTable),
        themeColorIndex: formData.themeColorIndex || 1,
        totalCapacity: parseInt(formData.tables) * parseInt(formData.peoplePerTable),
        createdAt: new Date().toISOString(),
        isDefault: false,
        userId: auth.currentUser?.uid,
        startDateTime: formData.startDateTime,
        endDateTime: formData.endDateTime,
        budget: formData.budget ? parseFloat(formData.budget) : null,
      }

      const docRef = await addDoc(collection(db, "events"), firestoreData)

      toast.success("Event created successfully!")

      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit(formData)
      }

      // Close the modal
      if (onClose) {
        onClose()
      }

    } catch (error) {
      console.error("Error creating event:", error)
      toast.error("Failed to create event. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCapacity = (capacity: number) => {
    return capacity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-[650px] m-4">
        <div className="flex flex-col p-6 gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium text-black">Create Event</h2>
            <button
              className="flex justify-center items-center w-8 h-8 bg-red-600 rounded text-white"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Color Theme Selector */}
          <ColorThemeSelector onSelectColor={handleColorSelect} selectedColorIndex={formData.themeColorIndex} />

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <EventFormField
              label="Event Name"
              type="text"
              placeholder="Enter Event Name"
              value={formData.eventName}
              onChange={(value) => handleInputChange("eventName", value)}
            />
            <EventFormField
              label="Event Tag"
              type="text"
              placeholder="Enter Event Tag"
              value={formData.eventTag}
              onChange={(value) => handleInputChange("eventTag", value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <EventFormField
              label="Tables for Event"
              type="select"
              placeholder="Select Tables for Event"
              options={tableOptions}
              value={formData.tables}
              onChange={(value) => handleInputChange("tables", value)}
            />
            <EventFormField
              label="No of People Each Table"
              type="select"
              placeholder="Select No of People Each Table"
              options={peopleOptions}
              value={formData.peoplePerTable}
              onChange={(value) => handleInputChange("peoplePerTable", value)}
            />
          </div>

          {totalCapacity === 800 && (
            <div className="flex items-center p-3 rounded-md bg-pink-100 text-pink-500">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.0026 11.833C8.27875 11.833 8.5026 11.6091 8.5026 11.333V7.33301C8.5026 7.05687 8.27875 6.83301 8.0026 6.83301C7.72646 6.83301 7.5026 7.05687 7.5026 7.33301V11.333C7.5026 11.6091 7.72646 11.833 8.0026 11.833Z" fill="#FF33A0" />
                  <path d="M8.0026 4.66634C8.37079 4.66634 8.66927 4.96482 8.66927 5.33301C8.66927 5.7012 8.37079 5.99967 8.0026 5.99967C7.63441 5.99967 7.33594 5.7012 7.33594 5.33301C7.33594 4.96482 7.63441 4.66634 8.0026 4.66634Z" fill="#FF33A0" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M0.835938 7.99967C0.835938 4.04163 4.04456 0.833008 8.0026 0.833008C11.9606 0.833008 15.1693 4.04163 15.1693 7.99967C15.1693 11.9577 11.9606 15.1663 8.0026 15.1663C4.04456 15.1663 0.835938 11.9577 0.835938 7.99967ZM8.0026 1.83301C4.59685 1.83301 1.83594 4.59392 1.83594 7.99967C1.83594 11.4054 4.59685 14.1663 8.0026 14.1663C11.4084 14.1663 14.1693 11.4054 14.1693 7.99967C14.1693 4.59392 11.4084 1.83301 8.0026 1.83301Z" fill="#FF33A0" />
                </svg>

                <span>{formatCapacity(totalCapacity)} people are expected to participate in this event.</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <DatePicker
              label="Event Start Date"
              placeholder="Select start date"
              value={formData.startDateTime}
              onChange={(value) => handleInputChange("startDateTime", value)}
            />
            <DatePicker
              label="Event End Date"
              placeholder="Select end date"
              value={formData.endDateTime}
              onChange={(value) => handleInputChange("endDateTime", value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-5">
            <EventFormField
              label="Event Budget"
              type="number"
              placeholder="Enter Event Budget"
              value={formData.budget}
              onChange={(value) => handleInputChange("budget", value)}
              prefix="$"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              className="px-6 py-2.5 text-sm font-medium rounded-lg border border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Reset
            </button>
            <button
              className="px-6 py-2.5 text-sm font-medium text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

