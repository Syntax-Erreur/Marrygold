import { collection, doc, serverTimestamp, updateDoc, query, where, getDocs, Timestamp, runTransaction, limit, addDoc, getDoc } from "firebase/firestore"
import { generateInviteCode } from "@/lib/generateInviteCode"
import { db } from "@/lib/firebase"
import type { EventType } from "@/lib/types/guest"

export interface InviteLink {
    id: string
    code: string
    userId: string
    event: EventType
    isUsed: boolean
    createdAt: string
    expiresAt: string
}

async function verifyDatabaseConnection(): Promise<boolean> {
    try {
        const invitesRef = collection(db, "invites")
        console.log('Verifying database connection and collection access...')

        // Try to read from the collection
        await getDocs(query(invitesRef, limit(1)))
        console.log('Successfully connected to database and accessed invites collection')
        return true
    } catch (error) {
        console.error('Database connection or collection access failed:', error)
        return false
    }
}

export async function testCreateAndVerifyInvite(): Promise<{ success: boolean; code?: string; error?: string }> {
    try {
        console.log('Starting test invite creation...')

        // First verify database connection
        const isConnected = await verifyDatabaseConnection()
        if (!isConnected) {
            return {
                success: false,
                error: 'Failed to connect to database or access invites collection'
            }
        }

        // Create test invite
        const event = "Haldi"
        const testUserId = "test-user-id"
        console.log('Creating test invite for event:', event)
        const code = await createInviteLink(event, testUserId)
        console.log('Created invite with code:', code)

        // Verify it exists
        const validation = await validateInviteLink(code)
        console.log('Validation result:', validation)

        if (!validation.isValid) {
            return {
                success: false,
                error: `Invite creation failed validation: ${validation.message}`
            }
        }

        return {
            success: true,
            code
        }
    } catch (error) {
        console.error('Test failed:', error)
        return {
            success: false,
            error: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
    }
}

export async function createInviteLink(event: EventType, userId: string): Promise<string> {
    try {
        if (!userId) {
            throw new Error("User ID is required to create an invite link")
        }

        // Generate a unique code using our utility function
        const code = generateInviteCode()

        // Set expiry to 7 days from now
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7)

        const inviteData = {
            code,
            userId,
            event,
            isUsed: false,
            createdAt: new Date().toISOString(),
            expiresAt: expiresAt.toISOString()
        }

        await addDoc(collection(db, "invites"), inviteData)
        return code
    } catch (error) {
        console.error("Error creating invite link:", error)
        throw new Error("Failed to create invite link")
    }
}

export async function validateInviteLink(code: string) {
    try {
        // Log for debugging
        console.log(`Validating invite code: ${code}`);

        // Query for the invite with this code
        const invitesRef = collection(db, "invites")
        const q = query(invitesRef, where("code", "==", code))
        const querySnapshot = await getDocs(q)

        console.log(`Found ${querySnapshot.size} invites with code ${code}`);

        if (querySnapshot.empty) {
            console.log(`No invite found with code: ${code}`);
            return {
                isValid: false,
                message: "Invalid invite code"
            }
        }

        const invite = querySnapshot.docs[0].data() as InviteLink;
        console.log(`Invite data:`, invite);

        const now = new Date()
        const expiresAt = new Date(invite.expiresAt)

        // Check if link has expired
        if (now > expiresAt) {
            console.log(`Invite expired. Current date: ${now.toISOString()}, Expiry date: ${expiresAt.toISOString()}`);
            return {
                isValid: false,
                message: "This invite link has expired"
            }
        }

        // Check if link has been used
        if (invite.isUsed) {
            console.log(`Invite has already been used`);
            return {
                isValid: false,
                message: "This invite link has already been used",
                isUsed: true
            }
        }

        console.log(`Invite is valid for event: ${invite.event}, userId: ${invite.userId}`);
        return {
            isValid: true,
            event: invite.event,
            userId: invite.userId
        }
    } catch (error) {
        console.error("Error validating invite link:", error)
        return {
            isValid: false,
            message: "Failed to validate invite link"
        }
    }
}

export async function markInviteLinkAsUsed(code: string): Promise<boolean> {
    try {
        const invitesRef = collection(db, "invites")
        const q = query(invitesRef, where("code", "==", code))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
            return false
        }

        const inviteDoc = querySnapshot.docs[0]
        await updateDoc(doc(db, "invites", inviteDoc.id), {
            isUsed: true
        })

        return true
    } catch (error) {
        console.error("Error marking invite as used:", error)
        return false
    }
} 