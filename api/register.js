// Vercel Serverless Function - Lead Registration
// This endpoint handles lead capture for the GGC website

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { firstName, lastName, email, phone, interest, eventId } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Log the lead (In Phase 2, this will save to Supabase)
        const lead = {
            id: Date.now(),
            firstName,
            lastName,
            email,
            phone: phone || null,
            interest: interest || 'general',
            eventId: eventId || null,
            createdAt: new Date().toISOString(),
            source: 'website'
        };

        console.log('New Lead Captured:', lead);

        // TODO: Phase 2 - Save to Supabase
        // const { data, error } = await supabase
        //   .from('leads')
        //   .insert([lead]);

        // TODO: Phase 2 - Send confirmation email via Resend
        // await resend.emails.send({
        //   from: 'noreply@ggc.com',
        //   to: email,
        //   subject: 'Welcome to GGC!',
        //   html: `<p>Hi ${firstName}, thank you for registering...</p>`
        // });

        return res.status(200).json({
            success: true,
            message: 'Registration successful',
            lead: {
                id: lead.id,
                firstName: lead.firstName,
                email: lead.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
