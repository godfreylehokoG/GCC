import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, X, ChevronRight, Crown, Briefcase, Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import siteData from '../data.json';

export default function LeadershipPage() {
    const [selectedLeader, setSelectedLeader] = useState(null);
    const navigate = useNavigate();
    const leadership = siteData.leadership;

    const founder = leadership.filter(l => l.tier === 1);
    const cSuite = leadership.filter(l => l.tier === 2);
    const senior = leadership.filter(l => l.tier === 3);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#05060f] text-white selection:bg-indigo-500/30">
            {/* Navigation Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#05060f]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                    </button>
                    <img src="/WealthMindset-removebg.png" alt="Logo" className="h-8 w-auto grayscale opacity-50" />
                </div>
            </nav>

            <section className="pt-32 pb-24 px-6 md:px-10 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Section Header */}
                    <div className="text-center mb-20">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-4"
                        >
                            Visionary Leadership
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-6xl font-bold mb-6"
                        >
                            The Minds Behind the Mission
                        </motion.h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                            A collective of strategic thinkers, royal visionaries, and principled leaders dedicated to bridging traditional heritage with modern economic empowerment.
                        </p>
                    </div>

                    {/* === TIER 1: FOUNDER === */}
                    <div className="mb-16">
                        <div className="max-w-xl mx-auto">
                            {founder.map((leader, index) => (
                                <ProfileCard
                                    key={leader.id}
                                    leader={leader}
                                    index={index}
                                    size="large"
                                    onSelect={setSelectedLeader}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Connecting line */}
                    <div className="flex justify-center mb-16">
                        <div className="w-px h-16 bg-gradient-to-b from-amber-500/40 to-indigo-500/40" />
                    </div>

                    {/* === TIER 2: C-SUITE === */}
                    <div className="mb-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mb-10"
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                                <Briefcase size={14} />
                                Executive Leadership
                            </span>
                        </motion.div>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {cSuite.map((leader, index) => (
                                <ProfileCard
                                    key={leader.id}
                                    leader={leader}
                                    index={index}
                                    size="medium"
                                    onSelect={setSelectedLeader}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Connecting line */}
                    <div className="flex justify-center mb-16 mt-10">
                        <div className="w-px h-16 bg-gradient-to-b from-indigo-500/40 to-purple-500/40" />
                    </div>

                    {/* === TIER 3: SENIOR TEAM === */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mb-10"
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest">
                                <Users size={14} />
                                Senior Team
                            </span>
                        </motion.div>
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {senior.map((leader, index) => (
                                <ProfileCard
                                    key={leader.id}
                                    leader={leader}
                                    index={index}
                                    size="small"
                                    onSelect={setSelectedLeader}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-white/5 bg-black/20 text-center">
                <p className="text-gray-500 text-sm">
                    © 2026 The Wealth Mindset · Legacy, Tradition, & Wealth
                </p>
            </footer>

            {/* Bio Modal */}
            <AnimatePresence>
                {selectedLeader && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-20 bg-black/95 backdrop-blur-md"
                        onClick={() => setSelectedLeader(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-[#0b0f2b] border border-white/10 rounded-[32px] overflow-hidden max-h-full flex flex-col shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedLeader(null)}
                                className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="overflow-y-auto custom-scrollbar">
                                <div className="grid md:grid-cols-2">
                                    <div className="h-96 md:h-auto sticky top-0 relative">
                                        <img
                                            src={selectedLeader.image}
                                            alt={selectedLeader.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f2b] via-transparent to-transparent hidden md:block" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f2b] via-transparent to-transparent md:hidden" />
                                    </div>
                                    <div className="p-8 md:p-12">
                                        <span className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-4 block">
                                            {selectedLeader.role}
                                        </span>
                                        <h3 className="text-4xl font-bold text-white mb-8 border-b border-white/10 pb-6">
                                            {selectedLeader.name}
                                        </h3>
                                        <div className="space-y-6 text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                                            {selectedLeader.longBio}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ProfileCard({ leader, index, size, onSelect }) {
    const sizeClasses = {
        large: 'aspect-[3/4] rounded-[40px]',
        medium: 'aspect-[3/4] rounded-3xl',
        small: 'aspect-[3/4] rounded-2xl',
    };

    const nameClasses = {
        large: 'text-3xl',
        medium: 'text-xl',
        small: 'text-lg',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
        >
            <div
                onClick={() => leader.longBio && onSelect(leader)}
                className={`relative ${sizeClasses[size]} overflow-hidden mb-5 border border-white/10 group-hover:border-indigo-500/30 transition-all duration-500 ${leader.longBio ? 'cursor-pointer' : ''}`}
            >
                <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 right-4 p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <Quote className="text-indigo-400" size={size === 'large' ? 24 : 18} />
                </div>
                {leader.longBio && (
                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-500">
                        <span className="text-white text-xs font-bold flex items-center justify-between">
                            VIEW FULL PROFILE <ChevronRight size={14} />
                        </span>
                    </div>
                )}
            </div>
            <div className="px-1">
                <h3 className={`${nameClasses[size]} font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors`}>
                    {leader.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                    <div className="h-px w-6 bg-indigo-500" />
                    <span className="text-indigo-400 font-bold uppercase tracking-widest text-[10px]">
                        {leader.role}
                    </span>
                </div>
                {size !== 'small' && (
                    <p className="text-gray-400 leading-relaxed text-sm line-clamp-2">
                        {leader.description || leader.bio}
                    </p>
                )}
                {leader.longBio && (
                    <button
                        onClick={() => onSelect(leader)}
                        className="mt-3 text-indigo-400 font-bold text-xs flex items-center gap-1 hover:text-indigo-300 transition-colors"
                    >
                        READ MORE <ChevronRight size={14} />
                    </button>
                )}
            </div>
        </motion.div>
    );
}
