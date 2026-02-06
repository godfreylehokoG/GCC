import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function Leadership({ leadership }) {
    return (
        <section id="leadership" className="py-24 px-6 md:px-10 bg-gradient-to-b from-[#05060f] to-[#0b0f2b]">
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

                <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
                    {leadership.map((leader, index) => (
                        <motion.div
                            key={leader.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="group relative"
                        >
                            {/* Profile Image Container */}
                            <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden mb-8 border border-white/10 group-hover:border-indigo-500/30 transition-all duration-500">
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
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    {leader.bio}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
