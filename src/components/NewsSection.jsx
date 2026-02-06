import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

export default function NewsSection({ news }) {
    return (
        <section id="news" className="px-6 md:px-10 pb-32">
            {/* Section Header */}
            <div className="text-center mb-16">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-4"
                >
                    Latest News
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold mb-4"
                >
                    Stay Updated
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 max-w-2xl mx-auto"
                >
                    The latest announcements, educational content, and tour updates from GGC.
                </motion.p>
            </div>

            {/* News Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {news.map((article, index) => (
                    <motion.article
                        key={article.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 rounded-2xl p-6 cursor-pointer transition-all"
                    >
                        {/* Tag */}
                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-400 border border-indigo-400/30 mb-4">
                            {article.tag}
                        </span>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors line-clamp-2">
                            {article.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                            {article.excerpt}
                        </p>

                        {/* Date */}
                        <div className="flex items-center text-xs text-gray-500">
                            <Calendar size={12} className="mr-2" />
                            <span>{article.date}</span>
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}
