import { sendRegistrationConfirmation } from './_lib/email.js';
import { saveEventRegistration } from './_lib/dynamodb.js';
import { sendApiError } from './_lib/http-errors.js';

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
            events
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

        // Prepare the shared registration data for DynamoDB
        const baseRegistrationData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: fullPhone || phone,
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
            payment_status: status || 'confirmed',
            source: 'website'
        };

        // Save one row per selected event so reporting still groups by event.
        const savedRegistrations = await Promise.all(selectedEvents.map(event => saveEventRegistration({
            ...baseRegistrationData,
            event_id: event.id || null,
            event_title: event.title || null,
            payment_amount: event.amount ?? amount ?? 0,
            payment_currency: event.currency || currency || null
        })));
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
                currency
            }
            : {
                title: selectedEvents[0]?.title || eventTitle,
                displayDate: selectedEvents[0]?.displayDate || req.body.eventDisplayDate,
                venue: selectedEvents[0]?.venue || req.body.eventVenue,
                time: selectedEvents[0]?.time || req.body.eventTime,
                address: selectedEvents[0]?.address || req.body.eventAddress,
                paymentReference,
                amount,
                currency
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
