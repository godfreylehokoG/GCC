import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    TrendingUp,
    Users,
    Gift,
    BadgeDollarSign,
    FileText,
    ExternalLink,
    ChevronDown,
    Info
} from 'lucide-react';

export default function GlobalGoldCoin({ data }) {
    const [activeTab, setActiveTab] = useState('about');

    const tabs = [
        { id: 'about', label: 'About', icon: Info },
        { id: 'benefits', label: 'Benefits', icon: ShieldCheck },
        { id: 'bonuses', label: 'Bonuses', icon: Gift },
        { id: 'comp', label: 'Comp Plan', icon: BadgeDollarSign },
        { id: 'whitepaper', label: 'Whitepaper', icon: FileText },
    ];

    return (
        <section id="ggc" className="py-24 px-6 md:px-10 bg-[#05060f] relative overflow-hidden">
            {/* Decorative Gold Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] -z-0" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -z-0" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row gap-12 items-start">

                    {/* Sidebar / Tab Controller */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="mb-10">
                            <img src="/globalgoldcoinlogo.png" alt="GGC Logo" className="h-16 w-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-2">Global Gold Coin</h2>
                            <div className="h-1 w-12 bg-yellow-500 rounded-full" />
                        </div>

                        <nav className="space-y-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-semibold text-sm ${activeTab === tab.id
                                            ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="mt-12 p-6 rounded-[32px] bg-gradient-to-br from-yellow-500/20 to-transparent border border-yellow-500/20"
                        >
                            <Gift className="text-yellow-500 mb-4" size={32} />
                            <h4 className="text-white font-bold mb-2 text-lg">Claim $100 Gift</h4>
                            <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                                Get Your Gifted Global Gold Coin just for creating your wallet. Limited time offer.
                            </p>
                            <a
                                href="https://cryptogoldexchange.com"
                                target="_blank"
                                rel="noreferrer"
                                className="block w-full text-center py-3 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold rounded-xl transition-all uppercase tracking-wider"
                            >
                                Join Now
                            </a>
                        </motion.div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-h-[600px] w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12 backdrop-blur-sm h-full"
                            >
                                {activeTab === 'about' && (
                                    <div className="space-y-10">
                                        <div>
                                            <span className="text-yellow-500 font-bold uppercase tracking-[0.2em] text-xs mb-4 block">Information Portal</span>
                                            <h3 className="text-4xl font-bold mb-6 leading-tight">{data.tagline}</h3>
                                            <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                                {data.about}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                            {data.stats.map((stat, i) => (
                                                <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                                                    <div className="text-2xl font-bold text-yellow-500 mb-1">{stat.label}</div>
                                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{stat.desc}</div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-8 rounded-[32px] bg-black/40 border border-white/5">
                                            <h4 className="font-bold flex items-center gap-3 mb-4">
                                                <TrendingUp className="text-yellow-500" size={20} />
                                                Early-Stage Opportunity
                                            </h4>
                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                Many people look back and wish they discovered Bitcoin when it was early. GGC represents that same ground-floor potential, but with the added security of real physical gold reserves.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'benefits' && (
                                    <div className="space-y-8">
                                        <h3 className="text-3xl font-bold mb-8">Stability Through Tangible Value</h3>
                                        <div className="grid gap-6">
                                            {data.benefits.map((benefit, i) => (
                                                <div key={i} className="flex gap-6 p-8 rounded-3xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                                                    <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 flex-shrink-0 group-hover:scale-110 transition-transform">
                                                        <ShieldCheck size={28} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-bold mb-2">{benefit.title}</h4>
                                                        <p className="text-gray-400 text-sm leading-relaxed">{benefit.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'bonuses' && (
                                    <div className="space-y-8">
                                        <h3 className="text-3xl font-bold mb-6">{data.multiplierProgram.title}</h3>
                                        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-10 rounded-[40px] text-black">
                                            <h4 className="text-5xl font-black mb-4 tracking-tighter uppercase">Multiplier Bonuses</h4>
                                            <p className="text-xl font-bold opacity-80 mb-8 max-w-lg">
                                                {data.multiplierProgram.desc}
                                            </p>
                                            <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                                                <div className="text-sm font-bold">
                                                    <span className="block opacity-60 uppercase text-[10px]">Urgent Notice</span>
                                                    {data.multiplierProgram.notice}
                                                </div>
                                                <a href="mailto:support@globalgoldcoin.net" className="px-8 py-3 bg-black text-white rounded-full font-bold text-sm whitespace-nowrap">
                                                    Email Support
                                                </a>
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                                                <div className="text-4xl font-bold text-yellow-500 mb-2">2x-10x</div>
                                                <p className="text-sm text-gray-400">Apply multipliers before purchasing coins over $100.</p>
                                            </div>
                                            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                                                <div className="text-4xl font-bold text-yellow-500 mb-2">March 2026</div>
                                                <p className="text-sm text-gray-400">Pre-launch phase ends. Current pricing will no longer be available.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'comp' && (
                                    <div className="space-y-10">
                                        <h3 className="text-3xl font-bold">The Success Story Accelerator</h3>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-500/10 to-transparent border border-white/10">
                                                <Users className="text-indigo-400 mb-4" size={32} />
                                                <h4 className="text-2xl font-bold mb-2">Direct Referrals</h4>
                                                <div className="text-4xl font-black text-white mb-4">{data.referralPlan.direct}</div>
                                                <p className="text-sm text-gray-400 leading-relaxed">
                                                    Earn 10% on every direct purchase made through your referral link.
                                                </p>
                                            </div>
                                            <div className="p-8 rounded-3xl bg-gradient-to-b from-purple-500/10 to-transparent border border-white/10">
                                                <TrendingUp className="text-purple-400 mb-4" size={32} />
                                                <h4 className="text-2xl font-bold mb-2">2nd Level Growth</h4>
                                                <div className="text-4xl font-black text-white mb-4">{data.referralPlan.level2}</div>
                                                <p className="text-sm text-gray-400 leading-relaxed">
                                                    Earn 5% on purchases from your second-level direct referrals.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs">Testimonials</h4>
                                            <div className="grid gap-4">
                                                {data.testimonials.map((t, i) => (
                                                    <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 italic text-sm text-gray-400">
                                                        "{t.quote}" — <span className="text-white not-italic font-bold">{t.author}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'whitepaper' && (
                                    <div className="flex flex-col items-center justify-center text-center h-full py-20">
                                        <div className="w-24 h-24 rounded-3xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-8">
                                            <FileText size={48} />
                                        </div>
                                        <h3 className="text-3xl font-bold mb-4">Strategic Whitepaper</h3>
                                        <p className="text-gray-400 max-w-lg mb-10 leading-relaxed">
                                            Discover the full technical details of the Nelson, Nevada gold mine backing, tokenomics, and the 2026 vision for major exchange listings.
                                        </p>
                                        <div className="flex gap-4">
                                            <button className="px-10 py-4 bg-yellow-500 text-black font-extrabold rounded-full flex items-center gap-2 hover:scale-105 transition-all">
                                                Read Whitepaper <ExternalLink size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Informational Disclaimer as requested */}
                <div className="mt-20 p-8 rounded-[32px] bg-white/5 border border-white/10 text-center">
                    <p className="text-[10px] text-gray-500 leading-relaxed max-w-4xl mx-auto uppercase tracking-widest font-bold">
                        Compliance Disclosure: GlobalGoldCoin.net is an informational referral website only. We are not a financial institution, investment advisor, or cryptocurrency exchange. Cryptocurrency involves risk, including possible loss of principal. Always conduct your own research.
                    </p>
                </div>
            </div>
        </section>
    );
}
