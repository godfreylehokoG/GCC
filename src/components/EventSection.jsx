import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, CreditCard, Wallet, ExternalLink, Copy, Check, ChevronRight } from 'lucide-react';
import EventCard from './EventCard';
import countryData from '../countries.json';

export default function EventSection({ events }) {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [paymentStep, setPaymentStep] = useState('form'); // 'form', 'payment', 'success'
    const [registrationRef, setRegistrationRef] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        country: 'South Africa',
        countryCode: '+27',
        phone: '',
        city: '',
        stateProvince: '',
        postalCode: '',
        interest: 'wealth-preservation',
        referralSource: '',
        reasonForAttending: '',
        occupation: '',
        experienceLevel: 'beginner',
        marketingConsent: true
    });

    const handleFormChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));

        // Auto-update country code if country changes
        if (id === 'country') {
            const found = countryData.find(c => c.name === value);
            if (found) setFormData(prev => ({ ...prev, countryCode: found.code }));
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const generateReference = () => {
        return `${formData.firstName} ${formData.lastName}`;
    };

    const getPrice = () => {
        if (!selectedEvent) return { amount: 0, currency: 'ZAR' };
        const isUS = formData.country === 'United States';

        if (selectedEvent.type === 'gala' || selectedEvent.type === 'lunch') {
            return isUS ? { amount: 50, currency: 'USD' } : { amount: 550, currency: 'ZAR' };
        }
        if (selectedEvent.type === 'seminar') {
            return isUS ? { amount: 20, currency: 'USD' } : { amount: 250, currency: 'ZAR' };
        }
        return { amount: 0, currency: 'ZAR' };
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        const reference = generateReference();
        const pricing = getPrice();

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    fullPhone: `${formData.countryCode}${formData.phone}`,
                    eventId: selectedEvent.id,
                    eventTitle: selectedEvent.title,
                    eventDisplayDate: selectedEvent.displayDate,
                    eventVenue: selectedEvent.venue,
                    eventTime: selectedEvent.time,
                    eventAddress: selectedEvent.address,
                    paymentReference: reference,
                    amount: pricing.amount,
                    currency: pricing.currency,
                    status: pricing.amount > 0 ? 'Pending Payment' : 'Confirmed'
                }),
            });

            let result;
            try {
                result = await response.json();
            } catch {
                throw new Error('Registration failed. Please check your connection and try again.');
            }

            if (!response.ok) {
                throw new Error(result.error || 'Failed to register');
            }

            setRegistrationRef(reference);
            if (pricing.amount > 0) {
                setPaymentStep('payment');
            } else {
                setPaymentStep('success');
            }
        } catch (err) {
            console.error('Registration Error:', err);
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setSelectedEvent(null);
        setPaymentStep('form');
        setSubmitError(null);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            country: 'South Africa',
            countryCode: '+27',
            phone: '',
            city: '',
            stateProvince: '',
            postalCode: '',
            interest: 'wealth-preservation',
            referralSource: '',
            reasonForAttending: '',
            occupation: '',
            experienceLevel: 'beginner',
            marketingConsent: true
        });
    };

    const pricing = getPrice();

    return (
        <section id="events" className="px-6 md:px-10 pb-32">
            {/* Section Header */}
            <div className="text-center mb-16">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-4"
                >
                    Upcoming Events
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold mb-4"
                >
                    South African Tour 2026
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 max-w-2xl mx-auto"
                >
                    Join us at exclusive seminars across South Africa. Learn about GGC, meet our team, and discover how to preserve your wealth with digital gold.
                </motion.p>
            </div>

            {/* Event Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {events.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <EventCard event={event} onRegister={setSelectedEvent} />
                    </motion.div>
                ))}
            </div>

            {/* Registration Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-lg bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-start flex-shrink-0">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{selectedEvent.title}</h3>
                                    <p className="text-white/70 text-sm mt-1">{selectedEvent.displayDate} • {selectedEvent.venue}</p>
                                </div>
                                <button onClick={closeModal} className="text-white/70 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                                {paymentStep === 'form' && (
                                    <form onSubmit={handleFormSubmit} className="space-y-6">
                                        <div className="space-y-4">
                                            <h4 className="text-indigo-400 text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">1. Personal Details</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">First Name</label>
                                                    <input type="text" id="firstName" required disabled={isSubmitting} value={formData.firstName} onChange={handleFormChange} className="form-input-premium w-full" placeholder="John" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Last Name</label>
                                                    <input type="text" id="lastName" required disabled={isSubmitting} value={formData.lastName} onChange={handleFormChange} className="form-input-premium w-full" placeholder="Doe" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Email Address</label>
                                                <input type="email" id="email" required disabled={isSubmitting} value={formData.email} onChange={handleFormChange} className="form-input-premium w-full" placeholder="john@example.com" />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Country</label>
                                                    <select id="country" disabled={isSubmitting} value={formData.country} onChange={handleFormChange} className="form-input-premium w-full appearance-none">
                                                        {countryData.map(c => (
                                                            <option key={c.name} value={c.name} className="bg-gray-900">{c.flag} {c.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Mobile Number</label>
                                                    <div className="flex gap-2">
                                                        <select id="countryCode" value={formData.countryCode} onChange={handleFormChange} disabled={isSubmitting} className="form-input-premium w-16 text-xs text-center">
                                                            {countryData.map(c => (
                                                                <option key={c.name} value={c.code} className="bg-gray-900">{c.code}</option>
                                                            ))}
                                                        </select>
                                                        <input type="tel" id="phone" required disabled={isSubmitting} value={formData.phone} onChange={handleFormChange} className="form-input-premium flex-1" placeholder="82 123 4567" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-indigo-400 text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">2. Additional Info</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">City</label>
                                                    <input type="text" id="city" required disabled={isSubmitting} value={formData.city} onChange={handleFormChange} className="form-input-premium w-full" placeholder="Pietermaritzburg" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Occupation</label>
                                                    <input type="text" id="occupation" required disabled={isSubmitting} value={formData.occupation} onChange={handleFormChange} className="form-input-premium w-full" placeholder="Entrepreneur" />
                                                </div>
                                            </div>
                                        </div>

                                        {submitError && (
                                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                                                {submitError}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    {pricing.amount > 0 ? `PROCEED TO PAYMENT (${pricing.currency} ${pricing.amount})` : 'CONFIRM REGISTRATION'}
                                                    <ChevronRight size={18} />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}

                                {paymentStep === 'payment' && (
                                    <div className="space-y-6 text-center py-4">
                                        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-amber-500/20">
                                            <Wallet size={32} className="text-amber-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">Payment Required</h3>
                                            <p className="text-gray-400 text-sm mt-1">To secure your seat, please complete the payment below.</p>
                                        </div>

                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-4">
                                            <div className="flex justify-between items-center pb-3 border-b border-white/5">
                                                <span className="text-gray-400 text-sm">Amount Due</span>
                                                <span className="text-white font-bold text-lg">{pricing.currency} {pricing.amount}</span>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center group">
                                                    <div>
                                                        <span className="text-gray-500 text-[10px] uppercase font-bold block">Payment Reference (Use Your Full Name)</span>
                                                        <span className="text-indigo-400 font-bold tracking-wider text-lg">{registrationRef}</span>
                                                    </div>
                                                    <button onClick={() => copyToClipboard(registrationRef)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">
                                                        {copySuccess ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                                    </button>
                                                </div>

                                                {formData.country === 'South Africa' ? (
                                                    <div className="pt-2 space-y-2">
                                                        <span className="text-gray-500 text-[10px] uppercase font-bold block">FNB Business EFT Details</span>
                                                        <div className="text-sm space-y-1 text-gray-300">
                                                            <p>Account Holder: <span className="text-white">GGC GLOBAL</span></p>
                                                            <p>Account Number: <span className="text-white">63070529377</span></p>
                                                            <p>Branch Code: <span className="text-white">210835</span></p>
                                                            <p>Swift Code: <span className="text-white">FIRNZAJJ</span></p>
                                                        </div>
                                                    </div>
                                                ) : formData.country === 'United States' ? (
                                                    <div className="pt-2 space-y-2">
                                                        <span className="text-gray-500 text-[10px] uppercase font-bold block">Cash App Handle</span>
                                                        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                                                            <span className="text-white font-bold">$HarvestFeeds</span>
                                                            <a href="https://cash.app/$HarvestFeeds" target="_blank" rel="noreferrer" className="ml-auto text-indigo-400"><ExternalLink size={16} /></a>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="pt-2 space-y-3">
                                                        <span className="text-gray-500 text-[10px] uppercase font-bold block">International Payment</span>
                                                        <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-center space-y-3">
                                                            <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20">
                                                                <CreditCard size={24} className="text-indigo-400" />
                                                            </div>
                                                            <p className="text-white font-bold text-lg">PayPal — Coming Soon</p>
                                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                                International payment via PayPal is being activated. Your registration has been saved and our team will contact you via WhatsApp or email to arrange payment.
                                                            </p>
                                                            <div className="pt-2 border-t border-white/5">
                                                                <p className="text-gray-500 text-xs">Event Price</p>
                                                                <p className="text-white font-bold text-xl">{pricing.currency} {pricing.amount}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <a
                                                href={`https://wa.me/27821234567?text=Hi, I just registered for ${selectedEvent.title} with reference ${registrationRef}. Here is my proof of payment.`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full py-4 rounded-xl bg-green-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-green-500 transition-all"
                                            >
                                                <Check size={20} />
                                                I'VE PAID (SEND PROOF)
                                            </a>
                                            <button onClick={closeModal} className="text-gray-500 text-xs hover:text-gray-300 transition-colors uppercase font-bold tracking-widest">
                                                Close & Pay Later
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {paymentStep === 'success' && (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                                            <Check size={40} className="text-green-500" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Registration Received!</h3>
                                        <p className="text-gray-400 mb-8">
                                            We've sent a confirmation email to {formData.email}. We can't wait to see you there!
                                        </p>
                                        <button onClick={closeModal} className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 font-bold transition-all border border-white/10">
                                            Close
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
