import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, X, ChevronRight } from 'lucide-react';

export default function Leadership({ leadership }) {
    const [selectedLeader, setSelectedLeader] = useState(null);

    return (
        <section id="leadership" className="py-24 px-6 md:px-10 bg-gradient-to-b from-[#05060f] to-[#0b0f2b] relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-4"
                    >
                        Visionary Leadership
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        The Minds Behind the Mission
                    </motion.h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Meet the leaders driving the Wealth Mindset movement forward with royal heritage and strategic spiritual guidance.
                    </p>
                </div>

                <div className={`grid ${leadership.filter(l => l.id === 1).length > 1 ? 'md:grid-cols-2' : 'max-w-3xl mx-auto'} gap-12 lg:gap-24`}>
                    {leadership.filter(leader => leader.id === 1).map((leader, index) => (
                        <motion.div
                            key={leader.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="group relative"
                        >
                            {/* Profile Image Container */}
                            <div
                                onClick={() => leader.longBio && setSelectedLeader(leader)}
                                className={`relative aspect-[4/5] rounded-[40px] overflow-hidden mb-8 border border-white/10 group-hover:border-indigo-500/30 transition-all duration-500 ${leader.longBio ? 'cursor-pointer' : ''}`}
                            >
                                <img
                                    src={leader.image}
                                    alt={leader.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                                {/* Float Decoration */}
                                <div className="absolute top-6 right-6 p-4 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                    <Quote className="text-indigo-400" size={24} />
                                </div>

                                {leader.longBio && (
                                    <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-500">
                                        <span className="text-white text-sm font-bold flex items-center justify-between">
                                            VIEW FULL PROFILE <ChevronRight size={16} />
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="px-4">
                                <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                    {leader.name}
                                </h3>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-px w-8 bg-indigo-500" />
                                    <span className="text-indigo-400 font-bold uppercase tracking-widest text-xs">
                                        {leader.role}
                                    </span>
                                </div>
                                <p className="text-gray-400 leading-relaxed text-lg line-clamp-3">
                                    {leader.bio}
                                </p>
                                {leader.longBio && (
                                    <button
                                        onClick={() => setSelectedLeader(leader)}
                                        className="mt-4 text-indigo-400 font-bold text-sm flex items-center gap-2 hover:text-indigo-300 transition-colors"
                                    >
                                        READ MORE <ChevronRight size={16} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bio Modal */}
            <AnimatePresence>
                {selectedLeader && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-20 bg-black/90 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-[#0b0f2b] border border-white/10 rounded-[32px] overflow-hidden max-h-full flex flex-col shadow-2xl"
                        >
                            <button
                                onClick={() => setSelectedLeader(null)}
                                className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="overflow-y-auto custom-scrollbar">
                                <div className="grid md:grid-cols-2">
                                    {/* Modal Image */}
                                    <div className="h-96 md:h-auto sticky top-0">
                                        <img
                                            src={selectedLeader.image}
                                            alt={selectedLeader.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f2b] via-transparent to-transparent hidden md:block" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f2b] via-transparent to-transparent md:hidden" />
                                    </div>

                                    {/* Modal Content */}
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
        </section>
    );
}
