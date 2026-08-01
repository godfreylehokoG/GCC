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
            eventId, eventTitle, paymentReference, amount, currency, status
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !fullPhone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Prepare the registration data for DynamoDB
        const registrationData = {
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
            event_id: eventId || null,
            event_title: eventTitle || null,
            payment_reference: paymentReference || null,
            payment_amount: amount || 0,
            payment_currency: currency || null,
            payment_status: status || 'confirmed',
            source: 'website'
        };

        // Save to AWS DynamoDB
        const savedRegistration = await saveEventRegistration(registrationData);

        // Log the lead
        console.log('New Lead Registered in DynamoDB:', savedRegistration);

        // Send email notification and wait for result for debugging
        const emailResult = await sendRegistrationConfirmation(
            { firstName, email },
            {
                title: eventTitle,
                displayDate: req.body.eventDisplayDate,
                venue: req.body.eventVenue,
                time: req.body.eventTime,
                address: req.body.eventAddress,
                paymentReference: paymentReference,
                amount: amount,
                currency: currency
            }
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
