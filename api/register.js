import { createClient } from '@supabase/supabase-js';
import { sendRegistrationConfirmation } from './_lib/email.js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
// In a server-side API, we should use the Service Role Key to bypass RLS
// If it's not available, we fall back to the Anon Key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL: Supabase environment variables are missing in .env');
}

const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export default async function handler(req, res) {
    if (!supabase) {
        return res.status(500).json({ error: 'Database connection not configured. Check your .env file.' });
    }
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

        // Prepare the lead data for Supabase
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

        // Save to Supabase
        const { data, error: sbError } = await supabase
            .from('event_registrations')
            .insert([registrationData])
            .select();

        if (sbError) {
            console.error('--- SUPABASE INSERT ERROR ---');
            console.error('Error Code:', sbError.code);
            console.error('Message:', sbError.message);
            console.error('Details:', sbError.details);
            console.error('Hint:', sbError.hint);
            return res.status(500).json({
                error: `Database Error: ${sbError.message}`,
                details: sbError.details
            });
        }

        // Log the lead
        console.log('New Lead Registered in Supabase:', data[0]);

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
                    id: data[0].id,
                    firstName: data[0].first_name,
                    email: data[0].email
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Registration successful',
            lead: {
                id: data[0].id,
                firstName: data[0].first_name,
                email: data[0].email
            }
        });

    } catch (error) {
        console.error('--- INTERNAL SERVER ERROR ---');
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

