import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
    Users, Calendar, Download, LogOut, Eye, EyeOff,
    TrendingUp, Mail, Phone, MapPin, RefreshCw, Shield,
    Search, Filter, ChevronDown
} from 'lucide-react';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Legacy@Wealth2026!';

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
                {/* Logo */}
                <div className="text-center mb-10">
                    <img src="/WealthMindset-removebg.png" alt="Logo" className="h-16 w-auto mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
                    <p className="text-gray-400 text-sm mt-2">The Wealth Mindset · Secure Access</p>
                </div>

                {/* Card */}
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

    // Filtered data based on search
    const filteredLeads = leads.filter(l =>
        `${l.first_name} ${l.last_name} ${l.email} ${l.phone}`.toLowerCase().includes(search.toLowerCase())
    );
    const filteredRegs = registrations.filter(r =>
        `${r.first_name} ${r.last_name} ${r.email} ${r.event_title}`.toLowerCase().includes(search.toLowerCase())
    );

    const activeData = activeTab === 'leads' ? filteredLeads : filteredRegs;

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

                {/* Tab Switcher + Search + Export */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
                        {['leads', 'registrations'].map(tab => (
                            <button key={tab} onClick={() => { setActiveTab(tab); setSearch(''); }}
                                className={`px-6 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${activeTab === tab
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'}`}>
                                {tab} ({tab === 'leads' ? leads.length : registrations.length})
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <button
                            onClick={() => exportToCSV(activeData, `${activeTab}-${new Date().toISOString().slice(0, 10)}.csv`)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all whitespace-nowrap">
                            <Download size={16} /> Export CSV
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <RefreshCw size={32} className="animate-spin text-indigo-400" />
                        </div>
                    ) : activeTab === 'leads' ? (
                        <LeadsTable data={filteredLeads} />
                    ) : (
                        <RegistrationsTable data={filteredRegs} />
                    )}
                </div>

            </main>
        </div>
    );
}

// --- Leads Table ---
function LeadsTable({ data }) {
    if (data.length === 0) return (
        <div className="text-center py-20 text-gray-500">No leads found.</div>
    );
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
    if (data.length === 0) return (
        <div className="text-center py-20 text-gray-500">No registrations found.</div>
    );
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
