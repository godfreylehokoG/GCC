import { createClient } from '@supabase/supabase-js';
import { sendLeadConfirmation } from './_lib/email.js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
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
        const { firstName, lastName, email, phone, interest } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone) {
            return res.status(400).json({ error: 'Missing required fields: firstName, lastName, email, phone' });
        }

        // Prepare the lead data for Supabase
        const leadData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            interest: interest || 'general',
            source: 'lead_form',
            created_at: new Date().toISOString()
        };

        // Save to Supabase
        const { data, error: sbError } = await supabase
            .from('leads')
            .insert([leadData])
            .select();

        if (sbError) {
            console.error('--- SUPABASE INSERT ERROR (leads) ---');
            console.error('Error Code:', sbError.code);
            console.error('Message:', sbError.message);
            console.error('Details:', sbError.details);
            console.error('Hint:', sbError.hint);
            return res.status(500).json({
                error: `Database Error: ${sbError.message}`,
                details: sbError.details
            });
        }

        console.log('New Lead Captured in Supabase:', data[0]);

        // Fire-and-forget email notification
        sendLeadConfirmation({ firstName, email })
            .catch(err => console.error('Silent Email Failure:', err));

        return res.status(200).json({
            success: true,
            message: 'Lead captured successfully',
            lead: {
                id: data[0].id,
                firstName: data[0].first_name,
                email: data[0].email
            }
        });

    } catch (error) {
        console.error('--- INTERNAL SERVER ERROR (lead) ---');
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
