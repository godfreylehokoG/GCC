import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, X, Mail, Bell, ChevronRight, BookOpen } from 'lucide-react';

export default function BookShowcase({ book }) {
    const [isReading, setIsReading] = useState(false);
    const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

    return (
        <section id="the book" className="py-24 px-6 md:px-10 bg-gradient-to-b from-[#0b0f2b] to-[#05060f] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Book Mockup Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative flex justify-center"
                    >
                        <div className="relative group">
                            {/* 3D Book Shadow/Glow */}
                            <div className="absolute -inset-4 bg-indigo-500/20 blur-2xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity" />

                            {/* Mockup Container */}
                            <div className="relative w-64 h-96 md:w-80 md:h-[480px] perspective-1000">
                                <motion.div
                                    className="w-full h-full bg-gradient-to-br from-indigo-900 via-[#0b0f2b] to-black rounded-r-lg shadow-2xl border-l-[12px] border-indigo-500/30 overflow-hidden relative"
                                    whileHover={{ rotateY: -15, scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="absolute inset-0 bg-black/20" />
                                    <div className="relative p-10 h-full flex flex-col justify-between">
                                        <div>
                                            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6">
                                                <Book className="text-indigo-400" size={24} />
                                            </div>
                                            <h3 className="text-4xl font-black text-white leading-none uppercase tracking-tighter mb-2">
                                                The<br />Process
                                            </h3>
                                            <div className="h-1 w-12 bg-indigo-500 mb-6" />
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                                Lethukukhanya
                                            </p>
                                            <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] bg-indigo-500/10 px-3 py-1 rounded-full inline-block">
                                                Coming 2026
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Book Spines/Pages effect */}
                                <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/5 skew-y-12 origin-left" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Content & CTA */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-6">
                            New Publication
                        </span>
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            {book.tagline}
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-10">
                            In his much-anticipated debut work, Prince Lethukukhanya distills decades of royal tradition and financial insight into a definitive roadmap for building generational wealth.
                        </p>

                        <div className="flex flex-wrap gap-6 mb-12">
                            <button
                                onClick={() => setIsReading(true)}
                                className="px-8 py-4 rounded-full bg-white text-black font-bold flex items-center gap-3 hover:bg-indigo-50 transition-all group"
                            >
                                <BookOpen size={20} />
                                READ THE PREFACE
                            </button>

                            <button className="px-8 py-4 rounded-full border border-white/20 text-white font-bold flex items-center gap-3 hover:bg-white/5 transition-all">
                                JOIN THE WAITLIST
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Waitlist Form Preview */}
                        <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-sm">
                            {!waitlistSubmitted ? (
                                <div className="flex flex-col md:flex-row gap-4">
                                    <input
                                        type="email"
                                        placeholder="Enter your email for release updates"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                    />
                                    <button
                                        onClick={() => setWaitlistSubmitted(true)}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                                    >
                                        <Bell size={18} />
                                        NOTIFY ME
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 text-green-400 font-bold">
                                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    You're on the list! We'll notify you on release.
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Reading Modal */}
            <AnimatePresence>
                {isReading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-gray-900 border border-indigo-500/20 w-full max-w-4xl h-full max-h-[800px] rounded-[40px] overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-black/40">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                                        <BookOpen size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">The Process</h3>
                                        <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Introduction & Preface</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsReading(false)}
                                    className="p-3 hover:bg-white/5 rounded-full transition-colors text-gray-400"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Scrollable Content Area */}
                            <div className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/creampaper.png')]">
                                <div className="max-w-2xl mx-auto text-gray-800 font-serif">
                                    <div className="mb-12 text-center">
                                        <h4 className="text-3xl font-bold mb-4 text-black">Author's Preface</h4>
                                        <div className="w-12 h-1 bg-indigo-500 mx-auto" />
                                    </div>

                                    <div className="text-lg leading-relaxed space-y-8 first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-indigo-600">
                                        {book.preface.split('\n').map((paragraph, i) => (
                                            <p key={i}>{paragraph}</p>
                                        ))}
                                    </div>

                                    <div className="mt-20 pt-10 border-t border-black/10 text-center italic text-gray-500">
                                        Copyright © 2026 Prince Lethukukhanya. All rights reserved.
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 border-t border-white/10 bg-black/40 text-center">
                                <p className="text-gray-400 text-sm mb-6">Enjoyed this preview? Be the first to read the full book.</p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={() => setIsReading(false)}
                                        className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-500 transition-all"
                                    >
                                        Join the Inner Circle Page
                                    </button>
                                    <button
                                        onClick={() => setIsReading(false)}
                                        className="px-8 py-3 border border-white/20 text-white rounded-full font-bold hover:bg-white/5 transition-all"
                                    >
                                        Close Preview
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
