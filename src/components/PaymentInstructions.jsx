import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Copy, ExternalLink, CreditCard, ArrowLeft, Wallet, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function PaymentInstructions() {
    const location = useLocation();
    const data = location.state;
    const [copySuccess, setCopySuccess] = useState(false);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    // If no data was passed (direct URL access), show fallback
    if (!data) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#0b0f2b] to-[#05060f] text-[#eef2f6] font-[Poppins] flex items-center justify-center px-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">No Registration Data</h1>
                    <p className="text-gray-400 mb-8">It looks like you navigated here directly. Please register for an event first.</p>
                    <Link to="/#events" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all">
                        <ArrowLeft size={18} />
                        Back to Events
                    </Link>
                </div>
            </div>
        );
    }

    const { firstName, lastName, country, eventTitle, eventDisplayDate, eventVenue, eventTime, amount, currency, reference } = data;
    const isPaid = amount > 0;
    const fullName = `${firstName} ${lastName}`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0b0f2b] to-[#05060f] text-[#eef2f6] font-[Poppins]">
            {/* Header Bar */}
            <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 backdrop-blur bg-black/40">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <img src="/WealthMindset-removebg.png" alt="GGC Logo" className="h-10 md:h-12 w-auto" />
                </Link>
                <Link to="/#events" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowLeft size={16} />
                    Back to Events
                </Link>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-12">
                {/* Success Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                        <Check size={40} className="text-green-500" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Registration Confirmed!</h1>
                    <p className="text-gray-400 text-lg">
                        {isPaid ? "Complete your payment to secure your seat." : "You're all set! We look forward to seeing you."}
                    </p>
                </motion.div>

                {/* Event Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
                >
                    <h3 className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-4">Event Details</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Event</span>
                            <span className="text-white font-semibold text-right">{eventTitle}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Date</span>
                            <span className="text-white">{eventDisplayDate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Time</span>
                            <span className="text-white">{eventTime}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Venue</span>
                            <span className="text-white text-right">{eventVenue}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Registered As</span>
                            <span className="text-indigo-400 font-bold">{fullName}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Payment Section — only for paid events */}
                {isPaid ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 mb-8"
                    >
                        {/* Amount Due */}
                        <div className="text-center mb-6 pb-6 border-b border-white/10">
                            <p className="text-gray-400 text-sm mb-1">Amount Due</p>
                            <p className="text-4xl font-bold text-white">{currency} {amount}</p>
                        </div>

                        {/* Payment Reference */}
                        <div className="bg-white/5 rounded-xl p-4 mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Payment Reference (Use Your Full Name)</p>
                                <p className="text-indigo-400 font-bold text-xl">{reference}</p>
                            </div>
                            <button onClick={() => copyToClipboard(reference)} className="p-3 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white">
                                {copySuccess ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                            </button>
                        </div>

                        {/* Country-specific payment instructions */}
                        {country === 'South Africa' ? (
                            <div className="space-y-4">
                                <h3 className="text-xs text-amber-400 uppercase font-bold tracking-widest flex items-center gap-2">
                                    <Wallet size={14} />
                                    FNB Business EFT Instructions
                                </h3>
                                <p className="text-gray-400 text-sm">Please use the following bank details to complete your payment. It is critical that you use the reference below.</p>
                                <div className="bg-white/5 rounded-xl p-5 space-y-3 border border-white/5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Bank</span>
                                        <span className="text-white font-semibold">First National Bank (FNB)</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Account Holder</span>
                                        <span className="text-white font-semibold">GGC GLOBAL</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Account Number</span>
                                        <span className="text-white font-mono font-bold">63070529377</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Branch Code</span>
                                        <span className="text-white font-mono">210835</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Swift Code</span>
                                        <span className="text-white font-mono">FIRNZAJJ</span>
                                    </div>
                                </div>
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
                                    <p className="text-amber-300 text-sm font-semibold">
                                        ⚠️ Critical: Use <span className="text-white font-bold">"{reference}"</span> as your EFT payment reference
                                    </p>
                                </div>
                            </div>
                        ) : country === 'United States' ? (
                            <div className="space-y-4">
                                <h3 className="text-xs text-green-400 uppercase font-bold tracking-widest flex items-center gap-2">
                                    <CreditCard size={14} />
                                    Cash App Payment
                                </h3>
                                <p className="text-gray-400 text-sm">Send your payment to the Cash App handle below. Please include your full name as a note.</p>
                                <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-gray-400 text-xs uppercase mb-1">Cash App Handle</p>
                                            <p className="text-white font-bold text-2xl">$HarvestFeeds</p>
                                        </div>
                                        <a href="https://cash.app/$HarvestFeeds" target="_blank" rel="noreferrer"
                                            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-xl text-white text-sm font-bold flex items-center gap-2 transition-all">
                                            Open Cash App
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>
                                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                                    <p className="text-green-300 text-sm font-semibold">
                                        ⚠️ Important: Add <span className="text-white font-bold">"{reference}"</span> as your payment note
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-xs text-indigo-400 uppercase font-bold tracking-widest flex items-center gap-2">
                                    <CreditCard size={14} />
                                    International Payment
                                </h3>
                                <div className="bg-white/5 rounded-xl p-6 border border-white/5 text-center space-y-4">
                                    <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20">
                                        <CreditCard size={28} className="text-indigo-400" />
                                    </div>
                                    <p className="text-white font-bold text-xl">PayPal — Coming Soon</p>
                                    <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
                                        We've saved your registration details! International payment via PayPal is currently being activated for your region.
                                    </p>
                                    <div className="py-3 px-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                                        <p className="text-indigo-300 text-sm font-bold">
                                            You will receive an email as soon as PayPal is active for you to complete your registration.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* WhatsApp & Email Proof of Payment */}
                        {(country === 'South Africa' || country === 'United States') && (
                            <div className="mt-8 space-y-4">
                                <a
                                    href={`https://wa.me/27786511959?text=Hi, I just registered for ${eventTitle}. My name is ${fullName}. I have paid ${currency} ${amount}. Here is my proof of payment.`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-4 rounded-xl bg-green-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-green-500 transition-all"
                                >
                                    <MessageCircle size={20} />
                                    SEND PROOF VIA WHATSAPP
                                </a>
                                <div className="text-center space-y-2 py-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-gray-400 text-sm">
                                        Or email your proof to:
                                    </p>
                                    <a href="mailto:admin@thewealth-mindset.com" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors text-lg">
                                        admin@thewealth-mindset.com
                                    </a>
                                    <p className="text-gray-500 text-xs mt-2 px-6">
                                        Please include your reference <strong className="text-white">"{reference}"</strong> in the email subject for faster verification.
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-10 mb-8 overflow-hidden relative"
                    >
                        {/* Subtle background glow */}
                        <div className="absolute -inset-24 bg-green-500/5 blur-[100px] rounded-full" />

                        <div className="relative z-10 text-center">
                            <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-green-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                <Check size={40} className="text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">No Payment Required</h3>
                            <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                                This is a free outreach event. Your seat has been successfully secured and no further action is needed!
                            </p>

                            <div className="mt-10 py-4 px-6 bg-green-500/10 border border-green-500/20 rounded-2xl inline-block">
                                <p className="text-green-400 font-bold text-sm uppercase tracking-widest">
                                    Registration Confirmed ✅
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Back to Home */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                >
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all"
                    >
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="py-10 px-6 border-t border-white/5 bg-black/20 mt-20">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-xs text-gray-500">
                        © 2026 The Wealth Mindset · Legacy, Tradition, & Wealth
                    </p>
                </div>
            </footer>
        </div >
    );
}
