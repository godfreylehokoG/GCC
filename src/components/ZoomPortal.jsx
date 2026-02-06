import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Clock, CheckCircle2, Shield, PlayCircle } from 'lucide-react';
import ZoomRegistrationModal from './ZoomRegistrationModal';

export default function ZoomPortal({ trainings }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSession, setActiveSession] = useState(null);

    const { nextSession, upcoming, past } = trainings;

    useEffect(() => {
        const timer = setInterval(() => {
            const difference = new Date(nextSession.date) - new Date();
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [nextSession.date]);

    const handleRegister = (session) => {
        setActiveSession(session);
        setIsModalOpen(true);
    };

    return (
        <section id="trainings" className="py-24 px-6 md:px-10 bg-[#05060f] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        Live Portal
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">The Wealth Boardroom</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Exclusive live training for the Wealth Mindset community. {trainings.schedule}.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Hero Card */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-white/10 backdrop-blur-xl relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <span className="text-indigo-400 font-bold mb-2 block uppercase text-sm tracking-wider">Next Live Masterclass</span>
                                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">{nextSession.title}</h3>

                                {/* Countdown Grid */}
                                <div className="grid grid-cols-4 gap-4 mb-8 max-w-md">
                                    {[
                                        { label: 'Days', val: timeLeft.days },
                                        { label: 'Hrs', val: timeLeft.hours },
                                        { label: 'Min', val: timeLeft.minutes },
                                        { label: 'Sec', val: timeLeft.seconds },
                                    ].map((unit, i) => (
                                        <div key={i} className="bg-black/40 border border-white/5 p-4 rounded-2xl text-center">
                                            <div className="text-2xl font-bold text-white mb-1">
                                                {String(unit.val).padStart(2, '0')}
                                            </div>
                                            <div className="text-[10px] uppercase text-gray-500 font-bold tracking-tighter">
                                                {unit.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => handleRegister(nextSession)}
                                        className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-colors group shadow-lg"
                                    >
                                        <Video size={20} />
                                        Reserve My Seat
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Upcoming List */}
                        <div className="space-y-4">
                            <h4 className="text-xl font-bold flex items-center gap-2 mb-4">
                                <Clock size={20} className="text-indigo-400" /> Upcoming Sessions
                            </h4>
                            {upcoming.map((session) => (
                                <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
                                    <div>
                                        <h5 className="font-bold text-lg group-hover:text-indigo-400 transition-colors">{session.title}</h5>
                                        <p className="text-sm text-gray-400">{session.date} • {session.time} CAT</p>
                                    </div>
                                    <button
                                        onClick={() => handleRegister(session)}
                                        className="mt-4 sm:mt-0 px-6 py-2 rounded-full border border-indigo-500/30 text-indigo-400 font-semibold hover:bg-indigo-500 hover:text-white transition-all text-sm"
                                    >
                                        Register
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Past & Checklist */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        {/* Past Recordings */}
                        <div className="p-8 rounded-[40px] bg-white/5 border border-white/10">
                            <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <PlayCircle size={20} className="text-indigo-400" /> Past recordings
                            </h4>
                            <div className="space-y-4">
                                {past.map((session) => (
                                    <div key={session.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0 group mt-2 cursor-pointer" onClick={() => handleRegister(session)}>
                                        <h5 className="text-sm font-bold group-hover:text-indigo-400 transition-colors">{session.title}</h5>
                                        <span className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1 mt-1">
                                            <PlayCircle size={10} /> Request access
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Checklist Card */}
                        <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 opacity-70">
                            <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Shield size={20} className="text-indigo-400" />
                                Prep Checklist
                            </h4>
                            <ul className="space-y-4 text-xs">
                                {['Zoom Client Installed', 'Webcam & Mic Tested', 'Worksheet Ready'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-400">
                                        <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>

            <ZoomRegistrationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedSession={activeSession}
            />
        </section>
    );
}
