import fs from 'fs/promises';
import path from 'path';
import { timingSafeEqual } from 'crypto';
import {
    deleteCmsEvent,
    listCmsEvents,
    saveCmsEvent
} from './_lib/dynamodb.js';
import { sendApiError } from './_lib/http-errors.js';

const adminPassword = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD;
const dataPath = path.join(process.cwd(), 'src', 'data.json');

function passwordsMatch(input, expected) {
    if (!input || !expected) return false;

    const inputBuffer = Buffer.from(input);
    const expectedBuffer = Buffer.from(expected);

    return inputBuffer.length === expectedBuffer.length
        && timingSafeEqual(inputBuffer, expectedBuffer);
}

function normalizeEvent(event) {
    const isCoronationEvent = event.type === 'coronation'
        || String(event.title || '').toLowerCase().includes('royal coronation');

    return {
        id: event.id ?? Date.now(),
        title: event.title || 'Untitled Event',
        type: event.type || 'seminar',
        city: event.city || '',
        date: event.date || '',
        displayDate: event.displayDate || event.date || '',
        time: event.time || '',
        venue: event.venue || '',
        address: event.address || '',
        capacity: Number(event.capacity) || 0,
        registered: Number(event.registered) || 0,
        image: event.image || '',
        status: isCoronationEvent ? 'free' : (event.status || 'open'),
        description: event.description || '',
        priceSA: isCoronationEvent ? 0 : (Number(event.priceSA) || 0),
        priceUS: isCoronationEvent ? 0 : (Number(event.priceUS) || 0),
        registrationRequired: isCoronationEvent ? false : event.registrationRequired !== false
    };
}

async function getEvents() {
    try {
        const cmsEvents = await listCmsEvents();
        if (cmsEvents.length > 0) return cmsEvents.map(normalizeEvent);
    } catch (error) {
        if (error.statusCode !== 500) throw error;
    }

    const file = JSON.parse(await fs.readFile(dataPath, 'utf8'));
    return (file.events || []).map(normalizeEvent);
}

async function saveEventsToFile(events) {
    const file = JSON.parse(await fs.readFile(dataPath, 'utf8'));
    file.events = events;
    await fs.writeFile(dataPath, `${JSON.stringify(file, null, 4)}\n`);
}

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method === 'GET') {
        try {
            const events = await getEvents();
            return res.status(200).json({ events });
        } catch (error) {
            console.error('--- EVENTS GET ERROR ---');
            console.error(error);
            return sendApiError(res, error, 'Failed to load events.');
        }
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!adminPassword) {
        return res.status(500).json({ error: 'Admin password is not configured.' });
    }

    if (!passwordsMatch(req.body?.password, adminPassword)) {
        return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    const events = Array.isArray(req.body?.events)
        ? req.body.events.map(normalizeEvent)
        : null;

    if (!events) {
        return res.status(400).json({ error: 'Events must be an array.' });
    }

    try {
        let savedTo = 'file';

        try {
            const currentEvents = await listCmsEvents();
            const nextIds = new Set(events.map(event => String(event.id)));

            await Promise.all([
                ...events.map(event => saveCmsEvent(event)),
                ...currentEvents
                    .filter(event => !nextIds.has(String(event.id)))
                    .map(event => deleteCmsEvent(event.id))
            ]);

            savedTo = 'dynamodb';
        } catch (error) {
            if (error.statusCode !== 500) throw error;
            await saveEventsToFile(events);
        }

        return res.status(200).json({ events, savedTo });
    } catch (error) {
        console.error('--- EVENTS SAVE ERROR ---');
        console.error(error);
        return sendApiError(res, error, 'Failed to save events.');
    }
}
