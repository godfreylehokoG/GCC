import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section id="home" className="relative min-h-[90vh] flex items-center px-6 md:px-10 py-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto w-full">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                        <span className="text-sm text-indigo-300">Now Touring South Africa</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                    >
                        Mastering the{' '}
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Wealth Mindset
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed"
                    >
                        GGC presents The Wealth Mindset—a premier educational journey blending the timeless stability of gold with modern digital accessibility.
                        Join our royal South African tour to secure your legacy.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap gap-4"
                    >
                        <a
                            href="#events"
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all hover:scale-105 shadow-lg shadow-indigo-500/25"
                        >
                            Join the Tour
                        </a>
                        <a
                            href="#about"
                            className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold hover:bg-white/5 transition-all"
                        >
                            Learn More
                        </a>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex gap-8 mt-12"
                    >
                        {[
                            { label: 'Secure', icon: '🔒' },
                            { label: 'Transparent', icon: '✨' },
                            { label: 'Gold-Backed', icon: '🪙' }
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2">
                                <span className="text-xl">{item.icon}</span>
                                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{item.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right - Logo Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative flex items-center justify-center"
                >
                    {/* Glow Ring */}
                    <div className="absolute w-80 h-80 md:w-96 md:h-96 rounded-full border border-indigo-500/20 animate-pulse" />
                    <div className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full border border-purple-500/20 animate-pulse" style={{ animationDelay: '0.5s' }} />

                    <img
                        src="/WealthMindset-removebg.png"
                        alt="GGC Logo"
                        className="relative z-10 w-64 md:w-80 lg:w-96 h-auto animate-float drop-shadow-[0_20px_50px_rgba(99,102,241,0.4)]"
                    />
                </motion.div>
            </div>
        </section>
    );
}
