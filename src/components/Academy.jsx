import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, BookOpen, Tag, Calendar, ChevronRight } from 'lucide-react';

export default function Academy({ lessons, curriculum }) {
    const [activeCategory, setActiveCategory] = useState('All');

    // Get unique categories
    const categories = ['All', ...new Set(lessons.map(l => l.category))];

    // Filter lessons by category
    const filteredLessons = activeCategory === 'All'
        ? lessons
        : lessons.filter(l => l.category === activeCategory);

    const levelColors = {
        'Orientation': { bg: 'bg-blue-500/20', text: 'text-blue-400' },
        'Beginner': { bg: 'bg-green-500/20', text: 'text-green-400' },
        'Intermediate': { bg: 'bg-amber-500/20', text: 'text-amber-400' },
        'Advanced': { bg: 'bg-red-500/20', text: 'text-red-400' }
    };

    return (
        <section id="tutorials" className="px-6 md:px-10 pb-32 max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-4"
                >
                    Wealth Mindset Academy
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold mb-4"
                >
                    The 12-Week Roadmap
                </motion.h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    A structured journey from wealth consciousness to global financial legacy. Each week explores a critical pillar of your financial future.
                </p>
            </div>

            {/* Curriculum Roadmap Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
                {curriculum.map((item, index) => (
                    <motion.div
                        key={item.week}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -5, borderColor: 'rgba(99, 102, 241, 0.4)' }}
                        className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-indigo-400 font-bold text-lg">Week {item.week}</span>
                            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                <Calendar size={18} />
                            </div>
                        </div>
                        <h4 className="text-xl font-bold mb-2 text-white">{item.title}</h4>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4">
                            {item.focus}
                        </p>
                        <div className="mt-auto flex items-center text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                            Core Curriculum <ChevronRight size={12} className="ml-1" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Video Lessons Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                <div className="text-left">
                    <h3 className="text-3xl font-bold mb-2">Recorded Masterclasses</h3>
                    <p className="text-gray-400 text-sm">Deep-dive sessions to supplement your 12-week study.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${activeCategory === cat
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lessons Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredLessons.map((lesson, index) => {
                    const level = levelColors[lesson.level] || levelColors['Beginner'];
                    return (
                        <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-white/5 border border-white/10 hover:border-indigo-500/30 rounded-[32px] overflow-hidden transition-all flex flex-col"
                        >
                            <div className="relative aspect-video">
                                <iframe
                                    className="w-full h-full"
                                    src={lesson.videoUrl}
                                    title={lesson.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>

                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${level.bg} ${level.text}`}>
                                        {lesson.level}
                                    </span>
                                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                        <Clock size={10} /> {lesson.duration}
                                    </span>
                                </div>
                                <h4 className="text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                                    {lesson.title}
                                </h4>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-6 flex-1">
                                    {lesson.description}
                                </p>
                                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                        <Tag size={12} /> {lesson.category}
                                    </span>
                                    <motion.button
                                        className="p-2 rounded-full bg-white/5 text-white hover:bg-indigo-500 transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileActive={{ scale: 0.9 }}
                                    >
                                        <Play size={16} fill="currentColor" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
