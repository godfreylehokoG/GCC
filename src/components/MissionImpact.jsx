import { motion } from 'framer-motion';
import { Droplets, GraduationCap, Heart, Users } from 'lucide-react';

const icons = {
    1: Droplets,
    2: GraduationCap,
    3: Heart
};

export default function MissionImpact({ impact }) {
    return (
        <section id="impact" className="py-24 px-6 md:px-10 bg-gradient-to-b from-[#05060f] to-[#0b0f2b]">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
                            Our Social Footprint
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8">{impact.title}</h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-10">
                            Wealth building isn't just about individual success—it's about the legacy we leave for our communities. Through GGC and the Mzilikazi Royal Monarch partnership, we are committed to sustainable local impact.
                        </p>

                        <div className="grid sm:grid-cols-3 gap-6">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <div className="text-3xl font-bold text-indigo-400 mb-1">50+</div>
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Students Supported</div>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <div className="text-3xl font-bold text-indigo-400 mb-1">100%</div>
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Direct To Village</div>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <div className="text-3xl font-bold text-indigo-400 mb-1">1</div>
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Zulu Nation Partner</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="grid gap-6"
                    >
                        {impact.initiatives.map((item) => {
                            const Icon = icons[item.id] || Users;
                            return (
                                <div key={item.id} className="flex gap-6 p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <Icon size={32} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
