import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Check,
    Copy,
    CreditCard,
    HeartHandshake,
    Mail,
    MessageCircle,
    Shirt,
    Wallet
} from 'lucide-react';

const initialFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'South Africa',
    city: '',
    sponsorshipType: 'complete-uniform-kit',
    amount: '',
    paymentMethod: 'FNB EFT',
    notes: ''
};

const sponsorshipOptions = [
    { value: 'complete-uniform-kit', label: 'Complete uniform kit' },
    { value: 'school-shoes', label: 'School shoes' },
    { value: 'uniform-items', label: 'Uniform items' },
    { value: 'general-contribution', label: 'General contribution' }
];

export default function SchoolUniformSponsorPage() {
    const [formData, setFormData] = useState(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const reference = fullName ? `UNIFORM - ${fullName}` : 'UNIFORM - Your Full Name';
    const proofMessage = encodeURIComponent(`Hi, I have registered to sponsor the School Uniform Programme. My name is ${fullName || '[Your Name]'}. Payment reference: ${reference}.`);

    function handleChange(event) {
        const { id, value } = event.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    }

    function copyToClipboard(label, text) {
        navigator.clipboard.writeText(text);
        setCopySuccess(label);
        setTimeout(() => setCopySuccess(''), 1800);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const response = await fetch('/api/school-uniform-sponsor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    paymentReference: reference
                })
            });
            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.error || 'Unable to submit your registration.');
            }

            setSubmitted(true);
        } catch (error) {
            setSubmitError(error.message || 'Unable to submit your registration.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#05060f] text-[#eef2f6] font-[Poppins]">
            <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 backdrop-blur bg-black/60 border-b border-white/5">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <img src="/WealthMindset-removebg.png" alt="The Wealth Mindset" className="h-10 md:h-12 w-auto" />
                </Link>
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>
            </header>

            <main>
                <section className="relative min-h-[82vh] overflow-hidden">
                    <img
                        src="/school-uniform-sponsor.png"
                        alt="New school uniforms, shoes, socks, and bags ready for sponsorship"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#05060f] via-[#05060f]/80 to-[#05060f]/20" />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#05060f] to-transparent" />

                    <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-20 min-h-[82vh] flex items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl"
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-400/25 text-emerald-200 text-sm font-bold uppercase tracking-wider mb-6">
                                <HeartHandshake size={16} />
                                School Uniform Sponsorship
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                                Sponsor a learner with school shoes and uniform.
                            </h1>
                            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl mb-8">
                                The Wealth Mindset is supporting school kids with the essentials they need to attend school with dignity, confidence, and focus.
                            </p>
                            <a
                                href="#register"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-500/20"
                            >
                                Register to Sponsor
                                <HeartHandshake size={18} />
                            </a>
                        </motion.div>
                    </div>
                </section>

                <section className="px-6 md:px-10 py-16">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
                        {[
                            ['Shoes', 'School shoes for learners who need durable daily footwear.'],
                            ['Uniform', 'Shirts, trousers, skirts, socks, and other school uniform items.'],
                            ['Dignity', 'A practical contribution that helps children arrive ready to learn.']
                        ].map(([title, text]) => (
                            <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center text-emerald-300 mb-5">
                                    <Shirt size={22} />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
                                <p className="text-gray-400 leading-relaxed">{text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="register" className="px-6 md:px-10 pb-24">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8"
                        >
                            {!submitted ? (
                                <>
                                    <h2 className="text-3xl font-bold mb-2">Sponsor Registration</h2>
                                    <p className="text-gray-400 mb-8">Register your details and use your full name as the payment reference.</p>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <FormInput id="firstName" label="First Name" value={formData.firstName} onChange={handleChange} required />
                                            <FormInput id="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} required />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <FormInput id="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} required />
                                            <FormInput id="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange} required />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <FormInput id="country" label="Country" value={formData.country} onChange={handleChange} required />
                                            <FormInput id="city" label="City" value={formData.city} onChange={handleChange} required />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-400 mb-2">Sponsorship Type</label>
                                                <select id="sponsorshipType" value={formData.sponsorshipType} onChange={handleChange} className="form-input-premium">
                                                    {sponsorshipOptions.map(option => (
                                                        <option key={option.value} value={option.value} className="bg-gray-900">{option.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <FormInput id="amount" label="Amount You Want To Give" type="number" min="0" value={formData.amount} onChange={handleChange} placeholder="550" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-2">Payment Method</label>
                                            <select id="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="form-input-premium">
                                                <option value="FNB EFT" className="bg-gray-900">FNB EFT</option>
                                                <option value="Cash App" className="bg-gray-900">Cash App</option>
                                                <option value="Will confirm with team" className="bg-gray-900">Will confirm with team</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-2">Notes</label>
                                            <textarea
                                                id="notes"
                                                value={formData.notes}
                                                onChange={handleChange}
                                                rows="4"
                                                className="form-input-premium resize-none"
                                                placeholder="Tell us if you want to sponsor a specific learner, school, grade, or item."
                                            />
                                        </div>

                                        {submitError && (
                                            <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm">
                                                {submitError}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Sponsor Registration'}
                                            {!isSubmitting && <Check size={18} />}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-14">
                                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                                        <Check size={40} className="text-emerald-400" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-3">Registration Received</h2>
                                    <p className="text-gray-400 max-w-md mx-auto mb-8">
                                        Thank you for supporting the School Uniform Sponsorship Programme. Please complete payment using the reference below.
                                    </p>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 inline-flex items-center gap-4">
                                        <span className="text-gray-400 text-sm">Reference</span>
                                        <strong className="text-emerald-300">{reference}</strong>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        <aside className="space-y-6">
                            <PaymentCard title="FNB Business EFT" icon={Wallet}>
                                <PaymentRow label="Bank" value="First National Bank (FNB)" />
                                <PaymentRow label="Account Number" value="63070529377" copyLabel="account" onCopy={copyToClipboard} copied={copySuccess} />
                                <PaymentRow label="Branch Code" value="210835" copyLabel="branch" onCopy={copyToClipboard} copied={copySuccess} />
                                <PaymentRow label="Swift Code" value="FIRNZAJJ" copyLabel="swift" onCopy={copyToClipboard} copied={copySuccess} />
                                <PaymentRow label="Reference" value={reference} copyLabel="reference" onCopy={copyToClipboard} copied={copySuccess} />
                            </PaymentCard>

                            <PaymentCard title="Cash App" icon={CreditCard}>
                                <PaymentRow label="Handle" value="$HarvestFeeds" copyLabel="cashapp" onCopy={copyToClipboard} copied={copySuccess} />
                                <a
                                    href="https://cash.app/$HarvestFeeds"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition-all"
                                >
                                    Open Cash App
                                    <CreditCard size={16} />
                                </a>
                            </PaymentCard>

                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                                <h3 className="text-white font-bold mb-4">Send Proof Of Payment</h3>
                                <div className="space-y-3">
                                    <a
                                        href={`https://wa.me/27786511959?text=${proofMessage}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all"
                                    >
                                        <MessageCircle size={18} />
                                        WhatsApp Proof
                                    </a>
                                    <a
                                        href={`mailto:admin@thewealth-mindset.com?subject=${encodeURIComponent(reference)}`}
                                        className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold transition-all"
                                    >
                                        <Mail size={18} />
                                        Email Proof
                                    </a>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>
        </div>
    );
}

function FormInput({ id, label, value, onChange, type = 'text', required = false, placeholder = '', min }) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">{label}</label>
            <input
                id={id}
                type={type}
                required={required}
                min={min}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="form-input-premium"
            />
        </div>
    );
}

function PaymentCard({ title, icon: Icon, children }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h3 className="flex items-center gap-2 text-white font-bold mb-5">
                <Icon size={18} className="text-emerald-300" />
                {title}
            </h3>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );
}

function PaymentRow({ label, value, copyLabel, onCopy, copied }) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl bg-white/5 border border-white/5 px-4 py-3">
            <div className="min-w-0">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{label}</p>
                <p className="text-white font-semibold break-words">{value}</p>
            </div>
            {copyLabel && (
                <button
                    type="button"
                    onClick={() => onCopy(copyLabel, value)}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
                    title={`Copy ${label}`}
                >
                    {copied === copyLabel ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
            )}
        </div>
    );
}
