import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import EventCard from './EventCard';
import countryData from '../countries.json';

export default function EventSection({ events }) {
    const navigate = useNavigate();
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



    const generateReference = () => {
        return `${formData.firstName} ${formData.lastName}`;
    };

    const getPrice = () => {
        if (!selectedEvent) return { amount: 0, currency: 'ZAR' };
        const isSA = formData.country === 'South Africa';

        // Use dynamic prices from the event data if available
        const amount = isSA ? (selectedEvent.priceSA ?? 0) : (selectedEvent.priceUS ?? 0);
        const currency = isSA ? 'ZAR' : 'USD';

        return { amount, currency };
    };

    const pricing = getPrice();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        const reference = generateReference();


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

            // Navigate to payment instructions page first
            navigate('/payment-instructions', {
                state: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    country: formData.country,
                    eventTitle: selectedEvent.title,
                    eventDisplayDate: selectedEvent.displayDate,
                    eventVenue: selectedEvent.venue,
                    eventTime: selectedEvent.time,
                    amount: pricing.amount,
                    currency: pricing.currency,
                    reference: reference,
                }
            });

            // Then close modal (this resets state)
            setSelectedEvent(null);
        } catch (err) {
            console.error('Registration Error:', err);
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setSelectedEvent(null);
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



                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
