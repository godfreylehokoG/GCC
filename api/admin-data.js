import { timingSafeEqual } from 'crypto';
import { listChatHistory, listCourseLeads, listEventRegistrations, listLeads } from './_lib/dynamodb.js';
import { sendApiError } from './_lib/http-errors.js';

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
        const [leads, registrations, courseLeads, chatHistory] = await Promise.all([
            listLeads(),
            listEventRegistrations(),
            listCourseLeads().catch(error => {
                console.warn('Course leads unavailable:', error.message);
                return [];
            }),
            listChatHistory().catch(error => {
                console.warn('Chat history unavailable:', error.message);
                return [];
            })
        ]);

        return res.status(200).json({ leads, registrations, courseLeads, chatHistory });
    } catch (error) {
        console.error('--- ADMIN DATA ERROR ---');
        console.error(error);
        return sendApiError(res, error, 'Failed to load admin data.');
    }
}
