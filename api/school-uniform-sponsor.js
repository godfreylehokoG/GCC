import { saveLead } from './_lib/dynamodb.js';
import { sendApiError } from './_lib/http-errors.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            country,
            city,
            sponsorshipType,
            amount,
            paymentMethod,
            paymentReference,
            notes
        } = req.body;

        if (!firstName || !lastName || !email || !phone || !city) {
            return res.status(400).json({ error: 'Missing required sponsor details.' });
        }

        const leadData = {
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            country: country || null,
            city: city || null,
            interest: 'school-uniform-sponsor',
            sponsorship_type: sponsorshipType || 'general-contribution',
            sponsorship_amount: amount ? Number(amount) : null,
            payment_method: paymentMethod || null,
            payment_reference: paymentReference || `${firstName} ${lastName}`,
            notes: notes || null,
            source: 'school_uniform_sponsor'
        };

        const savedLead = await saveLead(leadData);

        return res.status(200).json({
            success: true,
            message: 'Sponsor registration captured successfully.',
            lead: {
                id: savedLead.id,
                firstName: savedLead.first_name,
                email: savedLead.email
            }
        });
    } catch (error) {
        console.error('--- INTERNAL SERVER ERROR (school uniform sponsor) ---');
        console.error(error);
        return sendApiError(res, error, 'Failed to save sponsor registration.');
    }
}
