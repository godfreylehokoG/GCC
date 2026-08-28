import fs from 'fs/promises';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src', 'data.json');
const publicPath = path.join(process.cwd(), 'public');
const TODAY = '2026-08-28';
let cachedChunks;

export async function getSiteContextChunks() {
    if (cachedChunks) return cachedChunks;

    const siteData = JSON.parse(await fs.readFile(dataPath, 'utf8'));
    const publicDocumentChunks = await buildPublicDocumentChunks();

    cachedChunks = [
        ...buildCurriculumChunks(siteData.curriculum || []),
        ...buildLessonChunks(siteData.lessons || []),
        ...buildTrainingChunks(siteData.trainings || {}),
        ...buildServiceChunks(siteData.services || []),
        ...buildPhilosophyChunks(siteData.philosophy || {}),
        ...buildAboutChunks(siteData.about || {}),
        ...buildBookChunks(siteData.book || {}),
        ...buildEventChunks(siteData.events || []),
        ...publicDocumentChunks
    ];

    return cachedChunks;
}

export async function retrieveSiteContext(question, options = {}) {
    const { limit = 5, intent = classifyIntent(question) } = options;
    const chunks = await getSiteContextChunks();
    const terms = tokenize(question);
    const allowedTypes = getAllowedTypesForIntent(intent);

    return chunks
        .filter(chunk => allowedTypes ? allowedTypes.includes(chunk.type) : true)
        .filter(chunk => intent !== 'event_question' || isUpcomingEventChunk(chunk))
        .map(chunk => ({ ...chunk, score: scoreChunk(chunk, terms) }))
        .filter(chunk => chunk.score > 0 || intent === 'event_question' || intent === 'course_question')
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}

export function classifyIntent(message) {
    const normalized = String(message || '').toLowerCase();

    if (containsAny(normalized, ['invest', 'investment', 'buy', 'sell', 'price prediction', 'profit', 'return on investment', 'roi'])) {
        return 'investment_guardrail';
    }

    if (containsAny(normalized, ['contact', 'email', 'admin', 'support', 'help', 'speak to', 'talk to', 'communicate'])) {
        return 'contact_question';
    }

    if (containsAny(normalized, ['event', 'events', 'seminar', 'seminars', 'tour', 'gala', 'coronation', 'upcoming', 'date', 'dates', 'venue', 'ticket'])) {
        return 'event_question';
    }

    if (isCourseQuestion(normalized)) {
        return 'course_question';
    }

    return 'general_question';
}

export function isCourseQuestion(message) {
    const normalized = String(message || '').toLowerCase();
    return [
        'course',
        'courses',
        'curriculum',
        'academy',
        'class',
        'classes',
        'lesson',
        'lessons',
        'training',
        'trainings',
        '12-week',
        '12 week',
        'start date',
        'starts',
        'enroll',
        'programme',
        'program'
    ].some(term => normalized.includes(term));
}

function buildCurriculumChunks(curriculum) {
    return curriculum.map(item => ({
        type: 'course_week',
        title: `Week ${item.week}: ${item.title}`,
        text: `Course curriculum week ${item.week}: ${item.title}. Focus: ${item.focus}. This is part of the Wealth Mindset 12-week roadmap.`
    }));
}

function buildLessonChunks(lessons) {
    return lessons.map(lesson => ({
        type: 'lesson',
        title: lesson.title,
        text: `Recorded masterclass: ${lesson.title}. ${lesson.description} Category: ${lesson.category}. Level: ${lesson.level}. Duration: ${lesson.duration}.`
    }));
}

function buildTrainingChunks(trainings) {
    const chunks = [];

    if (trainings.schedule) {
        chunks.push({
            type: 'training_schedule',
            title: 'Live Zoom Trainings',
            text: `Live Zoom Trainings schedule: ${trainings.schedule}. Courses and academy sessions will go live soon. Visitors can register interest to be notified.`
        });
    }

    if (trainings.nextSession) {
        chunks.push({
            type: 'training_session',
            title: trainings.nextSession.title,
            text: `Training session: ${trainings.nextSession.title}. Description: ${trainings.nextSession.description}. Courses and academy sessions will go live soon; collect interest before confirming start dates.`
        });
    }

    for (const item of trainings.upcoming || []) {
        chunks.push({
            type: 'training_upcoming',
            title: item.title,
            text: `Upcoming training topic: ${item.title}. Time: ${item.time || 'TBD'}. Course start dates should be described as going live soon.`
        });
    }

    return chunks;
}

function buildServiceChunks(services) {
    return services.map(service => ({
        type: 'service',
        title: service.title,
        text: `${service.title}: ${service.desc}`
    }));
}

function buildPhilosophyChunks(philosophy) {
    const chunks = [];

    if (philosophy.quote) {
        chunks.push({
            type: 'philosophy',
            title: 'Core Philosophy',
            text: `Core philosophy: ${philosophy.quote}`
        });
    }

    for (const item of philosophy.solutions || []) {
        chunks.push({
            type: 'philosophy_solution',
            title: item.title,
            text: `${item.title}: ${item.desc}`
        });
    }

    return chunks;
}

function buildAboutChunks(about) {
    return Object.values(about)
        .filter(item => item && typeof item === 'object' && item.title && item.description)
        .map(item => ({
            type: 'about',
            title: item.title,
            text: `${item.title}: ${item.description}`
        }));
}

function buildBookChunks(book) {
    if (!book?.title) return [];

    return [{
        type: 'book',
        title: book.title,
        text: `${book.title}: ${book.tagline}. Release: ${book.releaseDate}. ${book.preface || ''}`
    }];
}

function buildEventChunks(events) {
    return events
        .slice()
        .sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')))
        .map(event => ({
            type: 'event',
            title: event.title,
            date: event.date || null,
            text: [
                `Event: ${event.title}.`,
                `Type: ${event.type || 'event'}.`,
                `City: ${event.city || 'TBD'}.`,
                `Date: ${event.displayDate || event.date || 'TBD'}.`,
                `Time: ${event.time || 'TBD'}.`,
                `Venue: ${formatPlace(event.venue)}.`,
                `Address: ${formatPlace(event.address)}.`,
                `Status: ${event.status || 'open'}.`,
                `Price: ${formatEventPrice(event)}.`,
                event.registrationRequired === false ? 'Registration is not required.' : 'Registration is required or available.',
                event.description || ''
            ].join(' ')
        }));
}

function formatEventPrice(event) {
    const priceSA = Number(event.priceSA);
    const priceUS = Number(event.priceUS);
    const hasSA = Number.isFinite(priceSA);
    const hasUS = Number.isFinite(priceUS);

    if (hasSA && hasUS && priceSA === 0 && priceUS === 0) {
        return 'Free';
    }

    if (hasSA && hasUS) {
        return `R${priceSA} for South Africa / $${priceUS} international`;
    }

    if (hasSA) {
        return priceSA === 0 ? 'Free' : `R${priceSA} for South Africa`;
    }

    if (hasUS) {
        return priceUS === 0 ? 'Free' : `$${priceUS} international`;
    }

    return 'To be confirmed';
}

function formatPlace(value) {
    return value && value !== 'TBD' ? value : 'To be confirmed';
}

async function buildPublicDocumentChunks() {
    try {
        const files = await fs.readdir(publicPath);
        return files
            .filter(file => /\.(pdf|docx|doc|txt)$/i.test(file))
            .map(file => ({
                type: 'document',
                title: file,
                text: `Public document available on the website: ${file}. This file may contain additional Wealth Mindset supporting material.`
            }));
    } catch (error) {
        console.warn('Unable to scan public documents for chatbot context:', error.message);
        return [];
    }
}

function scoreChunk(chunk, terms) {
    const searchable = `${chunk.title} ${chunk.text}`.toLowerCase();
    return terms.reduce((score, term) => score + (searchable.includes(term) ? term.length : 0), 0);
}

function getAllowedTypesForIntent(intent) {
    switch (intent) {
        case 'event_question':
            return ['event'];
        case 'course_question':
            return ['course_week', 'lesson', 'training_schedule', 'training_session', 'training_upcoming', 'service'];
        case 'contact_question':
            return ['about', 'service', 'philosophy'];
        case 'investment_guardrail':
            return ['philosophy', 'philosophy_solution', 'about'];
        default:
            return null;
    }
}

function isUpcomingEventChunk(chunk) {
    return chunk.type !== 'event' || !chunk.date || chunk.date >= TODAY;
}

function containsAny(text, terms) {
    return terms.some(term => text.includes(term));
}

function tokenize(input) {
    return String(input || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter(term => term.length > 2);
}
