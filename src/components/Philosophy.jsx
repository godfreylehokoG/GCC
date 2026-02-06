import { motion } from 'framer-motion';
import { Video, PlayCircle, Users, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

const iconMap = {
    Video: Video,
    PlayCircle: PlayCircle,
    Users: Users,
    UserCheck: UserCheck
};

export default function Philosophy({ philosophy, services }) {
    return (
        <section id="philosophy" className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
            {/* Problem & Solution Header */}
            <div className="text-center mb-20">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-indigo-400 font-semibold tracking-widest uppercase text-sm mb-4 block"
                >
                    Our Core Philosophy
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
                >
                    Bridging the Gap to Generational Wealth
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-xl md:text-2xl text-indigo-300 italic font-light max-w-3xl mx-auto border-l-4 border-indigo-500 pl-6 text-left md:text-center md:border-l-0 md:pl-0"
                >
                    "{philosophy.quote}"
                </motion.p>
            </div>

            {/* Problem vs Solution Grid */}
            <div className="grid md:grid-cols-2 gap-12 mb-32">
                {/* Problems */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="bg-red-500/5 border border-red-500/10 p-8 rounded-3xl"
                >
                    <h3 className="text-2xl font-bold mb-6 text-red-400 flex items-center gap-2">
                        <AlertCircle size={24} /> The Problem
                    </h3>
                    <ul className="space-y-4">
                        {philosophy.problems.map((problem) => (
                            <li key={problem.id} className="flex items-start gap-3 text-gray-400">
                                <span className="text-red-500 mt-1">•</span>
                                {problem.text}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Solutions */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="bg-green-500/5 border border-green-500/10 p-8 rounded-3xl"
                >
                    <h3 className="text-2xl font-bold mb-6 text-green-400 flex items-center gap-2">
                        <CheckCircle2 size={24} /> Our Solution
                    </h3>
                    <div className="space-y-6">
                        {philosophy.solutions.map((solution) => (
                            <div key={solution.id}>
                                <h4 className="font-bold text-white mb-1">{solution.title}</h4>
                                <p className="text-sm text-gray-400">{solution.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Services Grid */}
            <div className="text-center mb-12">
                <h3 className="text-3xl font-bold mb-4">Our Programs & Services</h3>
                <p className="text-gray-400">Structured pathways to master your financial future.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, idx) => {
                    const IconComponent = iconMap[service.icon];
                    return (
                        <motion.a
                            key={service.id}
                            href={service.link}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                            className="p-8 rounded-3xl border border-white/10 bg-white/5 flex flex-col items-center text-center group transition-all"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                                <IconComponent size={28} />
                            </div>
                            <h4 className="text-xl font-bold mb-3">{service.title}</h4>
                            <p className="text-sm text-gray-400 mb-6 flex-1">{service.desc}</p>
                            <span className="text-indigo-400 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                                Learn More →
                            </span>
                        </motion.a>
                    );
                })}
            </div>
        </section>
    );
}
