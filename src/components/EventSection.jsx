import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check } from 'lucide-react';
import EventCard from './EventCard';
import countryData from '../countries.json';

export default function EventSection({ events }) {
    const navigate = useNavigate();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedEventIds, setSelectedEventIds] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [guestCount, setGuestCount] = useState(0);
    const [collectGuestDetails, setCollectGuestDetails] = useState(false);
    const [guestDetails, setGuestDetails] = useState([]);
    const [guestTicketQuantities, setGuestTicketQuantities] = useState({});

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

    const isUpcomingRegistrationEvent = (event) => {
        const eventDate = new Date(event.date);
        const today = new Date();
        const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

        return daysUntil > 0 && event.registrationRequired !== false;
    };

    const publicEvents = events.filter(event => event.visibility !== 'private');
    const registrationEvents = publicEvents.filter(isUpcomingRegistrationEvent);
    const selectedEvents = registrationEvents.filter(event => selectedEventIds.includes(event.id));

    const getEventPrice = (event) => {
        const isSA = formData.country === 'South Africa';
        const amount = isSA ? (event.priceSA ?? 0) : (event.priceUS ?? 0);
        const currency = isSA ? 'ZAR' : 'USD';

        return { amount, currency };
    };

    const getEventAttendeeCount = (event) => {
        if (guestCount <= 0) return 1;

        if (collectGuestDetails) {
            return 1 + guestDetails.filter(guest => guest.eventIds.includes(event.id)).length;
        }

        return 1 + (Number(guestTicketQuantities[event.id]) || 0);
    };

    const getPrice = () => {
        const isSA = formData.country === 'South Africa';
        const currency = isSA ? 'ZAR' : 'USD';
        const amount = selectedEvents.reduce((total, event) => {
            const eventPrice = getEventPrice(event).amount;
            return total + (eventPrice * getEventAttendeeCount(event));
        }, 0);

        return { amount, currency };
    };

    const pricing = getPrice();

    const openRegistration = (event) => {
        setSelectedEvent(event);
        setSelectedEventIds([event.id]);
        setGuestTicketQuantities({ [event.id]: guestCount });
        setSubmitError(null);
    };

    const toggleEventSelection = (eventId) => {
        setSelectedEventIds(prev => {
            const next = prev.includes(eventId)
                ? prev.filter(id => id !== eventId)
                : [...prev, eventId];

            setGuestDetails(currentGuests => currentGuests.map(guest => ({
                ...guest,
                eventIds: guest.eventIds.filter(id => next.includes(id))
            })));

            setGuestTicketQuantities(currentQuantities => next.reduce((quantities, id) => ({
                ...quantities,
                [id]: Math.min(currentQuantities[id] == null ? guestCount : Number(currentQuantities[id]) || 0, guestCount)
            }), {}));

            return next;
        });
    };

    const buildGuestDetails = (count, existingGuests = guestDetails) => {
        return Array.from({ length: count }, (_, index) => existingGuests[index] || {
            fullName: '',
            email: '',
            phone: '',
            eventIds: [...selectedEventIds]
        });
    };

    const handleGuestCountChange = (e) => {
        const nextCount = Math.max(0, Math.min(20, Number(e.target.value) || 0));

        setGuestCount(nextCount);
        setGuestDetails(prev => buildGuestDetails(nextCount, prev));
        setGuestTicketQuantities(prev => selectedEventIds.reduce((quantities, id) => ({
            ...quantities,
            [id]: Math.min(prev[id] == null ? nextCount : Number(prev[id]) || 0, nextCount)
        }), {}));

        if (nextCount === 0) {
            setCollectGuestDetails(false);
        }
    };

    const handleGuestDetailChange = (index, field, value) => {
        setGuestDetails(prev => prev.map((guest, guestIndex) => (
            guestIndex === index ? { ...guest, [field]: value } : guest
        )));
    };

    const toggleGuestEvent = (guestIndex, eventId) => {
        setGuestDetails(prev => prev.map((guest, index) => {
            if (index !== guestIndex) return guest;

            const eventIds = guest.eventIds.includes(eventId)
                ? guest.eventIds.filter(id => id !== eventId)
                : [...guest.eventIds, eventId];

            return { ...guest, eventIds };
        }));
    };

    const handleGuestTicketQuantityChange = (eventId, value) => {
        const nextValue = Math.max(0, Math.min(guestCount, Number(value) || 0));

        setGuestTicketQuantities(prev => ({
            ...prev,
            [eventId]: nextValue
        }));
    };

    const getGuestTicketTotal = () => {
        if (collectGuestDetails) {
            return guestDetails.reduce((total, guest) => total + guest.eventIds.length, 0);
        }

        return selectedEventIds.reduce((total, id) => total + (Number(guestTicketQuantities[id]) || 0), 0);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        const reference = generateReference();

        if (selectedEvents.length === 0) {
            setSubmitError('Please choose at least one event to attend.');
            setIsSubmitting(false);
            return;
        }

        if (guestCount > 0 && collectGuestDetails) {
            const incompleteGuestIndex = guestDetails.findIndex(guest => (
                !guest.fullName.trim() || !guest.email.trim() || !guest.phone.trim() || guest.eventIds.length === 0
            ));

            if (incompleteGuestIndex >= 0) {
                setSubmitError(`Please complete guest ${incompleteGuestIndex + 1}'s details and select at least one event.`);
                setIsSubmitting(false);
                return;
            }
        }

        if (guestCount > 0 && !collectGuestDetails && getGuestTicketTotal() < guestCount) {
            setSubmitError('Please assign each guest to at least one event, or reduce the number of guests.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    fullPhone: `${formData.countryCode}${formData.phone}`,
                    eventId: selectedEvents.map(event => event.id).join(','),
                    eventTitle: selectedEvents.map(event => event.title).join(', '),
                    eventDisplayDate: selectedEvents.map(event => event.displayDate).join(', '),
                    eventVenue: selectedEvents.map(event => event.venue).join(', '),
                    eventTime: selectedEvents.map(event => event.time).join(', '),
                    eventAddress: selectedEvents.map(event => event.address).join(', '),
                    guestCount,
                    collectGuestDetails,
                    guests: collectGuestDetails ? guestDetails.map((guest, index) => ({
                        ...guest,
                        guestIndex: index + 1
                    })) : [],
                    guestTicketQuantities: collectGuestDetails ? {} : guestTicketQuantities,
                    events: selectedEvents.map(event => {
                        const eventPricing = getEventPrice(event);
                        const attendeeCount = getEventAttendeeCount(event);

                        return {
                            id: event.id,
                            title: event.title,
                            displayDate: event.displayDate,
                            venue: event.venue,
                            time: event.time,
                            address: event.address,
                            amount: eventPricing.amount,
                            attendeeCount,
                            lineAmount: eventPricing.amount * attendeeCount,
                            currency: eventPricing.currency
                        };
                    }),
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

            // Log email error to console for debugging if present
            if (result.emailError) {
                console.group('--- EMAIL NOTIFICATION ERROR ---');
                console.error('Priority: High');
                console.error('Status: Registration saved to DB, but email failed.');
                console.error('Resend Error:', result.emailError);
                console.groupEnd();
            }

            // Navigate to payment instructions page first
            navigate('/payment-instructions', {
                state: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    country: formData.country,
                    eventTitle: selectedEvents.map(event => event.title).join(', '),
                    eventDisplayDate: selectedEvents.map(event => event.displayDate).join(', '),
                    eventVenue: selectedEvents.map(event => event.venue).join(', '),
                    eventTime: selectedEvents.map(event => event.time).join(', '),
                    selectedEvents: selectedEvents.map(event => {
                        const eventPricing = getEventPrice(event);
                        const attendeeCount = getEventAttendeeCount(event);

                        return {
                            id: event.id,
                            title: event.title,
                            displayDate: event.displayDate,
                            venue: event.venue,
                            time: event.time,
                            amount: eventPricing.amount,
                            attendeeCount,
                            lineAmount: eventPricing.amount * attendeeCount,
                            currency: eventPricing.currency
                        };
                    }),
                    guestCount,
                    collectGuestDetails,
                    guests: collectGuestDetails ? guestDetails.map((guest, index) => ({
                        ...guest,
                        guestIndex: index + 1,
                        events: selectedEvents
                            .filter(event => guest.eventIds.includes(event.id))
                            .map(event => event.title)
                    })) : [],
                    guestTicketQuantities: collectGuestDetails ? {} : guestTicketQuantities,
                    amount: pricing.amount,
                    currency: pricing.currency,
                    reference: reference,
                }
            });

            // Then close modal (this resets state)
            setSelectedEvent(null);
            setSelectedEventIds([]);
            setGuestCount(0);
            setCollectGuestDetails(false);
            setGuestDetails([]);
            setGuestTicketQuantities({});
        } catch (err) {
            console.error('Registration Error:', err);
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setSelectedEvent(null);
        setSelectedEventIds([]);
        setSubmitError(null);
        setGuestCount(0);
        setCollectGuestDetails(false);
        setGuestDetails([]);
        setGuestTicketQuantities({});
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
                    Join us at Wealth Mindset seminars across South Africa. Learn practical financial principles, connect with our leadership team, and take the next step in building a disciplined legacy.
                </motion.p>
            </div>

            {/* Event Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {publicEvents.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <EventCard event={event} onRegister={openRegistration} />
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
                                    <h3 className="text-xl font-bold text-white">Choose Your Events</h3>
                                    <p className="text-white/70 text-sm mt-1">{selectedEvents.length || 0} selected for registration</p>
                                </div>
                                <button onClick={closeModal} className="text-white/70 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">

                                <form onSubmit={handleFormSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <h4 className="text-indigo-400 text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">Events To Attend</h4>
                                        <div className="space-y-3">
                                            {registrationEvents.map(event => {
                                                const eventPricing = getEventPrice(event);
                                                const isChecked = selectedEventIds.includes(event.id);

                                                return (
                                                    <label
                                                        key={event.id}
                                                        className={`flex items-start gap-3 rounded-2xl border p-4 transition-all cursor-pointer ${isChecked ? 'bg-indigo-500/15 border-indigo-400/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            disabled={isSubmitting}
                                                            onChange={() => toggleEventSelection(event.id)}
                                                            className="sr-only"
                                                        />
                                                        <span className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-all ${isChecked ? 'border-indigo-300 bg-indigo-500 text-white' : 'border-white/20 bg-white/5 text-transparent'}`}>
                                                            <Check size={14} />
                                                        </span>
                                                        <span className="min-w-0 flex-1">
                                                            <span className="block text-sm font-bold text-white">{event.title}</span>
                                                            <span className="block text-xs text-gray-400 mt-1">{event.displayDate} • {event.venue}</span>
                                                        </span>
                                                        <span className="text-sm font-bold text-indigo-300">
                                                            {eventPricing.amount > 0 ? `${eventPricing.currency} ${eventPricing.amount}` : 'Free'}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                                            <span className="text-sm text-gray-400">Total</span>
                                            <span className="text-lg font-bold text-white">{pricing.currency} {pricing.amount}</span>
                                        </div>
                                    </div>

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
                                        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-4">
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
                                                    <select id="countryCode" value={formData.countryCode} onChange={handleFormChange} disabled={isSubmitting} className="form-input-premium !w-24 flex-shrink-0 text-xs px-2">
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

                                    <div className="space-y-4">
                                        <h4 className="text-indigo-400 text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">3. Guests</h4>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">How many guests are coming with you?</label>
                                            <input type="number" min="0" max="20" disabled={isSubmitting} value={guestCount || ''} onChange={handleGuestCountChange} className="form-input-premium w-full" placeholder="0" />
                                        </div>

                                        {guestCount > 0 && (
                                            <div className="space-y-4">
                                                <label className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={collectGuestDetails}
                                                        disabled={isSubmitting}
                                                        onChange={e => {
                                                            setCollectGuestDetails(e.target.checked);
                                                            setGuestDetails(prev => buildGuestDetails(guestCount, prev));
                                                        }}
                                                        className="h-4 w-4 accent-indigo-500"
                                                    />
                                                    <span className="text-sm font-semibold text-white">Add guest names and contact details</span>
                                                </label>

                                                {collectGuestDetails ? (
                                                    <div className="space-y-4">
                                                        {guestDetails.map((guest, index) => (
                                                            <div key={index} className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-4">
                                                                <p className="text-sm font-bold text-white">Guest {index + 1}</p>
                                                                <div>
                                                                    <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Full Name</label>
                                                                    <input type="text" required disabled={isSubmitting} value={guest.fullName} onChange={e => handleGuestDetailChange(index, 'fullName', e.target.value)} className="form-input-premium w-full" placeholder="Guest name" />
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Email Address</label>
                                                                        <input type="email" required disabled={isSubmitting} value={guest.email} onChange={e => handleGuestDetailChange(index, 'email', e.target.value)} className="form-input-premium w-full" placeholder="guest@example.com" />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Phone Number</label>
                                                                        <input type="tel" required disabled={isSubmitting} value={guest.phone} onChange={e => handleGuestDetailChange(index, 'phone', e.target.value)} className="form-input-premium w-full" placeholder="82 123 4567" />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <p className="text-xs font-medium text-gray-500 ml-1">Events Attending</p>
                                                                    <div className="space-y-2">
                                                                        {selectedEvents.map(event => (
                                                                            <label key={event.id} className="flex items-center gap-3 rounded-xl bg-black/20 border border-white/5 px-3 py-2 cursor-pointer">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={guest.eventIds.includes(event.id)}
                                                                                    disabled={isSubmitting}
                                                                                    onChange={() => toggleGuestEvent(index, event.id)}
                                                                                    className="h-4 w-4 accent-indigo-500"
                                                                                />
                                                                                <span className="text-sm text-gray-200">{event.title}</span>
                                                                            </label>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {selectedEvents.map(event => (
                                                            <div key={event.id} className="flex items-center justify-between gap-4 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-semibold text-white truncate">{event.title}</p>
                                                                    <p className="text-xs text-gray-500">Extra guest seats</p>
                                                                </div>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max={guestCount}
                                                                    disabled={isSubmitting}
                                                                    value={guestTicketQuantities[event.id] ?? 0}
                                                                    onChange={e => handleGuestTicketQuantityChange(event.id, e.target.value)}
                                                                    className="form-input-premium !w-24 text-center"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {submitError && (
                                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                                            {submitError}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || selectedEvents.length === 0}
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
