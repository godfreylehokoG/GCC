import fs from 'fs/promises';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src', 'data.json');
const publicPath = path.join(process.cwd(), 'public');
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

export async function retrieveSiteContext(question, limit = 5) {
    const chunks = await getSiteContextChunks();
    const terms = tokenize(question);

    return chunks
        .map(chunk => ({ ...chunk, score: scoreChunk(chunk, terms) }))
        .filter(chunk => chunk.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}

export function isCourseQuestion(message) {
    const normalized = message.toLowerCase();
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
    return events.map(event => ({
        type: 'event',
        title: event.title,
        text: `Event: ${event.title}. City: ${event.city}. Date: ${event.displayDate || event.date || 'TBD'}. Venue: ${event.venue || 'TBD'}. ${event.description || ''}`
    }));
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

function tokenize(input) {
    return String(input || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter(term => term.length > 2);
}
