import { useState } from 'react';
import {
    Users, Calendar, Download, LogOut, Eye, EyeOff,
    TrendingUp, Mail, Phone, MapPin, RefreshCw, Shield,
    Search, BarChart2, Contact2, ClipboardList, Activity,
    Plus, Save, Trash2, Edit3, X, Upload, FileText
} from 'lucide-react';
import siteData from '../data.json';

// Colour palette for charts
const CHART_COLORS = [
    '#818cf8', '#a78bfa', '#34d399', '#fbbf24', '#f87171',
    '#38bdf8', '#f472b6', '#a3e635'
];

const emptyEvent = {
    id: '',
    title: '',
    type: 'seminar',
    city: '',
    date: '',
    displayDate: '',
    time: '',
    venue: '',
    address: '',
    capacity: 0,
    registered: 0,
    image: '',
    status: 'open',
    description: '',
    priceSA: 0,
    priceUS: 0,
    registrationRequired: true,
    visibility: 'public'
};

const standardRsvpProgrammeEvents = [
    {
        id: 1001,
        title: 'African Heritage Celebration',
        type: 'programme',
        city: 'Johannesburg',
        date: '2026-09-24',
        displayDate: 'Thu. September 24, 2026',
        time: 'TBD',
        venue: 'TBD',
        address: 'TBD',
        image: '/Mzilikazi-Royal.png',
        status: 'private-rsvp',
        description: 'Private RSVP programme session for African heritage celebration attendance tracking.'
    },
    {
        id: 1002,
        title: 'Legacy of King Mzilikazi',
        type: 'programme',
        city: 'Johannesburg',
        date: '2026-09-25',
        displayDate: 'Fri. September 25, 2026',
        time: 'TBD',
        venue: 'TBD',
        address: 'TBD',
        image: '/Mzilikazi-Royal.png',
        status: 'private-rsvp',
        description: 'Private RSVP programme session for Legacy of King Mzilikazi attendance tracking.'
    },
    {
        id: 1003,
        title: 'Royal Coronation',
        type: 'programme',
        city: 'Johannesburg',
        date: '2026-09-26',
        displayDate: 'Sat. September 26, 2026',
        time: '10:00 - 15:00',
        venue: 'TBD',
        address: 'TBD',
        image: '/Mzilikazi-Royal.png',
        status: 'private-rsvp',
        description: 'Private RSVP programme session for Royal Coronation attendance tracking.'
    },
    {
        id: 1004,
        title: 'Royal Gala',
        type: 'programme',
        city: 'Johannesburg',
        date: '2026-09-26',
        displayDate: 'Sat. September 26, 2026',
        time: '18:00 - 00:00',
        venue: 'TBD',
        address: 'TBD',
        image: '/images/gala.jpg',
        status: 'private-rsvp',
        description: 'Private RSVP programme session for Royal Gala attendance tracking.'
    },
    {
        id: 1005,
        title: 'Wealth Mindset Conference',
        type: 'programme',
        city: 'Johannesburg',
        date: '2026-09-27',
        displayDate: 'Sun. September 27, 2026',
        time: '10:00 - 15:00',
        venue: 'TBD',
        address: 'TBD',
        image: '/images/durban.jpg',
        status: 'private-rsvp',
        description: 'Private RSVP programme session for Wealth Mindset Conference attendance tracking.'
    }
].map(event => ({
    ...event,
    capacity: 0,
    registered: 0,
    priceSA: 0,
    priceUS: 0,
    registrationRequired: true,
    visibility: 'private'
}));

function normalizeEventForm(event) {
    return {
        ...emptyEvent,
        ...event,
        id: event.id || Date.now(),
        capacity: Number(event.capacity) || 0,
        registered: Number(event.registered) || 0,
        priceSA: Number(event.priceSA) || 0,
        priceUS: Number(event.priceUS) || 0,
        registrationRequired: event.registrationRequired !== false,
        visibility: event.visibility === 'private' ? 'private' : 'public'
    };
}

// --- Utility: Export to Excel ---
function exportToExcel(data, filename) {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const sheetRows = [
        headers,
        ...data.map(row => headers.map(header => formatExportValue(row[header])))
    ];
    const worksheet = buildWorksheetXml(sheetRows);
    const workbookParts = {
        '[Content_Types].xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
        '_rels/.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
        'xl/workbook.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Export" sheetId="1" r:id="rId1"/></sheets></workbook>`,
        'xl/_rels/workbook.xml.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
        'xl/styles.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1F2937"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`,
        'xl/worksheets/sheet1.xml': worksheet
    };
    const blob = new Blob([createZip(workbookParts)], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    downloadBlob(blob, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

function formatExportValue(value) {
    if (value == null) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}

function buildWorksheetXml(rows) {
    const columnCount = rows[0]?.length || 1;
    const lastCell = `${getExcelColumnName(columnCount)}${rows.length}`;
    const columns = Array.from({ length: columnCount }, (_, index) => {
        const width = Math.min(48, Math.max(14, ...rows.map(row => String(row[index] || '').length + 2)));
        return `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`;
    }).join('');
    const sheetData = rows.map((row, rowIndex) => {
        const cells = row.map((value, columnIndex) => {
            const cellRef = `${getExcelColumnName(columnIndex + 1)}${rowIndex + 1}`;
            const style = rowIndex === 0 ? ' s="1"' : '';
            return `<c r="${cellRef}" t="inlineStr"${style}><is><t>${escapeXml(value)}</t></is></c>`;
        }).join('');
        return `<row r="${rowIndex + 1}">${cells}</row>`;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${columns}</cols><sheetData>${sheetData}</sheetData><autoFilter ref="A1:${lastCell}"/></worksheet>`;
}

function getExcelColumnName(number) {
    let name = '';
    let next = number;

    while (next > 0) {
        next -= 1;
        name = String.fromCharCode(65 + (next % 26)) + name;
        next = Math.floor(next / 26);
    }

    return name;
}

function escapeXml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function createZip(files) {
    const encoder = new TextEncoder();
    const fileEntries = Object.entries(files).map(([path, content]) => ({
        path,
        data: encoder.encode(content)
    }));
    const chunks = [];
    const centralDirectory = [];
    let offset = 0;

    fileEntries.forEach(file => {
        const pathBytes = encoder.encode(file.path);
        const crc = crc32(file.data);
        const localHeader = concatUint8Arrays(
            uint32(0x04034b50),
            uint16(20),
            uint16(0),
            uint16(0),
            uint16(0),
            uint16(0),
            uint32(crc),
            uint32(file.data.length),
            uint32(file.data.length),
            uint16(pathBytes.length),
            uint16(0),
            pathBytes
        );

        chunks.push(localHeader, file.data);
        centralDirectory.push({
            pathBytes,
            crc,
            size: file.data.length,
            offset
        });
        offset += localHeader.length + file.data.length;
    });

    const centralChunks = centralDirectory.map(file => concatUint8Arrays(
        uint32(0x02014b50),
        uint16(20),
        uint16(20),
        uint16(0),
        uint16(0),
        uint16(0),
        uint16(0),
        uint32(file.crc),
        uint32(file.size),
        uint32(file.size),
        uint16(file.pathBytes.length),
        uint16(0),
        uint16(0),
        uint16(0),
        uint16(0),
        uint32(0),
        uint32(file.offset),
        file.pathBytes
    ));
    const centralSize = centralChunks.reduce((total, chunk) => total + chunk.length, 0);
    const endRecord = concatUint8Arrays(
        uint32(0x06054b50),
        uint16(0),
        uint16(0),
        uint16(centralDirectory.length),
        uint16(centralDirectory.length),
        uint32(centralSize),
        uint32(offset),
        uint16(0)
    );

    return concatUint8Arrays(...chunks, ...centralChunks, endRecord);
}

function crc32(data) {
    let crc = -1;

    for (let index = 0; index < data.length; index += 1) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ data[index]) & 0xff];
    }

    return (crc ^ -1) >>> 0;
}

const crcTable = Array.from({ length: 256 }, (_, index) => {
    let crc = index;
    for (let bit = 0; bit < 8; bit += 1) {
        crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
    return crc >>> 0;
});

function uint16(value) {
    return new Uint8Array([value & 0xff, (value >>> 8) & 0xff]);
}

function uint32(value) {
    return new Uint8Array([
        value & 0xff,
        (value >>> 8) & 0xff,
        (value >>> 16) & 0xff,
        (value >>> 24) & 0xff
    ]);
}

function concatUint8Arrays(...arrays) {
    const output = new Uint8Array(arrays.reduce((total, array) => total + array.length, 0));
    let offset = 0;

    arrays.forEach(array => {
        output.set(array, offset);
        offset += array.length;
    });

    return output;
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// --- Login Gate ---
function LoginGate({ onLogin }) {
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await onLogin(password);
            if (!result.success) {
                setError(result.error || 'Incorrect password. Please try again.');
            }
        } catch {
            setError('Unable to access dashboard. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0b0f2b] via-[#0d112e] to-[#05060f] flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <img src="/WealthMindset-removebg.png" alt="Logo" className="h-16 w-auto mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
                    <p className="text-gray-400 text-sm mt-2">The Wealth Mindset · Secure Access</p>
                </div>
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                            <Shield size={20} className="text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold">Secure Login</h2>
                            <p className="text-gray-500 text-xs">Enter your admin credentials</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Admin Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError(''); }}
                                    placeholder="Enter password"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {error && <p className="mt-2 text-red-400 text-xs">{error}</p>}
                        </div>
                        <button type="submit" disabled={loading || !password}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                            {loading ? <RefreshCw size={18} className="animate-spin" /> : null}
                            {loading ? 'Verifying...' : 'Access Dashboard'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// --- Stat Card ---
function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={22} className="text-white" />
            </div>
            <div>
                <p className="text-gray-400 text-xs uppercase tracking-widest">{label}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
}

// --- Bar Chart: Registrations per Event ---
function EventBarChart({ registrations }) {
    // Group by event_title
    const counts = {};
    registrations.forEach(r => {
        const title = r.event_title || 'Unknown';
        counts[title] = (counts[title] || 0) + 1;
    });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const max = entries[0]?.[1] || 1;

    if (entries.length === 0) return (
        <div className="flex items-center justify-center h-48 text-gray-500 text-sm">No registration data yet.</div>
    );

    return (
        <div className="space-y-4">
            {entries.map(([title, count], i) => {
                const pct = Math.round((count / max) * 100);
                return (
                    <div key={title}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-300 truncate max-w-[70%]" title={title}>{title}</span>
                            <span className="text-xs font-bold text-white ml-2">{count}</span>
                        </div>
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{
                                    width: `${pct}%`,
                                    background: `linear-gradient(90deg, ${CHART_COLORS[i % CHART_COLORS.length]}, ${CHART_COLORS[(i + 1) % CHART_COLORS.length]})`
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// --- Donut Chart: Lead Interest Breakdown ---
function DonutChart({ leads }) {
    const counts = {};
    leads.forEach(l => {
        const key = l.interest || 'General';
        counts[key] = (counts[key] || 0) + 1;
    });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const total = leads.length || 1;

    if (entries.length === 0) return (
        <div className="flex items-center justify-center h-48 text-gray-500 text-sm">No lead data yet.</div>
    );

    // Build SVG donut path segments
    const radius = 60;
    const cx = 80;
    const cy = 80;
    const circumference = 2 * Math.PI * radius;
    let cumulativePct = 0;
    const segments = entries.map(([label, count], i) => {
        const pct = count / total;
        const offset = circumference * (1 - cumulativePct);
        const dash = circumference * pct;
        cumulativePct += pct;
        return { label, count, pct, offset, dash, color: CHART_COLORS[i % CHART_COLORS.length] };
    });

    return (
        <div className="flex flex-col md:flex-row items-center gap-6">
            {/* SVG Donut */}
            <div className="flex-shrink-0">
                <svg width="160" height="160" viewBox="0 0 160 160">
                    <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="20" />
                    {segments.map((seg, i) => (
                        <circle
                            key={i}
                            cx={cx} cy={cy} r={radius}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth="20"
                            strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
                            strokeDashoffset={seg.offset}
                            transform={`rotate(-90 ${cx} ${cy})`}
                            style={{ transition: 'stroke-dasharray 1s ease' }}
                        />
                    ))}
                    <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">{total}</text>
                    <text x={cx} y={cy + 14} textAnchor="middle" fill="#9ca3af" fontSize="10">leads</text>
                </svg>
            </div>
            {/* Legend */}
            <div className="space-y-2 flex-1 w-full">
                {segments.map((seg, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
                            <span className="text-xs text-gray-300 capitalize">{seg.label}</span>
                        </div>
                        <span className="text-xs font-bold text-white">{Math.round(seg.pct * 100)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Referral Source Chart ---
function ReferralChart({ leads }) {
    const counts = {};
    leads.forEach(l => {
        const key = l.referral_source || 'Not specified';
        counts[key] = (counts[key] || 0) + 1;
    });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const max = entries[0]?.[1] || 1;

    if (entries.length === 0) return (
        <div className="flex items-center justify-center h-48 text-gray-500 text-sm">No referral data yet.</div>
    );

    return (
        <div className="space-y-3">
            {entries.map(([source, count], i) => {
                const pct = Math.round((count / max) * 100);
                return (
                    <div key={source}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-300 capitalize truncate max-w-[70%]">{source}</span>
                            <span className="text-xs font-bold text-white">{count}</span>
                        </div>
                        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{
                                    width: `${pct}%`,
                                    background: CHART_COLORS[i % CHART_COLORS.length]
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// --- Insights Tab ---
function InsightsTab({ leads, registrations }) {
    return (
        <div className="space-y-6">
            {/* Row 1: Event bar + Lead donut */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart2 size={18} className="text-indigo-400" />
                        <h3 className="text-white font-bold text-sm">Registrations by Event</h3>
                    </div>
                    <EventBarChart registrations={registrations} />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp size={18} className="text-purple-400" />
                        <h3 className="text-white font-bold text-sm">Lead Interest Breakdown</h3>
                    </div>
                    <DonutChart leads={leads} />
                </div>
            </div>

            {/* Row 2: How people found us */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Users size={18} className="text-emerald-400" />
                    <h3 className="text-white font-bold text-sm">How Leads Found Us (Referral Source)</h3>
                </div>
                <ReferralChart leads={leads} />
            </div>

            {/* Row 3: Registration Growth (monthly) */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar size={18} className="text-amber-400" />
                    <h3 className="text-white font-bold text-sm">Registration Activity (Last 30 Days)</h3>
                </div>
                <MonthlyActivity registrations={registrations} />
            </div>
        </div>
    );
}

function EventsCmsTab({ events, setEvents, onSave, saving, message }) {
    const [editingEvent, setEditingEvent] = useState(null);
    const sortedEvents = [...events].sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

    function startNewEvent() {
        setEditingEvent({
            ...emptyEvent,
            id: Date.now(),
            date: new Date().toISOString().slice(0, 10),
            displayDate: new Date().toLocaleDateString('en-ZA', {
                weekday: 'short',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            })
        });
    }

    function addStandardRsvpProgrammeEvents() {
        setEvents(prev => {
            const existingTitles = new Set(prev.map(event => event.title.toLowerCase()));
            const missingEvents = standardRsvpProgrammeEvents
                .filter(event => !existingTitles.has(event.title.toLowerCase()))
                .map(normalizeEventForm);

            return [...prev, ...missingEvents];
        });
    }

    function updateField(field, value) {
        setEditingEvent(prev => ({
            ...prev,
            [field]: ['capacity', 'registered', 'priceSA', 'priceUS'].includes(field)
                ? Number(value)
                : field === 'registrationRequired'
                    ? value === 'true'
                    : value
        }));
    }

    function saveDraft() {
        const normalized = normalizeEventForm(editingEvent);
        setEvents(prev => {
            const exists = prev.some(event => String(event.id) === String(normalized.id));
            return exists
                ? prev.map(event => String(event.id) === String(normalized.id) ? normalized : event)
                : [...prev, normalized];
        });
        setEditingEvent(null);
    }

    function deleteEvent(id) {
        const event = events.find(item => String(item.id) === String(id));
        if (!window.confirm(`Delete "${event?.title || 'this event'}"?`)) return;
        setEvents(prev => prev.filter(item => String(item.id) !== String(id)));
        if (editingEvent && String(editingEvent.id) === String(id)) {
            setEditingEvent(null);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Events CMS</h2>
                    <p className="text-sm text-gray-400 mt-1">Create events, edit dates, pricing, venue details, descriptions, and remove old entries.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={addStandardRsvpProgrammeEvents}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold rounded-xl transition-all">
                        <Plus size={16} /> Add RSVP Programme Events
                    </button>
                    <button onClick={startNewEvent}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-bold rounded-xl transition-all">
                        <Plus size={16} /> New Event
                    </button>
                    <button onClick={onSave} disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50">
                        {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Changes
                    </button>
                </div>
            </div>

            {message && (
                <div className={`px-4 py-3 rounded-xl text-sm border ${message.type === 'error'
                    ? 'bg-red-500/10 border-red-500/20 text-red-300'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    }`}>
                    {message.text}
                </div>
            )}

            {editingEvent && (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-5">
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="text-white font-bold">{events.some(event => String(event.id) === String(editingEvent.id)) ? 'Edit Event' : 'Create Event'}</h3>
                        <button onClick={() => setEditingEvent(null)} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AdminInput label="Title" value={editingEvent.title} onChange={value => updateField('title', value)} required />
                        <AdminInput label="Type" value={editingEvent.type} onChange={value => updateField('type', value)} />
                        <AdminInput label="Date" type="date" value={editingEvent.date} onChange={value => updateField('date', value)} required />
                        <AdminInput label="Display Date" value={editingEvent.displayDate} onChange={value => updateField('displayDate', value)} />
                        <AdminInput label="Time" value={editingEvent.time} onChange={value => updateField('time', value)} />
                        <AdminInput label="City" value={editingEvent.city} onChange={value => updateField('city', value)} />
                        <AdminInput label="Venue" value={editingEvent.venue} onChange={value => updateField('venue', value)} />
                        <AdminInput label="Address" value={editingEvent.address} onChange={value => updateField('address', value)} />
                        <AdminInput label="Capacity" type="number" value={editingEvent.capacity} onChange={value => updateField('capacity', value)} />
                        <AdminInput label="Registered" type="number" value={editingEvent.registered} onChange={value => updateField('registered', value)} />
                        <AdminInput label="South Africa Price" type="number" value={editingEvent.priceSA} onChange={value => updateField('priceSA', value)} />
                        <AdminInput label="International Price" type="number" value={editingEvent.priceUS} onChange={value => updateField('priceUS', value)} />
                        <AdminInput label="Image Path" value={editingEvent.image} onChange={value => updateField('image', value)} />
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Status</label>
                            <select value={editingEvent.status} onChange={event => updateField('status', event.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                {['open', 'limited-seats', 'vip-access', 'black-tie', 'impact', 'free', 'double-session', 'cultural', 'private-rsvp', 'sold-out'].map(status => (
                                    <option key={status} value={status} className="bg-slate-900">{status}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Registration</label>
                            <select value={String(editingEvent.registrationRequired)} onChange={event => updateField('registrationRequired', event.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="true" className="bg-slate-900">Required</option>
                                <option value="false" className="bg-slate-900">Free entry only</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Visibility</label>
                            <select value={editingEvent.visibility || 'public'} onChange={event => updateField('visibility', event.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="public" className="bg-slate-900">Public website event</option>
                                <option value="private" className="bg-slate-900">Private RSVP/programme event</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2">Event Information</label>
                        <textarea value={editingEvent.description} onChange={event => updateField('description', event.target.value)}
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Describe the event..." />
                    </div>

                    <button onClick={saveDraft} disabled={!editingEvent.title || !editingEvent.date}
                        className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50">
                        <Save size={16} /> Apply Event
                    </button>
                </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-white/10 bg-white/5">
                            <tr>
                                {['Event', 'Date', 'Venue', 'Amount', 'Visibility', 'Registration', 'Actions'].map(header => (
                                    <th key={header} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {sortedEvents.map(event => (
                                <tr key={event.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-white">{event.title}</div>
                                        <div className="text-xs text-gray-500 max-w-sm truncate">{event.description}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{event.displayDate || event.date}</td>
                                    <td className="px-6 py-4 text-gray-300">{event.venue || 'TBD'}</td>
                                    <td className="px-6 py-4 text-gray-300">ZAR {event.priceSA || 0} / USD {event.priceUS || 0}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.visibility === 'private' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                            {event.visibility === 'private' ? 'Private RSVP' : 'Public'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.registrationRequired === false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'}`}>
                                            {event.registrationRequired === false ? 'Free entry' : 'Required'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => setEditingEvent(normalizeEventForm(event))}
                                                className="p-2 text-indigo-300 hover:text-white hover:bg-indigo-500/20 rounded-xl transition-all" title="Edit event">
                                                <Edit3 size={16} />
                                            </button>
                                            <button onClick={() => deleteEvent(event.id)}
                                                className="p-2 text-red-300 hover:text-white hover:bg-red-500/20 rounded-xl transition-all" title="Delete event">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {sortedEvents.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center py-20 text-gray-500">No events created yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function AdminInput({ label, value, onChange, type = 'text', required = false }) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">{label}</label>
            <input
                type={type}
                required={required}
                value={value ?? ''}
                onChange={event => onChange(event.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>
    );
}

// --- Monthly Activity Heatmap Strip ---
function MonthlyActivity({ registrations }) {
    const days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(Date.now() - (29 - i) * 86400000);
        return {
            date: d.toISOString().slice(0, 10),
            label: d.getDate(),
            count: 0
        };
    });
    registrations.forEach(r => {
        const d = r.created_at?.slice(0, 10);
        const day = days.find(x => x.date === d);
        if (day) day.count++;
    });
    const max = Math.max(...days.map(d => d.count), 1);

    return (
        <div>
            <div className="flex gap-1 items-end flex-wrap">
                {days.map((day, i) => {
                    const opacity = day.count === 0 ? 0.08 : 0.2 + (day.count / max) * 0.8;
                    return (
                        <div key={i} className="flex flex-col items-center gap-1" title={`${day.date}: ${day.count} registrations`}>
                            <div
                                className="w-6 rounded-sm transition-all duration-700"
                                style={{
                                    height: `${Math.max(8, (day.count / max) * 56)}px`,
                                    background: `rgba(129, 140, 248, ${opacity})`
                                }}
                            />
                            {i % 5 === 0 && <span className="text-[9px] text-gray-600">{day.label}</span>}
                        </div>
                    );
                })}
            </div>
            <div className="flex items-center gap-2 mt-3">
                <div className="w-3 h-3 rounded-sm bg-indigo-500/10" />
                <span className="text-xs text-gray-500">No activity</span>
                <div className="w-3 h-3 rounded-sm bg-indigo-500 ml-3" />
                <span className="text-xs text-gray-500">High activity</span>
            </div>
        </div>
    );
}

function parseRsvpCsv(text) {
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

function parseRsvpEventNames(value) {
    return String(value || '')
        .split(';')
        .map(item => item.trim())
        .filter(Boolean)
        .map(item => item.replace(/\s*\(\d+\)\s*$/, '').trim())
        .filter(Boolean);
}

function normalizeLabel(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function suggestEventId(externalName, events) {
    const normalizedExternal = normalizeLabel(externalName);
    const exact = events.find(event => normalizeLabel(event.title) === normalizedExternal);
    if (exact) return String(exact.id);

    const keywords = normalizedExternal.split(' ').filter(word => word.length > 3);
    const scored = events
        .map(event => ({
            event,
            score: keywords.filter(word => normalizeLabel(event.title).includes(word)).length
        }))
        .sort((a, b) => b.score - a.score);

    return scored[0]?.score > 0 ? String(scored[0].event.id) : '';
}

function RsvpImportTab({ adminPassword, events, onImported }) {
    const [csvText, setCsvText] = useState('');
    const [eventMappings, setEventMappings] = useState({});
    const [isImporting, setIsImporting] = useState(false);
    const [message, setMessage] = useState(null);

    const rows = parseRsvpCsv(csvText);
    const externalEvents = [...new Set(rows.flatMap(row => parseRsvpEventNames(row['Events Attending'])))];
    const estimatedRows = rows.reduce((total, row) => {
        const totalGuests = Number(row['Total Guests']) || 1;
        return total + parseRsvpEventNames(row['Events Attending']).length * totalGuests;
    }, 0);

    function updateCsv(value) {
        setCsvText(value);
        setMessage(null);
    }

    async function handleFileChange(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        updateCsv(await file.text());
    }

    function getSelectedEventId(externalEvent) {
        return eventMappings[externalEvent] ?? suggestEventId(externalEvent, events);
    }

    async function handleImport() {
        const missingMappings = externalEvents.filter(externalEvent => !getSelectedEventId(externalEvent));

        if (rows.length === 0) {
            setMessage({ type: 'error', text: 'Add an RSVP CSV before importing.' });
            return;
        }

        if (missingMappings.length > 0) {
            setMessage({ type: 'error', text: `Map every RSVP event before importing: ${missingMappings.join(', ')}` });
            return;
        }

        const mappings = externalEvents.reduce((result, externalEvent) => {
            const event = events.find(item => String(item.id) === getSelectedEventId(externalEvent));
            return {
                ...result,
                [externalEvent]: {
                    id: event.id,
                    title: event.title
                }
            };
        }, {});

        setIsImporting(true);
        setMessage(null);

        try {
            const response = await fetch('/api/rsvp-import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: adminPassword,
                    csv: csvText,
                    eventMappings: mappings
                })
            });
            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.error || 'Failed to import RSVP registrations.');
            }

            setMessage({
                type: 'success',
                text: `Imported ${result.importedGroups} RSVP groups and ${result.importedRows} attendee-event rows.`
            });
            onImported?.();
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to import RSVP registrations.' });
        } finally {
            setIsImporting(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">RSVP CSV Import</h3>
                        <p className="text-gray-500 text-sm">Upload or paste RSVP exports, map event names, then import them into registrations.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">
                    <textarea
                        value={csvText}
                        onChange={event => updateCsv(event.target.value)}
                        placeholder="Paste RSVP CSV content here..."
                        className="min-h-56 w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="space-y-4">
                        <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-8 text-center cursor-pointer hover:border-indigo-400/50 transition-colors">
                            <Upload size={24} className="text-indigo-300" />
                            <span className="text-sm font-semibold text-white">Upload CSV</span>
                            <span className="text-xs text-gray-500">Choose an RSVP export file</span>
                            <input type="file" accept=".csv,text/csv" onChange={handleFileChange} className="hidden" />
                        </label>
                        <div className="rounded-2xl bg-black/20 border border-white/10 p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">RSVP groups</span>
                                <span className="font-bold text-white">{rows.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Events found</span>
                                <span className="font-bold text-white">{externalEvents.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Estimated rows</span>
                                <span className="font-bold text-white">{estimatedRows}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {externalEvents.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <h3 className="text-white font-bold mb-4">Map RSVP Events</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {externalEvents.map(externalEvent => (
                            <div key={externalEvent} className="rounded-2xl bg-black/20 border border-white/10 p-4">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{externalEvent}</label>
                                <select
                                    value={getSelectedEventId(externalEvent)}
                                    onChange={event => setEventMappings(prev => ({ ...prev, [externalEvent]: event.target.value }))}
                                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="" className="bg-gray-900">Choose site event</option>
                                    {events.map(event => (
                                        <option key={event.id} value={String(event.id)} className="bg-gray-900">{event.title}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {rows.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4">
                        <h3 className="text-white font-bold">Preview</h3>
                        <button
                            onClick={handleImport}
                            disabled={isImporting}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-50"
                        >
                            {isImporting ? <RefreshCw size={16} className="animate-spin" /> : <Upload size={16} />}
                            Import RSVPs
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    {['Primary Contact', 'Organisation', 'Total Guests', 'Events', 'VIP', 'Transport', 'Dietary'].map(header => (
                                        <th key={header} className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-500">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {rows.slice(0, 8).map((row, index) => (
                                    <tr key={`${row.Email}-${index}`} className="hover:bg-white/5">
                                        <td className="px-6 py-4 text-white font-semibold">{row['Primary Contact Name']}</td>
                                        <td className="px-6 py-4 text-gray-300">{row.Organisation || '-'}</td>
                                        <td className="px-6 py-4 text-gray-300">{row['Total Guests'] || '-'}</td>
                                        <td className="px-6 py-4 text-gray-300 min-w-[260px]">{row['Events Attending']}</td>
                                        <td className="px-6 py-4 text-gray-300">{row['VIP Status'] || '-'}</td>
                                        <td className="px-6 py-4 text-gray-300">{row['Airport Transport Required'] || '-'} / {row['Local Transport Required'] || '-'}</td>
                                        <td className="px-6 py-4 text-gray-300">{row['Dietary Restrictions'] || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {rows.length > 8 && (
                        <p className="px-6 py-3 text-xs text-gray-500 border-t border-white/10">Showing first 8 rows only.</p>
                    )}
                </div>
            )}

            {message && (
                <div className={`rounded-2xl border px-4 py-3 text-sm ${message.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                        : 'bg-red-500/10 border-red-500/20 text-red-300'
                    }`}>
                    {message.text}
                </div>
            )}
        </div>
    );
}

// --- Main Dashboard ---
export default function AdminDashboard() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [activeTab, setActiveTab] = useState('leads');
    const [leads, setLeads] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [events, setEvents] = useState(siteData.events || []);
    const [loading, setLoading] = useState(false);
    const [savingEvents, setSavingEvents] = useState(false);
    const [dataError, setDataError] = useState('');
    const [eventsMessage, setEventsMessage] = useState(null);
    const [search, setSearch] = useState('');

    async function fetchData(passwordOverride = adminPassword, options = {}) {
        if (!passwordOverride) {
            setDataError('Admin password is required.');
            if (options.throwOnError) throw new Error('Admin password is required.');
            return;
        }

        setLoading(true);
        setDataError('');
        try {
            const response = await fetch('/api/admin-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: passwordOverride })
            });
            const eventsResponse = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: passwordOverride, action: 'list' })
            });

            const result = await response.json().catch(() => ({}));
            const eventsResult = await eventsResponse.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.error || 'Failed to load admin data.');
            }
            if (eventsResponse.ok && Array.isArray(eventsResult.events)) {
                setEvents(eventsResult.events);
            }

            setLeads(result.leads || []);
            setRegistrations(result.registrations || []);
            return result;
        } catch (err) {
            console.error('Error fetching data:', err);
            setDataError(err.message || 'Failed to load admin data.');
            if (options.throwOnError) throw err;
        } finally {
            setLoading(false);
        }
    }

    async function handleLogin(password) {
        try {
            await fetchData(password, { throwOnError: true });
            setAdminPassword(password);
            setIsLoggedIn(true);
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.message || 'Unable to access dashboard.'
            };
        }
    }

    function handleRefresh() {
        fetchData();
    }

    function handleLogout() {
        setIsLoggedIn(false);
        setAdminPassword('');
        setLeads([]);
        setRegistrations([]);
        setEvents(siteData.events || []);
        setDataError('');
        setEventsMessage(null);
    }

    async function saveEvents() {
        setSavingEvents(true);
        setEventsMessage(null);

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: adminPassword, events })
            });
            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.error || 'Failed to save events.');
            }

            setEvents(result.events || events);
            setEventsMessage({ type: 'success', text: 'Events saved successfully.' });
        } catch (err) {
            setEventsMessage({ type: 'error', text: err.message || 'Failed to save events.' });
        } finally {
            setSavingEvents(false);
        }
    }

    if (!isLoggedIn) return <LoginGate onLogin={handleLogin} />;

    const filteredLeads = leads.filter(l =>
        `${l.first_name} ${l.last_name} ${l.email} ${l.phone}`.toLowerCase().includes(search.toLowerCase())
    );
    const filteredRegs = registrations.filter(r =>
        [
            r.first_name, r.last_name, r.email, r.event_title, r.payment_reference,
            r.attendee_type, r.attendee_label, r.primary_contact_name, r.booker_first_name,
            r.booker_last_name, r.title, r.organisation, r.organization, r.vip_status,
            r.gala_seating_selection, r.airport_transport_required, r.local_transport_required,
            r.dietary_restrictions, r.accessibility_requests, r.accessibility_special_requests,
            r.source
        ].filter(Boolean).join(' ').toLowerCase().includes(search.toLowerCase())
    );
    const filteredEvents = events.filter(event =>
        `${event.title} ${event.displayDate} ${event.venue} ${event.description} ${event.visibility}`.toLowerCase().includes(search.toLowerCase())
    );
    const activeData = activeTab === 'leads' ? filteredLeads : activeTab === 'registrations' ? filteredRegs : filteredEvents;

    const tabs = [
        { id: 'leads', label: 'Leads', count: leads.length, icon: Contact2 },
        { id: 'registrations', label: 'Registrations', count: registrations.length, icon: ClipboardList },
        { id: 'rsvp', label: 'RSVP Import', count: null, icon: Upload },
        { id: 'events', label: 'Events CMS', count: events.length, icon: Calendar },
        { id: 'insights', label: 'Insights', count: null, icon: Activity }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0b0f2b] to-[#05060f] text-[#eef2f6] font-[Poppins]">

            {/* Top Nav */}
            <header className="sticky top-0 z-50 bg-black/60 backdrop-blur border-b border-white/5 px-6 md:px-10 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img src="/WealthMindset-removebg.png" alt="Logo" className="h-9 w-auto" />
                    <div>
                        <h1 className="text-white font-bold text-lg leading-none">Admin Dashboard</h1>
                        <p className="text-gray-500 text-xs">The Wealth Mindset CRM</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleRefresh}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all" title="Refresh">
                        <RefreshCw size={18} />
                    </button>
                    <button onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </header>

            <main className="px-6 md:px-10 py-10 max-w-7xl mx-auto space-y-10">

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon={Users} label="Total Leads" value={leads.length} color="bg-indigo-500/30" />
                    <StatCard icon={Calendar} label="Registrations" value={registrations.length} color="bg-purple-500/30" />
                    <StatCard icon={TrendingUp} label="This Month" color="bg-emerald-500/30"
                        value={registrations.filter(r => new Date(r.created_at) > new Date(Date.now() - 30 * 86400000)).length} />
                    <StatCard icon={Mail} label="Marketing Consent" color="bg-amber-500/30"
                        value={registrations.filter(r => r.marketing_consent).length} />
                </div>

                {/* Tab Switcher */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10 gap-1">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearch(''); }}
                                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white'}`}>
                                    <Icon size={15} />
                                    {tab.label}{tab.count !== null ? ` (${tab.count})` : ''}
                                </button>
                            );
                        })}
                    </div>

                    {activeTab !== 'insights' && activeTab !== 'events' && activeTab !== 'rsvp' && (
                        <div className="flex gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" placeholder="Search..." value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <button onClick={() => exportToExcel(activeData, `${activeTab}-${new Date().toISOString().slice(0, 10)}.xlsx`)}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all whitespace-nowrap">
                                <Download size={16} /> Export Excel
                            </button>
                        </div>
                    )}
                </div>

                {/* Content */}
                {dataError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm">
                        {dataError}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <RefreshCw size={32} className="animate-spin text-indigo-400" />
                    </div>
                ) : activeTab === 'insights' ? (
                    <InsightsTab leads={leads} registrations={registrations} />
                ) : activeTab === 'events' ? (
                    <EventsCmsTab
                        events={filteredEvents}
                        setEvents={setEvents}
                        onSave={saveEvents}
                        saving={savingEvents}
                        message={eventsMessage}
                    />
                ) : activeTab === 'rsvp' ? (
                    <RsvpImportTab
                        adminPassword={adminPassword}
                        events={events}
                        onImported={handleRefresh}
                    />
                ) : (
                    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                        {activeTab === 'leads'
                            ? <LeadsTable data={filteredLeads} />
                            : <RegistrationsTable data={filteredRegs} />
                        }
                    </div>
                )}

            </main>
        </div>
    );
}

// --- Leads Table ---
function LeadsTable({ data }) {
    if (data.length === 0) return <div className="text-center py-20 text-gray-500">No leads found.</div>;
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="border-b border-white/10 bg-white/5">
                    <tr>
                        {['Name', 'Email', 'Phone', 'Interest', 'Date'].map(h => (
                            <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {data.map((lead, i) => (
                        <tr key={lead.id || i} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-semibold text-white">{lead.first_name} {lead.last_name}</td>
                            <td className="px-6 py-4 text-gray-300">
                                <a href={`mailto:${lead.email}`} className="hover:text-indigo-400 flex items-center gap-1">
                                    <Mail size={13} /> {lead.email}
                                </a>
                            </td>
                            <td className="px-6 py-4 text-gray-300">
                                <a href={`tel:${lead.phone}`} className="hover:text-indigo-400 flex items-center gap-1">
                                    <Phone size={13} /> {lead.phone}
                                </a>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold capitalize">
                                    {lead.interest || 'General'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500 text-xs">
                                {lead.created_at ? new Date(lead.created_at).toLocaleDateString('en-ZA') : '—'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function displayValue(value) {
    return value == null || value === '' ? '-' : value;
}

function getRegistrationLogistics(reg) {
    const hasLogistics = Boolean(
        reg.title
        || reg.organisation
        || reg.organization
        || reg.vip_status
        || reg.gala_seating_selection
        || reg.airport_transport_required
        || reg.local_transport_required
        || reg.dietary_restrictions
        || reg.accessibility_requests
        || reg.accessibility_special_requests
        || (reg.source && reg.source !== 'website')
    );

    if (!hasLogistics) return [];

    return [
        ['Primary Contact', [reg.booker_first_name, reg.booker_last_name].filter(Boolean).join(' ') || reg.primary_contact_name],
        ['Title', reg.title],
        ['Organisation', reg.organisation || reg.organization],
        ['VIP Status', reg.vip_status],
        ['Gala Seating', reg.gala_seating_selection],
        ['Airport Transport', reg.airport_transport_required],
        ['Local Transport', reg.local_transport_required],
        ['Dietary Restrictions', reg.dietary_restrictions],
        ['Special Requests', reg.accessibility_requests || reg.accessibility_special_requests],
        ['Source', reg.source && reg.source !== 'website' ? reg.source : '']
    ].filter(([, value]) => value != null && value !== '');
}

// --- Registrations Table ---
function RegistrationsTable({ data }) {
    if (data.length === 0) return <div className="text-center py-20 text-gray-500">No registrations found.</div>;
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="border-b border-white/10 bg-white/5">
                    <tr>
                        {['Name', 'Attendee', 'Email', 'Event', 'Reference', 'Status', 'RSVP Details', 'Date'].map(h => (
                            <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {data.map((reg, i) => (
                        <tr key={reg.id || i} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-semibold text-white">{reg.first_name} {reg.last_name}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${reg.attendee_type === 'guest'
                                        ? 'bg-sky-500/20 text-sky-300'
                                        : 'bg-indigo-500/20 text-indigo-300'
                                    }`}>
                                    {reg.attendee_label || reg.attendee_type || 'Primary'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-300">
                                <a href={`mailto:${reg.email}`} className="hover:text-indigo-400 flex items-center gap-1">
                                    <Mail size={13} /> {reg.email}
                                </a>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">
                                    {reg.event_title || '—'}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-indigo-400 font-bold">{reg.payment_reference || '—'}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${reg.payment_status === 'Pending Payment' || reg.payment_status === 'pending'
                                        ? 'bg-amber-500/20 text-amber-400'
                                        : 'bg-emerald-500/20 text-emerald-400'
                                    }`}>
                                    {reg.payment_status || 'Confirmed'}
                                </span>
                            </td>
                            <td className="px-6 py-4 min-w-[280px]">
                                {getRegistrationLogistics(reg).length > 0 ? (
                                    <div className="space-y-2">
                                        {getRegistrationLogistics(reg).map(([label, value]) => (
                                            <div key={label}>
                                                <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</span>
                                                <span className="block text-xs text-gray-200 leading-relaxed">{displayValue(value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-gray-600 text-xs">-</span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-gray-500 text-xs">
                                {reg.created_at ? new Date(reg.created_at).toLocaleDateString('en-ZA') : '—'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
