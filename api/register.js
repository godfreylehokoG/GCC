import { sendRegistrationConfirmation } from './_lib/email.js';
import { saveEventRegistration } from './_lib/dynamodb.js';
import { sendApiError } from './_lib/http-errors.js';
import { randomUUID } from 'crypto';

function splitFullName(fullName, fallbackFirstName = 'Guest', fallbackLastName = '') {
    const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return { firstName: fallbackFirstName, lastName: fallbackLastName };
    }

    return {
        firstName: parts[0],
        lastName: parts.slice(1).join(' ') || fallbackLastName
    };
}

function toAmount(value) {
    const amount = Number(value);
    return Number.isFinite(amount) ? amount : 0;
}

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            firstName, lastName, email, phone, fullPhone,
            country, city, stateProvince, postalCode,
            interest, referralSource, reasonForAttending,
            occupation, experienceLevel, marketingConsent,
            eventId, eventTitle, paymentReference, amount, currency, status,
            events, guests, guestCount, collectGuestDetails, guestTicketQuantities
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !fullPhone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const selectedEvents = Array.isArray(events) && events.length > 0
            ? events
            : [{
                id: eventId,
                title: eventTitle,
                displayDate: req.body.eventDisplayDate,
                venue: req.body.eventVenue,
                time: req.body.eventTime,
                address: req.body.eventAddress,
                amount,
                currency
            }];
        const registrationGroupId = randomUUID();
        const selectedEventIds = new Set(selectedEvents.map(event => String(event.id)));
        const submittedGuests = Array.isArray(guests) ? guests : [];
        const useGuestDetails = Boolean(collectGuestDetails);
        const guestQuantityByEvent = guestTicketQuantities && typeof guestTicketQuantities === 'object'
            ? guestTicketQuantities
            : {};
        const primaryPhone = fullPhone || phone;

        // Prepare the shared registration data for DynamoDB
        const baseRegistrationData = {
            country: country || null,
            city: city || null,
            state_province: stateProvince || null,
            postal_code: postalCode || null,
            interest: interest || 'general',
            referral_source: referralSource || null,
            reason_for_attending: reasonForAttending || null,
            occupation: occupation || null,
            experience_level: experienceLevel || null,
            marketing_consent: marketingConsent || false,
            payment_reference: paymentReference || null,
            payment_currency: currency || null,
            payment_total: toAmount(amount),
            payment_status: status || 'confirmed',
            registration_group_id: registrationGroupId,
            booker_first_name: firstName,
            booker_last_name: lastName,
            booker_email: email,
            booker_phone: primaryPhone,
            guest_count: Number(guestCount) || 0,
            guest_details_collected: useGuestDetails,
            source: 'website'
        };

        const primaryRows = selectedEvents.map(event => ({
            ...baseRegistrationData,
            first_name: firstName,
            last_name: lastName,
            email,
            phone: primaryPhone,
            attendee_type: 'primary',
            attendee_index: 0,
            attendee_label: 'Primary',
            attendee_details_provided: true,
            event_id: event.id || null,
            event_title: event.title || null,
            payment_amount: toAmount(event.amount),
            payment_currency: event.currency || currency || null
        }));

        const guestRows = useGuestDetails
            ? submittedGuests.flatMap((guest, index) => {
                const guestEventIds = Array.isArray(guest.eventIds)
                    ? guest.eventIds.map(id => String(id)).filter(id => selectedEventIds.has(id))
                    : [];
                const { firstName: guestFirstName, lastName: guestLastName } = splitFullName(guest.fullName, `Guest ${index + 1}`);

                return selectedEvents
                    .filter(event => guestEventIds.includes(String(event.id)))
                    .map(event => ({
                        ...baseRegistrationData,
                        first_name: guestFirstName,
                        last_name: guestLastName,
                        email: guest.email || email,
                        phone: guest.phone || primaryPhone,
                        attendee_type: 'guest',
                        attendee_index: index + 1,
                        attendee_label: `Guest ${index + 1}`,
                        attendee_details_provided: true,
                        event_id: event.id || null,
                        event_title: event.title || null,
                        payment_amount: toAmount(event.amount),
                        payment_currency: event.currency || currency || null
                    }));
            })
            : selectedEvents.flatMap(event => {
                const quantity = Math.max(0, Number(guestQuantityByEvent[event.id]) || 0);

                return Array.from({ length: quantity }, (_, index) => ({
                    ...baseRegistrationData,
                    first_name: 'Guest',
                    last_name: String(index + 1),
                    email,
                    phone: primaryPhone,
                    attendee_type: 'guest',
                    attendee_index: index + 1,
                    attendee_label: `Guest ${index + 1}`,
                    attendee_details_provided: false,
                    event_id: event.id || null,
                    event_title: event.title || null,
                    payment_amount: toAmount(event.amount),
                    payment_currency: event.currency || currency || null
                }));
            });

        // Save one row per attendee per selected event so event reports count actual seats.
        const savedRegistrations = await Promise.all([...primaryRows, ...guestRows].map(saveEventRegistration));
        const savedRegistration = savedRegistrations[0];

        // Log the lead
        console.log('New Lead Registered in DynamoDB:', savedRegistrations);

        const eventSummary = selectedEvents.length > 1
            ? {
                title: `${selectedEvents.length} Events: ${selectedEvents.map(event => event.title).join(', ')}`,
                displayDate: selectedEvents.map(event => `${event.title}: ${event.displayDate || 'TBD'}`).join('<br>'),
                venue: selectedEvents.map(event => `${event.title}: ${event.venue || 'TBD'}`).join('<br>'),
                time: selectedEvents.map(event => `${event.title}: ${event.time || 'TBD'}`).join('<br>'),
                address: selectedEvents.map(event => `${event.title}: ${event.address || 'TBD'}`).join('<br>'),
                paymentReference,
                amount,
                currency,
                ticketCount: savedRegistrations.length
            }
            : {
                title: selectedEvents[0]?.title || eventTitle,
                displayDate: selectedEvents[0]?.displayDate || req.body.eventDisplayDate,
                venue: selectedEvents[0]?.venue || req.body.eventVenue,
                time: selectedEvents[0]?.time || req.body.eventTime,
                address: selectedEvents[0]?.address || req.body.eventAddress,
                paymentReference,
                amount,
                currency,
                ticketCount: savedRegistrations.length
            };

        // Send email notification and wait for result for debugging
        const emailResult = await sendRegistrationConfirmation(
            { firstName, email },
            eventSummary
        ).catch(err => {
            console.error('CRITICAL: Email processing exception:', err);
            return { success: false, error: err.message };
        });

        if (!emailResult.success) {
            console.error(`Email delivery failed for ${email}:`, emailResult.error);
            // We still return success: true for the registration itself, 
            // but we add an emailError flag so the UI can show a warning
            return res.status(200).json({
                success: true,
                message: 'Registration successful, but confirmation email failed to send.',
                emailError: emailResult.error,
                lead: {
                    id: savedRegistration.id,
                    firstName: savedRegistration.first_name,
                    email: savedRegistration.email
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Registration successful',
            lead: {
                id: savedRegistration.id,
                firstName: savedRegistration.first_name,
                email: savedRegistration.email
            }
        });

    } catch (error) {
        console.error('--- INTERNAL SERVER ERROR ---');
        console.error(error);
        return sendApiError(res, error, 'Failed to save registration.');
    }
}
