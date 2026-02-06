import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Mail, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

export default function ZoomRegistrationModal({ isOpen, onClose, selectedSession }) {
    const [step, setStep] = useState('form'); // 'form' or 'success'
    const [email, setEmail] = useState('');

    if (!isOpen || !selectedSession) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would call your API/Vercel function
        setStep('success');
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-lg bg-gray-900 border border-indigo-500/30 rounded-[40px] overflow-hidden shadow-2xl relative"
                >
                    <button
                        onClick={() => { onClose(); setStep('form'); }}
                        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="p-8 md:p-10">
                        {step === 'form' ? (
                            <>
                                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-8">
                                    <Calendar size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Reserve Your Seat</h3>
                                <p className="text-gray-400 mb-8">
                                    Register for <span className="text-white font-semibold">{selectedSession.title}</span>.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white"
                                            placeholder="you@example.com"
                                        />
                                    </div>

                                    <div className="bg-indigo-500/5 p-4 rounded-2xl flex items-start gap-3 border border-indigo-500/10 mb-2">
                                        <Clock size={16} className="text-indigo-400 mt-1 flex-shrink-0" />
                                        <p className="text-xs text-gray-400">
                                            Access link and worksheet PDF will be sent automatically once registered.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transform transition-all active:scale-95"
                                    >
                                        COMPLETE REGISTRATION
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-6">
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <CheckCircle2 size={40} className="text-green-500" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4">Registration Sent!</h3>
                                <p className="text-gray-400 leading-relaxed mb-8">
                                    We've sent your VIP credentials and the exclusive masterclass worksheet to: <br />
                                    <span className="text-white font-mono text-sm">{email}</span>
                                </p>
                                <button
                                    onClick={() => { onClose(); setStep('form'); }}
                                    className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-full font-bold transition-all border border-white/10"
                                >
                                    Close Window
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
