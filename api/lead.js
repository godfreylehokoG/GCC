import { sendLeadConfirmation } from './_lib/email.js';
import { saveLead } from './_lib/dynamodb.js';
import { sendApiError } from './_lib/http-errors.js';

export default async function handler(req, res) {
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

        // Prepare the lead data for DynamoDB
        const leadData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            interest: interest || 'general',
            source: 'lead_form'
        };

        // Save to AWS DynamoDB
        const savedLead = await saveLead(leadData);

        console.log('New Lead Captured in DynamoDB:', savedLead);

        // Fire-and-forget email notification
        sendLeadConfirmation({ firstName, email })
            .catch(err => console.error('Silent Email Failure:', err));

        return res.status(200).json({
            success: true,
            message: 'Lead captured successfully',
            lead: {
                id: savedLead.id,
                firstName: savedLead.first_name,
                email: savedLead.email
            }
        });

    } catch (error) {
        console.error('--- INTERNAL SERVER ERROR (lead) ---');
        console.error(error);
        return sendApiError(res, error, 'Failed to save lead.');
    }
}
