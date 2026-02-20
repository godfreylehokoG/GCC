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
                                <div className="text-center py-12 px-6">
                                    <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                                        <Calendar size={40} className="text-amber-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">Registration Offline</h3>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                                        <p className="text-gray-300 leading-relaxed italic">
                                            "Registration is temporarily offline for schedule updates. Please check back shortly."
                                        </p>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-8">
                                        We are currently refining the tour schedule to accommodate more attendees. Thank you for your patience!
                                    </p>
                                    <button
                                        onClick={closeModal}
                                        className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10"
                                    >
                                        Got it
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
