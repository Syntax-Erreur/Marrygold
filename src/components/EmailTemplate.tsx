import * as React from 'react';
import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text
} from '@react-email/components';

interface EmailTemplateProps {
    guestName: string;
    events: string[];
    weddingDate: string;
    weddingLocation: string;
    coupleName: string;
    inviteLink?: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    guestName,
    events,
    weddingDate,
    weddingLocation,
    coupleName,
    inviteLink
}) => {

    const previewText = `You're invited to celebrate the wedding of ${coupleName}`;

    return (
        <Html>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Great+Vibes&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet" />
            </Head>
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={borderSection}>
                        <Img
                            src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745548843/seprator_teatvr.png"
                            width="550"
                            height="30"
                            alt="Decorative border"
                            style={decorativeBorder}
                        />
                    </Section>

                    <Section style={mainContentSection}>
                        <Section style={monogramSection}>
                            <Img
                                src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745550773/unnamed__1_-removebg-preview_ce96il.png"
                                width="120"
                                height="120"
                                alt="Wedding Monogram"
                                style={monogramImage}
                            />
                            <Text style={invitationIntro}>We invite you to celebrate</Text>
                            <Heading style={weddingOf}>The Wedding of</Heading>
                            <Heading style={coupleNames}>{coupleName}</Heading>
                        </Section>

                        {/* Separator with ornamental design */}
                        <Section style={separatorSection}>
                            <Img
                                src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745548843/seprator_teatvr.png"
                                width="200"
                                height="30"
                                alt="Decorative separator"
                                style={separatorImage}
                            />
                        </Section>

                        {/* Personal greeting */}
                        <Section style={greetingSection}>
                            <Text style={greeting}>Dear {guestName},</Text>
                            <Text style={paragraph}>
                                We are honored to request the pleasure of your company as we celebrate our union in marriage.
                                Your presence would make our special day complete, and we would be delighted to share this
                                moment of joy with you.
                            </Text>
                        </Section>

                        {/* Event details with ornate frame */}
                        <Section style={eventDetailsSection}>
                            <Img
                                src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745549669/ornate_frame_kff74v.jpg"
                                width="40"
                                height="40"
                                alt="Corner decoration"
                                style={cornerTL}
                            />
                            <Img
                                src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745549725/corderdeco_ahbhsm.png"
                                width="40"
                                height="40"
                                alt="Corner decoration"
                                style={cornerTR}
                            />

                            <Row style={detailsRow}>
                                <Column style={detailsColumn}>
                                    <Heading as="h3" style={detailsHeading}>Event Details</Heading>

                                    <Row style={detailItemRow}>
                                        <Column style={detailIconColumn}>
                                            <Img
                                                src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745549794/calendericon_yshlss.jpg"
                                                width="24"
                                                height="24"
                                                alt="Date"
                                            />
                                        </Column>
                                        <Column style={detailTextColumn}>
                                            <Text style={detailLabel}>Date & Time</Text>
                                            <Text style={detailText}>{weddingDate}</Text>
                                        </Column>
                                    </Row>

                                    <Row style={detailItemRow}>
                                        <Column style={detailIconColumn}>
                                            <Img
                                                src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745549978/generated-image_1_nz9qhn.png"
                                                width="24"
                                                height="24"
                                                alt="Venue"
                                            />
                                        </Column>
                                        <Column style={detailTextColumn}>
                                            <Text style={detailLabel}>Venue</Text>
                                            <Text style={detailText}>{weddingLocation}</Text>
                                        </Column>
                                    </Row>
                                </Column>
                            </Row>

                            <Img
                                src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745550056/pngtree-corner-flower-design-element-rustic-wedding-invitation-png-image_8989916_axgerl.png"
                                width="40"
                                height="40"
                                alt="Corner decoration"
                                style={cornerBL}
                            />
                            <Img
                                src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745550056/pngtree-corner-flower-design-element-rustic-wedding-invitation-png-image_8989916_axgerl.png"
                                width="40"
                                height="40"
                                alt="Corner decoration"
                                style={cornerBR}
                            />
                        </Section>

                        {/* Events the guest is invited to */}
                        <Section style={eventsSection}>
                            <Heading as="h3" style={eventsHeading}>You are cordially invited to</Heading>

                            <Row style={eventsContainer}>
                                {events.map((event, index) => {
                                    // Determine color based on event type
                                    let eventColor = '#D4AF37'; // Default gold
                                    let eventBgColor = '#FDF9E7'; // Default light gold

                                    if (event.toLowerCase().includes('haldi')) {
                                        eventColor = '#E1AC4B';
                                        eventBgColor = '#FDF8E9';
                                    } else if (event.toLowerCase().includes('sangeet')) {
                                        eventColor = '#7571A6';
                                        eventBgColor = '#F0EFF7';
                                    } else if (event.toLowerCase().includes('engagement')) {
                                        eventColor = '#B8877E';
                                        eventBgColor = '#F7F1F0';
                                    }

                                    return (
                                        <Column key={index} style={{
                                            ...eventCard,
                                            backgroundColor: eventBgColor,
                                            borderColor: eventColor
                                        }}>
                                            <Text style={{
                                                ...eventName,
                                                color: eventColor
                                            }}>
                                                {event}
                                            </Text>
                                        </Column>
                                    );
                                })}
                            </Row>
                        </Section>

                        {/* RSVP Button */}

                        {/* Footer with couple names */}
                        <Section style={footerSection}>
                            <Text style={footerText}>We look forward to celebrating with you!</Text>
                            <Text style={footerSignature}>With love,</Text>
                            <Text style={footerCouple}>{coupleName}</Text>
                        </Section>
                    </Section>

                    {/* Decorative bottom border */}
                    <Section style={borderSection}>
                        <Img
                            src="https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745550056/pngtree-corner-flower-design-element-rustic-wedding-invitation-png-image_8989916_axgerl.png"
                            width="550"
                            height="30"
                            alt="Decorative border"
                            style={decorativeBorder}
                        />
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

// Styles
const main = {
    backgroundColor: '#F8F4F0',
    fontFamily: 'Montserrat, Arial, sans-serif',
    padding: '10px 0',
    margin: 0,
};

const container = {
    maxWidth: '600px',
    margin: '0 auto',
    textAign: 'center' as const,
    backgroundColor: '#FFFFFF',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    overflow: 'hidden'
};

const borderSection = {
    padding: '0',
    marginBottom: '0',
};

const decorativeBorder = {
    display: 'block',
    margin: '0 auto',
    width: '100%',
    maxWidth: '550px',
};

const mainContentSection = {
    padding: '30px 30px 50px',
    position: 'relative' as const,
    backgroundColor: '#FFFFFF',
    backgroundImage: 'url("https://res.cloudinary.com/dvfk4g3wh/image/upload/v1745549669/ornate_frame_kff74v.jpg")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    borderLeft: '1px solid #EAD8BF',
    borderRight: '1px solid #EAD8BF',
};

const monogramSection = {
    marginTop: '10px',
    marginBottom: '30px',
    position: 'relative' as const,
    zIndex: '2',
};

const monogramImage = {
    margin: '0 auto 15px',
    borderRadius: '60px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

const invitationIntro = {
    fontFamily: 'Great Vibes, cursive',
    fontSize: '24px',
    color: '#D4AF37',
    margin: '0 0 5px',
    fontWeight: '400',
    lineHeight: '1.2',
    textShadow: '0 1px 2px rgba(0,0,0,0.05)',
};

const weddingOf = {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '30px',
    fontWeight: '500',
    color: '#9F8760',
    margin: '0 0 15px',
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
};

const coupleNames = {
    fontFamily: 'Great Vibes, cursive',
    fontSize: '42px',
    fontWeight: '400',
    color: '#B8877E',
    margin: '0',
    lineHeight: '1.1',
    textShadow: '0 1px 2px rgba(0,0,0,0.05)',
};

const separatorSection = {
    margin: '25px auto 30px',
};

const separatorImage = {
    margin: '0 auto',
};

const greetingSection = {
    margin: '20px 0 30px',
    padding: '0 15px',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '8px',
};

const greeting = {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '24px',
    fontWeight: '600',
    color: '#4A4A4A',
    textAlign: 'left' as const,
    margin: '0 0 15px',
};

const paragraph = {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#5A5A5A',
    textAlign: 'left' as const,
    fontWeight: '300',
    margin: '0 0 15px',
};

const eventDetailsSection = {
    position: 'relative' as const,
    margin: '20px auto 40px',
    padding: '40px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(4px)',
    maxWidth: '450px',
    borderRadius: '4px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
};

const cornerTL = {
    position: 'absolute' as const,
    top: '0',
    left: '0',
    transform: 'translateX(-10%) translateY(-10%)',
};

const cornerTR = {
    position: 'absolute' as const,
    top: '0',
    right: '0',
    transform: 'translateX(10%) translateY(-10%) rotate(90deg)',
};

const cornerBL = {
    position: 'absolute' as const,
    bottom: '0',
    left: '0',
    transform: 'translateX(-10%) translateY(10%) rotate(-90deg)',
};

const cornerBR = {
    position: 'absolute' as const,
    bottom: '0',
    right: '0',
    transform: 'translateX(10%) translateY(10%) rotate(180deg)',
};

const detailsRow = {
    padding: '0 10px',
};

const detailsColumn = {
    padding: '0 20px',
};

const detailsHeading = {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '26px',
    fontWeight: '600',
    color: '#B8877E',
    marginBottom: '25px',
    textAlign: 'center' as const,
};

const detailItemRow = {
    marginBottom: '20px',
    padding: '0',
};

const detailIconColumn = {
    width: '24px',
    paddingRight: '15px',
    verticalAlign: 'top' as const,
};

const detailTextColumn = {
    textAlign: 'left' as const,
};

const detailLabel = {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '18px',
    fontWeight: '600',
    color: '#9F8760',
    margin: '0 0 5px',
};

const detailText = {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '15px',
    fontWeight: '400',
    color: '#5A5A5A',
    margin: '0',
};

const eventsSection = {
    margin: '20px 0 30px',
    padding: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '8px',
};

const eventsHeading = {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '24px',
    fontWeight: '600',
    color: '#9F8760',
    margin: '0 0 25px',
    textAlign: 'center' as const,
};

const eventsContainer = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
    gap: '15px',
};

const eventCard = {
    padding: '15px 20px',
    width: '100%',
    maxWidth: '120px',
    margin: '0 10px 15px',
    border: '1px solid',
    borderRadius: '8px',
    display: 'inline-block',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease',
};

const eventName = {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0',
    textAlign: 'center' as const,
};

const rsvpSection = {
    margin: '40px 0 30px',
    padding: '20px 15px',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '8px',
};

const rsvpButton = {
    backgroundColor: '#B8877E',
    color: '#FFFFFF',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '16px',
    fontWeight: '500',
    textDecoration: 'none',
    padding: '12px 40px',
    borderRadius: '4px',
    display: 'inline-block',
    textAlign: 'center' as const,
    margin: '0 auto 15px',
    letterSpacing: '1px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const rsvpText = {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '13px',
    color: '#9F8760',
    margin: '0',
};

const footerSection = {
    margin: '40px 0 0',
    padding: '20px 15px 0',
    borderTop: '1px solid #EAD8BF',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '0 0 8px 8px',
};

const footerText = {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '15px',
    fontWeight: '300',
    color: '#5A5A5A',
    margin: '0 0 15px',
};

const footerSignature = {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '18px',
    fontWeight: '500',
    color: '#9F8760',
    margin: '0 0 5px',
};

const footerCouple = {
    fontFamily: 'Great Vibes, cursive',
    fontSize: '28px',
    fontWeight: '400',
    color: '#B8877E',
    margin: '0',
};

export default EmailTemplate; 