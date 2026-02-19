import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
    Users, Calendar, Download, LogOut, Eye, EyeOff,
    TrendingUp, Mail, Phone, MapPin, RefreshCw, Shield,
    Search, BarChart2, Contact2, ClipboardList, Activity
} from 'lucide-react';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Legacy@Wealth2026!';

// Colour palette for charts
const CHART_COLORS = [
    '#818cf8', '#a78bfa', '#34d399', '#fbbf24', '#f87171',
    '#38bdf8', '#f472b6', '#a3e635'
];

// --- Utility: Export to CSV ---
function exportToCSV(data, filename) {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row =>
        Object.values(row).map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            if (password === ADMIN_PASSWORD) {
                onLogin();
            } else {
                setError('Incorrect password. Please try again.');
            }
            setLoading(false);
        }, 600);
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

// --- Main Dashboard ---
export default function AdminDashboard() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState('leads');
    const [leads, setLeads] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (isLoggedIn) fetchData();
    }, [isLoggedIn]);

    async function fetchData() {
        setLoading(true);
        const [{ data: leadsData }, { data: regsData }] = await Promise.all([
            supabase.from('leads').select('*').order('created_at', { ascending: false }),
            supabase.from('event_registrations').select('*').order('created_at', { ascending: false })
        ]);
        setLeads(leadsData || []);
        setRegistrations(regsData || []);
        setLoading(false);
    }

    if (!isLoggedIn) return <LoginGate onLogin={() => setIsLoggedIn(true)} />;

    const filteredLeads = leads.filter(l =>
        `${l.first_name} ${l.last_name} ${l.email} ${l.phone}`.toLowerCase().includes(search.toLowerCase())
    );
    const filteredRegs = registrations.filter(r =>
        `${r.first_name} ${r.last_name} ${r.email} ${r.event_title}`.toLowerCase().includes(search.toLowerCase())
    );
    const activeData = activeTab === 'leads' ? filteredLeads : filteredRegs;

    const tabs = [
        { id: 'leads', label: 'Leads', count: leads.length, icon: Contact2 },
        { id: 'registrations', label: 'Registrations', count: registrations.length, icon: ClipboardList },
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
                    <button onClick={fetchData}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all" title="Refresh">
                        <RefreshCw size={18} />
                    </button>
                    <button onClick={() => setIsLoggedIn(false)}
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

                    {activeTab !== 'insights' && (
                        <div className="flex gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" placeholder="Search..." value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <button onClick={() => exportToCSV(activeData, `${activeTab}-${new Date().toISOString().slice(0, 10)}.csv`)}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all whitespace-nowrap">
                                <Download size={16} /> Export CSV
                            </button>
                        </div>
                    )}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <RefreshCw size={32} className="animate-spin text-indigo-400" />
                    </div>
                ) : activeTab === 'insights' ? (
                    <InsightsTab leads={leads} registrations={registrations} />
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

// --- Registrations Table ---
function RegistrationsTable({ data }) {
    if (data.length === 0) return <div className="text-center py-20 text-gray-500">No registrations found.</div>;
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="border-b border-white/10 bg-white/5">
                    <tr>
                        {['Name', 'Email', 'Event', 'City', 'Occupation', 'Consent', 'Date'].map(h => (
                            <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {data.map((reg, i) => (
                        <tr key={reg.id || i} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-semibold text-white">{reg.first_name} {reg.last_name}</td>
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
                            <td className="px-6 py-4 text-gray-300">
                                <span className="flex items-center gap-1"><MapPin size={13} /> {reg.city || '—'}</span>
                            </td>
                            <td className="px-6 py-4 text-gray-300 text-xs">{reg.occupation || '—'}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${reg.marketing_consent ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {reg.marketing_consent ? 'Yes' : 'No'}
                                </span>
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
