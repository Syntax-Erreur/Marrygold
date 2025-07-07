import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import EmailTemplate from '@/components/EmailTemplate';
import { z } from 'zod';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Define schema for validation
const invitationSchema = z.object({
    guestName: z.string().min(1, "Guest name is required"),
    email: z.string().email("Valid email is required"),
    events: z.array(z.string()).nonempty("At least one event must be selected"),
    weddingDate: z.string().min(1, "Wedding date is required"),
    weddingLocation: z.string().min(1, "Wedding location is required"),
    coupleName: z.string().min(1, "Couple name is required"),
    inviteLink: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();

        // Validate the request data
        const validationResult = invitationSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.format() },
                { status: 400 }
            );
        }

        const {
            guestName,
            email,
            events,
            weddingDate,
            weddingLocation,
            coupleName,
            inviteLink
        } = validationResult.data;

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: 'Wedding Invitation <onboarding@resend.dev>',
            to: [email],
            subject: `You're invited to ${coupleName}'s Wedding Celebration!`,
            react: EmailTemplate({
                guestName,
                events,
                weddingDate,
                weddingLocation,
                coupleName,
                inviteLink
            }) as React.ReactElement,
        });

        if (error) {
            console.error('Error sending email:', error);
            return NextResponse.json(
                { error: 'Failed to send invitation email' },
                { status: 500 }
            );
        }

        // Return success response
        return NextResponse.json(
            {
                message: 'Invitation email sent successfully',
                emailId: data?.id
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 