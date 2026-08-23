import { saveCourseLead } from './_lib/dynamodb.js';
import { sendApiError } from './_lib/http-errors.js';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            courseInterest,
            notes,
            source = 'chatbot_course_interest'
        } = req.body;

        if (!firstName || !lastName || !email || !phone) {
            return res.status(400).json({ error: 'Missing required fields: firstName, lastName, email, phone' });
        }

        const savedLead = await saveCourseLead({
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            course_interest: courseInterest || 'wealth-mindset-academy',
            notes: notes || null,
            source
        });

        return res.status(200).json({
            success: true,
            message: 'Course interest captured successfully.',
            lead: {
                id: savedLead.id,
                firstName: savedLead.first_name,
                email: savedLead.email
            }
        });
    } catch (error) {
        console.error('--- INTERNAL SERVER ERROR (course lead) ---');
        console.error(error);
        return sendApiError(res, error, 'Failed to save course interest.');
    }
}
