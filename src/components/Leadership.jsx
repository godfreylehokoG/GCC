import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Users, Quote } from 'lucide-react';

export default function Leadership({ leadership }) {
    const navigate = useNavigate();

    // Get founder and the rest of the team
    const founder = leadership.find(l => l.tier === 1);
    const team = leadership.filter(l => l.tier !== 1);

    return (
        <section id="leadership" className="py-24 px-6 md:px-10 bg-gradient-to-b from-[#05060f] to-[#0b0f2b] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left side: Content & Team Teaser */}
                    <div className="text-center lg:text-left">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-6"
                        >
                            Our Team
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold mb-6"
                        >
                            The Minds Behind <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200">the Mission</span>
                        </motion.h2>
                        <p className="text-gray-400 max-w-xl mx-auto lg:mx-0 text-lg leading-relaxed mb-10">
                            A collective of strategic thinkers, royal visionaries, and principled leaders dedicated to bridging traditional heritage with modern economic empowerment.
                        </p>

                        {/* Team Circle Teaser */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 justify-center lg:justify-start">
                            <div className="flex -space-x-4">
                                {team.map((member, i) => (
                                    <motion.div
                                        key={member.id}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="relative group"
                                    >
                                        <div className="w-16 h-16 rounded-full border-2 border-[#05060f] overflow-hidden bg-indigo-900 group-hover:border-indigo-500 transition-colors duration-300 shadow-xl">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {/* Optional tooltip-like label on hover */}
                                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                                            {member.name}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="text-gray-500 text-sm font-medium">
                                <span className="text-white font-bold">+5 Senior Leaders</span>
                                <br /> Coordinating Global Initiatives
                            </div>
                        </div>

                        <motion.button
                            onClick={() => navigate('/leadership')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-indigo-500/20"
                        >
                            Meet Our Leadership <ChevronRight size={18} />
                        </motion.button>
                    </div>

                    {/* Right side: Compact Founder Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative max-w-md mx-auto lg:ml-auto group"
                    >
                        <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 group-hover:border-indigo-500/30 transition-all duration-500">
                            <img
                                src={founder.image}
                                alt={founder.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                            <div className="absolute bottom-8 left-8 right-8">
                                <span className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-2 block">
                                    {founder.role}
                                </span>
                                <h3 className="text-3xl font-bold text-white mb-4">
                                    {founder.name}
                                </h3>
                                <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                                    <Quote size={20} className="text-indigo-400 mb-2 opacity-50" />
                                    <p className="text-gray-300 text-sm italic leading-relaxed">
                                        "{founder.bio}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Floating elements for visual interest */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-600/10 rounded-full blur-2xl" />
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
