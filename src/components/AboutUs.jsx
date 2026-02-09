import { motion } from 'framer-motion';
import { Target, Rocket, Lightbulb, Quote } from 'lucide-react';

export default function AboutUs({ about }) {
    const { wealthMindset, mission, objectives } = about;

    return (
        <section id="about" className="py-24 px-6 md:px-10 max-w-7xl mx-auto overflow-hidden">
            {/* Header */}
            <div className="text-center mb-20">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-indigo-400 font-semibold tracking-widest uppercase text-sm mb-4 block"
                >
                    Who We Are
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-gray-400 bg-clip-text text-transparent"
                >
                    About Wealth Mindset
                </motion.h2>
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full"
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
                {/* Left Side: Wealth Mindset & Mission */}
                <div className="space-y-12">
                    {/* Wealth Mindset */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Lightbulb size={80} className="text-indigo-400" />
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <Lightbulb size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white">{wealthMindset.title}</h3>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-8 relative z-10">
                            {wealthMindset.description}
                        </p>
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 italic text-indigo-200 text-sm">
                            <Quote size={18} className="text-indigo-500 mt-1 flex-shrink-0" />
                            <p>"{wealthMindset.quote}"</p>
                        </div>
                    </motion.div>

                    {/* Mission */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="group p-8 rounded-3xl bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-white/10 hover:border-purple-500/30 transition-all duration-500 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Rocket size={80} className="text-purple-400" />
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <Rocket size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white">{mission.title}</h3>
                        </div>
                        <p className="text-gray-300 leading-relaxed relative z-10 text-lg">
                            {mission.description}
                        </p>
                    </motion.div>
                </div>

                {/* Right Side: Objectives */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 mb-2"
                    >
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                            <Target size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Our Strategic Objectives</h3>
                    </motion.div>

                    <div className="space-y-6">
                        {objectives.map((obj, idx) => (
                            <motion.div
                                key={obj.id}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                            >
                                <div className="flex items-start gap-5">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                            {obj.title}
                                        </h4>
                                        <p className="text-gray-400 leading-relaxed text-sm">
                                            {obj.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Decorative Video/Image Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="relative rounded-3xl overflow-hidden border border-white/10 aspect-video shadow-2xl mt-12 group"
                    >
                        <iframe
                            className="w-full h-full grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                            src="https://www.youtube.com/embed/bBC-nXj3Ng4?autoplay=1&mute=1&loop=1&playlist=bBC-nXj3Ng4"
                            title="Wealth Mindset Background"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f2b] via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-6 left-6">
                            <span className="px-3 py-1 rounded-full bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest">
                                Legacy in Motion
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
