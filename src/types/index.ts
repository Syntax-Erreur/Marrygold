export interface Guest {
    id?: string
    userId: string
    name: string
    email: string
    phone?: string
    mobileNumber?: string
    events: string[]
    foodPreference: "Veg" | "Non Veg"
    dietaryRestrictions?: string
    plusOne?: boolean
    status?: string
    createdAt: string
    createdBy?: string
    source?: string
} 