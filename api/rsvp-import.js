import { timingSafeEqual, randomUUID } from 'crypto';
import { saveEventRegistration } from './_lib/dynamodb.js';
import { sendApiError } from './_lib/http-errors.js';

const adminPassword = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD;

function passwordsMatch(input, expected) {
    if (!input || !expected) return false;

    const inputBuffer = Buffer.from(input);
    const expectedBuffer = Buffer.from(expected);

    return inputBuffer.length === expectedBuffer.length
        && timingSafeEqual(inputBuffer, expectedBuffer);
}

function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = '';
    let inQuotes = false;

    for (let index = 0; index < text.length; index += 1) {
        const char = text[index];
        const nextChar = text[index + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                cell += '"';
                index += 1;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (char === ',' && !inQuotes) {
            row.push(cell.trim());
            cell = '';
            continue;
        }

        if ((char === '\n' || char === '\r') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') index += 1;
            row.push(cell.trim());
            if (row.some(value => value !== '')) rows.push(row);
            row = [];
            cell = '';
            continue;
        }

        cell += char;
    }

    row.push(cell.trim());
    if (row.some(value => value !== '')) rows.push(row);

    if (rows.length < 2) return [];

    const headers = rows[0];
    return rows.slice(1).map(values => headers.reduce((record, header, index) => ({
        ...record,
        [header]: values[index] || ''
    }), {}));
}

function parseNumber(value, fallback = 0) {
    const number = Number(String(value || '').replace(/[^0-9.-]/g, ''));
    return Number.isFinite(number) ? number : fallback;
}

function splitName(fullName, fallback = 'Guest') {
    const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return { firstName: fallback, lastName: '' };
    }

    return {
        firstName: parts[0],
        lastName: parts.slice(1).join(' ')
    };
}

function parseGuestNames(value, primaryName, totalGuests) {
    const names = String(value || '')
        .split(';')
        .map(item => item.replace(/^\s*\d+\)\s*/, '').trim())
        .filter(Boolean);

    if (names.length === 0 && primaryName) names.push(primaryName);

    while (names.length < totalGuests) {
        names.push(`Guest ${names.length + 1}`);
    }

    return names.slice(0, Math.max(totalGuests, names.length));
}

function parseEventAttendances(value, fallbackCount) {
    return String(value || '')
        .split(';')
        .map(item => item.trim())
        .filter(Boolean)
        .map(item => {
            const match = item.match(/^(.*?)\s*\((\d+)\)\s*$/);
            return {
                title: match ? match[1].trim() : item,
                count: match ? parseNumber(match[2], fallbackCount) : fallbackCount
            };
        });
}

function buildRowError(rowIndex, message) {
    return Object.assign(new Error(`Row ${rowIndex}: ${message}`), { statusCode: 400 });
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

    if (!passwordsMatch(req.body?.password, adminPassword)) {
        return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    try {
        const csv = String(req.body?.csv || '').trim();
        const eventMappings = req.body?.eventMappings || {};

        if (!csv) {
            return res.status(400).json({ error: 'CSV content is required.' });
        }

        const rows = parseCsv(csv);
        const importBatchId = randomUUID();

        if (rows.length === 0) {
            return res.status(400).json({ error: 'No RSVP rows found in the CSV.' });
        }

        const registrationRows = [];

        rows.forEach((row, rowIndex) => {
            const rowNumber = rowIndex + 2;
            const primaryContactName = row['Primary Contact Name'] || row.Name || row.name;
            const totalGuests = Math.max(1, parseNumber(row['Total Guests'], 1));
            const guestNames = parseGuestNames(row['Guest Details'], primaryContactName, totalGuests);
            const eventAttendances = parseEventAttendances(row['Events Attending'], totalGuests);
            const registrationGroupId = randomUUID();

            if (!primaryContactName) {
                throw buildRowError(rowNumber, 'Primary Contact Name is required.');
            }

            if (!row.Email) {
                throw buildRowError(rowNumber, 'Email is required.');
            }

            if (eventAttendances.length === 0) {
                throw buildRowError(rowNumber, 'Events Attending is required.');
            }

            eventAttendances.forEach(eventAttendance => {
                const mappedEvent = eventMappings[eventAttendance.title];

                if (!mappedEvent?.title) {
                    throw buildRowError(rowNumber, `No site event mapping selected for "${eventAttendance.title}".`);
                }

                const attendeeCount = Math.max(1, eventAttendance.count || totalGuests);
                const attendees = [...guestNames];

                while (attendees.length < attendeeCount) {
                    attendees.push(`Guest ${attendees.length + 1}`);
                }

                attendees.slice(0, attendeeCount).forEach((attendeeName, attendeeIndex) => {
                    const { firstName, lastName } = splitName(attendeeName, `Guest ${attendeeIndex + 1}`);

                    registrationRows.push({
                        first_name: firstName,
                        last_name: lastName,
                        email: row.Email,
                        phone: row.Telephone || null,
                        country: row.Country || null,
                        city: null,
                        interest: 'rsvp',
                        marketing_consent: false,
                        event_id: mappedEvent.id ? String(mappedEvent.id) : null,
                        event_title: mappedEvent.title,
                        external_event_title: eventAttendance.title,
                        payment_reference: null,
                        payment_amount: 0,
                        payment_total: 0,
                        payment_currency: null,
                        payment_status: 'Confirmed',
                        registration_group_id: registrationGroupId,
                        booker_first_name: splitName(primaryContactName).firstName,
                        booker_last_name: splitName(primaryContactName).lastName,
                        booker_email: row.Email,
                        booker_phone: row.Telephone || null,
                        primary_contact_name: primaryContactName,
                        attendee_type: attendeeIndex === 0 ? 'primary' : 'guest',
                        attendee_index: attendeeIndex,
                        attendee_label: attendeeIndex === 0 ? 'Primary' : `Guest ${attendeeIndex}`,
                        attendee_details_provided: true,
                        guest_count: Math.max(0, totalGuests - 1),
                        guest_details_collected: true,
                        rsvp_total_guests: totalGuests,
                        rsvp_guest_details: row['Guest Details'] || null,
                        title: row.Title || null,
                        organisation: row.Organisation || null,
                        vip_status: row['VIP Status'] || null,
                        gala_seating_selection: row['Gala Seating Selection'] || null,
                        airport_transport_required: row['Airport Transport Required'] || null,
                        local_transport_required: row['Local Transport Required'] || null,
                        dietary_restrictions: row['Dietary Restrictions'] || null,
                        accessibility_requests: row['Accessibility & Special Requests'] || null,
                        source: 'rsvp_csv_import',
                        import_batch_id: importBatchId
                    });
                });
            });
        });

        const savedRegistrations = await Promise.all(registrationRows.map(saveEventRegistration));

        return res.status(200).json({
            success: true,
            importedGroups: rows.length,
            importedRows: savedRegistrations.length
        });
    } catch (error) {
        console.error('--- RSVP IMPORT ERROR ---');
        console.error(error);
        if (error.statusCode === 400) {
            return res.status(400).json({ error: error.message });
        }
        return sendApiError(res, error, 'Failed to import RSVP registrations.');
    }
}
