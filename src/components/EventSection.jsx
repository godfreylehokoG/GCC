import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import EventCard from './EventCard';

export default function EventSection({ events }) {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
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
    const [formSubmitted, setFormSubmitted] = useState(false);

    const countryData = [
        { name: 'South Africa', code: '+27', flag: '🇿🇦' },
        { name: 'Ghana', code: '+233', flag: '🇬🇭' },
        { name: 'Nigeria', code: '+234', flag: '🇳🇬' },
        { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
        { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
        { name: 'United States', code: '+1', flag: '🇺🇸' },
        { name: 'Botswana', code: '+267', flag: '🇧🇼' },
        { name: 'Namibia', code: '+264', flag: '🇳🇦' },
        { name: 'Kenya', code: '+254', flag: '🇰🇪' },
    ];

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

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

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
                    eventTitle: selectedEvent.title
                }),
            });

            // Check if the response is actually JSON before parsing
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error("Non-JSON response received:", text);
                throw new Error("The server didn't respond correctly. Are you running 'npx vercel dev'?");
            }

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to register');
            }

            setFormSubmitted(true);
        } catch (err) {
            console.error('Registration Error:', err);
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setSelectedEvent(null);
        setFormSubmitted(false);
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
                            className="w-full max-w-lg bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{selectedEvent.title}</h3>
                                    <p className="text-white/70 text-sm mt-1">{selectedEvent.displayDate} • {selectedEvent.venue}</p>
                                </div>
                                <button onClick={closeModal} className="text-white/70 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                                {!formSubmitted ? (
                                    <form onSubmit={handleFormSubmit} className="space-y-6">

                                        {/* 1. Personal Identity */}
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
                                                        <select id="countryCode" value={formData.countryCode} onChange={handleFormChange} disabled={isSubmitting} className="form-input-premium w-24 text-center">
                                                            {countryData.map(c => (
                                                                <option key={c.name} value={c.code} className="bg-gray-900">{c.code}</option>
                                                            ))}
                                                        </select>
                                                        <input type="tel" id="phone" required disabled={isSubmitting} value={formData.phone} onChange={handleFormChange} className="form-input-premium flex-1" placeholder="82 123 4567" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 2. Location & Professional */}
                                        <div className="space-y-4">
                                            <h4 className="text-indigo-400 text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">2. Regional & Professional</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">City/Town</label>
                                                    <input type="text" id="city" required disabled={isSubmitting} value={formData.city} onChange={handleFormChange} className="form-input-premium w-full" placeholder="Sandton" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">State/Province</label>
                                                    <input type="text" id="stateProvince" required disabled={isSubmitting} value={formData.stateProvince} onChange={handleFormChange} className="form-input-premium w-full" placeholder="Gauteng" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Postal Code</label>
                                                    <input type="text" id="postalCode" required disabled={isSubmitting} value={formData.postalCode} onChange={handleFormChange} className="form-input-premium w-full" placeholder="2196" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Occupation</label>
                                                    <input type="text" id="occupation" required disabled={isSubmitting} value={formData.occupation} onChange={handleFormChange} className="form-input-premium w-full" placeholder="Business Owner" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* 3. Interest & Background */}
                                        <div className="space-y-4">
                                            <h4 className="text-indigo-400 text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">3. Background & Logistics</h4>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Primary Interest</label>
                                                <select id="interest" disabled={isSubmitting} value={formData.interest} onChange={handleFormChange} className="form-input-premium w-full">
                                                    <option value="wealth-preservation" className="bg-gray-900">Wealth Preservation (Gold)</option>
                                                    <option value="economic-empowerment" className="bg-gray-900">Economic Empowerment</option>
                                                    <option value="ggc-digital-asset" className="bg-gray-900">GGC Digital Asset</option>
                                                    <option value="educational-academy" className="bg-gray-900">Educational Academy</option>
                                                    <option value="partnership" className="bg-gray-900">Partnership Opportunities</option>
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Investment Experience</label>
                                                    <select id="experienceLevel" disabled={isSubmitting} value={formData.experienceLevel} onChange={handleFormChange} className="form-input-premium w-full">
                                                        <option value="beginner" className="bg-gray-900">Beginner</option>
                                                        <option value="intermediate" className="bg-gray-900">Intermediate (Holds Assets)</option>
                                                        <option value="advanced" className="bg-gray-900">Advanced Investor</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">How did you hear about us?</label>
                                                    <select id="referralSource" required disabled={isSubmitting} value={formData.referralSource} onChange={handleFormChange} className="form-input-premium w-full text-sm">
                                                        <option value="" disabled className="bg-gray-900">Select Source</option>
                                                        <option value="facebook" className="bg-gray-900">Facebook / Meta</option>
                                                        <option value="instagram" className="bg-gray-900">Instagram</option>
                                                        <option value="whatsapp" className="bg-gray-900">WhatsApp Community</option>
                                                        <option value="linkedIn" className="bg-gray-900">LinkedIn</option>
                                                        <option value="google" className="bg-gray-900">Google Search</option>
                                                        <option value="friend" className="bg-gray-900">Friend / Referral</option>
                                                        <option value="other" className="bg-gray-900">Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Reason for Attending</label>
                                                <textarea id="reasonForAttending" disabled={isSubmitting} value={formData.reasonForAttending} onChange={handleFormChange} className="form-input-premium w-full py-3 h-24 resize-none" placeholder="What do you hope to learn or achieve at this seminar?" />
                                            </div>

                                            <div className="flex items-start gap-3 pt-2">
                                                <input type="checkbox" id="marketingConsent" checked={formData.marketingConsent} onChange={handleFormChange} disabled={isSubmitting} className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500" />
                                                <label htmlFor="marketingConsent" className="text-xs text-gray-400 leading-relaxed">
                                                    I agree to receive educational content and event updates from GGC. We value your privacy and will never sell your data.
                                                </label>
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
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    REGISTERING...
                                                </>
                                            ) : (
                                                'CONFIRM REGISTRATION'
                                            )}
                                        </button>
                                    </form>

                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">You're Registered!</h3>
                                        <p className="text-gray-400 mb-6">
                                            We'll send confirmation details to your email. See you at {selectedEvent.venue}!
                                        </p>
                                        <button
                                            onClick={closeModal}
                                            className="text-indigo-400 font-semibold hover:underline"
                                        >
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
