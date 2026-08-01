import { timingSafeEqual } from 'crypto';
import { listEventRegistrations, listLeads } from './_lib/dynamodb.js';

const adminPassword = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD;

function passwordsMatch(input, expected) {
    if (!input || !expected) return false;

    const inputBuffer = Buffer.from(input);
    const expectedBuffer = Buffer.from(expected);

    return inputBuffer.length === expectedBuffer.length
        && timingSafeEqual(inputBuffer, expectedBuffer);
}

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!adminPassword) {
        return res.status(500).json({ error: 'Admin password is not configured.' });
    }

    const password = req.body?.password;

    if (!passwordsMatch(password, adminPassword)) {
        return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    try {
        const [leads, registrations] = await Promise.all([
            listLeads(),
            listEventRegistrations()
        ]);

        return res.status(200).json({ leads, registrations });
    } catch (error) {
        console.error('--- ADMIN DATA ERROR ---');
        console.error(error);
        return res.status(error.statusCode || 500).json({
            error: error.statusCode ? error.message : 'Failed to load admin data.'
        });
    }
}
