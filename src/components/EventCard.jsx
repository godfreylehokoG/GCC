import { useState } from 'react';
import { MapPin, Calendar, Clock, Users, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EventCard({ event, onRegister }) {
    const [isHovered, setIsHovered] = useState(false);

    // Calculate days until event
    const eventDate = new Date(event.date);
    const today = new Date();
    const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

    // Status badge styling
    const statusStyles = {
        'limited-seats': { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Limited Seats' },
        'open': { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Open' },
        'vip-access': { bg: 'bg-indigo-500/20', text: 'text-indigo-400', label: 'VIP Selection' },
        'black-tie': { bg: 'bg-slate-500/20', text: 'text-gray-300', label: 'Black Tie Gala' },
        'impact': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Community Impact' },
        'double-session': { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Full Day Intensive' },
        'cultural': { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'Cultural Tour' },
        'sold-out': { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Sold Out' }
    };

    const status = statusStyles[event.status] || statusStyles['open'];
    const capacityPercent = Math.round((event.registered / event.capacity) * 100);

    return (
        <motion.div
            className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -8, scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Background Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

            <div className="relative p-8">
                {/* Header with Status Badge */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${status.bg} ${status.text}`}>
                            {status.label}
                        </span>
                    </div>
                    {daysUntil > 0 && (
                        <div className="text-right">
                            <div className="text-3xl font-bold text-white">{daysUntil}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Days Left</div>
                        </div>
                    )}
                </div>

                {/* City & Title */}
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                        {event.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{event.description}</p>
                </div>

                {/* Event Details */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-300">
                        <Calendar size={16} className="mr-3 text-indigo-400" />
                        <span className="text-sm">{event.displayDate}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                        <Clock size={16} className="mr-3 text-indigo-400" />
                        <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                        <MapPin size={16} className="mr-3 text-indigo-400" />
                        <span className="text-sm">{event.venue}</span>
                    </div>
                </div>

                {/* Capacity Bar */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center text-xs text-gray-400">
                            <Users size={14} className="mr-2" />
                            <span>{event.registered} / {event.capacity} registered</span>
                        </div>
                        <span className="text-xs font-bold text-indigo-400">{capacityPercent}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${capacityPercent}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                        />
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={() => onRegister(event)}
                    disabled={event.status === 'sold-out'}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center gap-2 hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                >
                    <span>{event.status === 'sold-out' ? 'Sold Out' : 'Register Now'}</span>
                    <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
}
