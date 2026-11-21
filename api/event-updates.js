import { saveLead } from './_lib/dynamodb.js';
import { sendApiError } from './_lib/http-errors.js';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';

    if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
        return res.status(400).json({ error: 'Enter a valid name and email address.' });
    }

    const [firstName, ...lastNameParts] = name.split(/\s+/);

    try {
        await saveLead({
            first_name: firstName,
            last_name: lastNameParts.join(' '),
            email,
            interest: 'upcoming_event_announcements',
            marketing_consent: true,
            source: 'event_updates_subscription'
        });

        return res.status(200).json({
            success: true,
            message: 'You are subscribed to upcoming event announcements.'
        });
    } catch (error) {
        console.error('--- EVENT UPDATES SUBSCRIPTION ERROR ---');
        console.error(error);
        return sendApiError(res, error, 'Unable to subscribe for event updates.');
    }
}
