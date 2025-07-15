w'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useSearchParams, useRouter } from 'next/navigation'
import { validateInviteLink, markInviteLinkAsUsed } from '@/lib/firebase/invite-service'
import { addGuest } from '@/lib/firebase/guest-service'
import type { EventType, FoodPreference } from '@/lib/types/guest'

interface ValidateInviteLinkResponse {
  isValid: boolean
  event?: EventType
  message?: string
  userId?: string
  isUsed?: boolean
}

export default function AddGuestPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [selectedEvents, setSelectedEvents] = useState<EventType[]>([])
  const [foodPreference, setFoodPreference] = useState<FoodPreference>("Veg")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string>("")
  const [inviteCode, setInviteCode] = useState<string>("")

  const EVENTS = [
    { name: "Haldi" as const, color: "bg-yellow-50 border-yellow-200 text-yellow-700", dotColor: "bg-yellow-500" },
    { name: "Sangeet" as const, color: "bg-blue-50 border-blue-200 text-blue-700", dotColor: "bg-blue-500" },
    { name: "Engagement" as const, color: "bg-green-50 border-green-200 text-green-700", dotColor: "bg-green-500" }
  ]

  useEffect(() => {
    const validateInvite = async () => {
      try {
        console.log('Starting invite validation...');
        const code = searchParams.get('invite')
        console.log('Invite code from URL:', code);

        if (!code) {
          console.error('No invite code found in URL');
          setError('Invalid invite link - no code provided')
          return
        }

        setInviteCode(code)
        console.log('Calling validateInviteLink with code:', code);
        const validation = await validateInviteLink(code) as ValidateInviteLinkResponse
        console.log('Validation result:', validation);

        if (!validation.isValid) {
          console.error('Invite not valid:', validation.message);
          setError(validation.message || 'Invalid invite link')
          return
        }

        if (validation.isUsed) {
          console.error('Invite already used');
          setError('This invite link has already been used')
          return
        }

        if (validation.event && typeof validation.event === 'string') {
          console.log('Setting selected event:', validation.event);
          setSelectedEvents([validation.event])
        } else {
          console.warn('No event found in invite data');
        }

        if (validation.userId) {
          console.log('Setting userId:', validation.userId);
          setUserId(validation.userId)
        } else {
          console.error('No userId found in invite data');
          setError('Invalid user ID in invite link')
          return
        }

        console.log('Invite validation successful');

      } catch (error) {
        console.error('Error validating invite:', error)
        setError(error instanceof Error ? error.message : 'Failed to validate invite link')
      } finally {
        setIsLoading(false)
      }
    }

    validateInvite()
  }, [searchParams])

  const handleEventSelection = (eventName: EventType) => {
    if (selectedEvents.includes(eventName)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== eventName))
    } else {
      setSelectedEvents([...selectedEvents, eventName])
    }
  }

  const isEventSelected = (eventName: EventType) => selectedEvents.includes(eventName)

  const handleReset = () => {
    setFirstName("")
    setLastName("")
    setEmail("")
    setContactNumber("")
    setSelectedEvents([])
    setFoodPreference("Veg")
    setIsSubmitted(false)
  }

  const handleSubmit = async () => {
    try {
      if (!firstName || !lastName || !contactNumber || !selectedEvents.length) {
        toast.error('Please fill in all required fields and select at least one event.')
        return
      }

      if (!inviteCode || !userId) {
        toast.error('Invalid invite link')
        return
      }

      const guestData = {
        name: `${firstName} ${lastName}`.trim(),
        email,
        events: selectedEvents,
        foodPreference,
        mobileNumber: contactNumber,
        source: "invite" as const
      }

      // Add the guest with userId
      const result = await addGuest(userId, guestData)

      if (!result) {
        throw new Error('Failed to add guest')
      }

      // Mark the invite link as used
      await markInviteLinkAsUsed(inviteCode)

      // Send the invitation email if email is provided
      if (email) {
        try {
          const emailData = {
            guestName: `${firstName} ${lastName}`.trim(),
            email,
            events: selectedEvents,
            weddingDate: "January 15, 2025", // You should customize this or fetch from your settings
            weddingLocation: "The Grand Ballroom, Mumbai", // You should customize this or fetch from your settings
            coupleName: "Rahul & Priya", // You should customize this or fetch from your settings
            inviteLink: window.location.origin + window.location.pathname + "?invite=" + inviteCode
          }

          const response = await fetch('/api/send-invitation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
          })

          if (!response.ok) {
            console.error('Failed to send invitation email')
            // Don't block the flow for email failure
          }
        } catch (emailError) {
          console.error('Error sending invitation email:', emailError)
          // Don't block the flow for email failure
        }
      }

      setIsSubmitted(true)
      toast.success('Successfully registered!')

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/')
      }, 3000)

    } catch (error) {
      console.error('Failed to process submission:', error)
      toast.error('Could not process your submission. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating invite link...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Invalid Link</h1>
          <p className="text-neutral-600 mb-6">{error}</p>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Thank You!</h1>
          <p className="text-neutral-600 mb-6">You have been successfully added to the guest list.</p>
          <p className="text-sm text-neutral-500">Redirecting you in a few seconds...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl font-semibold text-neutral-900 mb-6">
          You have been invited to {selectedEvents.join(', ')}
        </h1>

        <div className="flex flex-col gap-6">
          <div className="flex gap-4 sm:gap-6 flex-col sm:flex-row">
            <div className="flex-1">
              <label className="block mb-2 text-sm font-medium text-neutral-900" htmlFor="first-name">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="first-name"
                type="text"
                placeholder="Enter First Name"
                className="px-4 w-full h-12 text-sm bg-white rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
                className="px-4 w-full h-12 text-sm bg-white rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-900" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter Email Address"
              className="px-4 w-full h-12 text-sm bg-white rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-900" htmlFor="contact-number">
              WhatsApp/Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              id="contact-number"
              type="text"
              placeholder="Enter Contact Number"
              className="px-4 w-full h-12 text-sm bg-white rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-900">
              Choice of Food <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <button
                className={`flex-1 h-12 text-sm font-medium rounded-lg border cursor-pointer flex items-center justify-center gap-2 transition-colors ${foodPreference === "Veg"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-neutral-100 border-neutral-200 text-neutral-900 hover:bg-neutral-200"
                  }`}
                onClick={() => setFoodPreference("Veg")}
                type="button"
              >
                {foodPreference === "Veg" && <span className="h-2 w-2 rounded-full bg-green-500"></span>}
                Veg
              </button>
              <button
                className={`flex-1 h-12 text-sm font-medium rounded-lg border cursor-pointer flex items-center justify-center gap-2 transition-colors ${foodPreference === "Non Veg"
                  ? "bg-orange-50 border-orange-200 text-orange-700"
                  : "bg-neutral-100 border-neutral-200 text-neutral-900 hover:bg-neutral-200"
                  }`}
                onClick={() => setFoodPreference("Non Veg")}
                type="button"
              >
                {foodPreference === "Non Veg" && <span className="h-2 w-2 rounded-full bg-orange-500"></span>}
                Non Veg
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-900">
              Select Event <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3 flex-wrap sm:flex-nowrap">
              {EVENTS.map((event) => (
                <button
                  key={event.name}
                  className={`flex-1 h-12 text-sm font-medium rounded-lg border cursor-pointer min-w-[100px] flex items-center justify-center gap-2 transition-colors ${isEventSelected(event.name)
                    ? event.color
                    : "bg-neutral-100 border-neutral-200 text-neutral-900 hover:bg-neutral-200"
                    }`}
                  onClick={() => handleEventSelection(event.name)}
                  type="button"
                  aria-pressed={isEventSelected(event.name)}
                >
                  {isEventSelected(event.name) && <span className={`h-2 w-2 rounded-full ${event.dotColor}`} aria-hidden="true"></span>}
                  {event.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-end mt-2">
            <button
              className="text-sm font-medium rounded-lg border bg-neutral-100 border-neutral-200 h-[52px] text-neutral-900 w-[120px] hover:bg-neutral-200 transition-colors"
              onClick={handleReset}
              type="button"
            >
              Reset
            </button>
            <button
              className="text-sm font-medium text-white bg-pink-500 rounded-lg h-[52px] w-[120px] hover:bg-pink-600 transition-colors"
              onClick={handleSubmit}
              type="button"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}