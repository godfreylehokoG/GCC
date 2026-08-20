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
    StepForward,
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
        <div className="min-h-screen bg-[#f7f4ed] text-[#17211b] font-[Poppins]">
            <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 bg-[#05060f]/95 border-b border-white/10">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <img src="/WealthMindset-removebg.png" alt="The Wealth Mindset" className="h-10 md:h-12 w-auto" />
                </Link>
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>
            </header>

            <main>
                <section className="bg-[#f7f4ed]">
                    <div className="max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-10">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid lg:grid-cols-[0.88fr_1.12fr] gap-8 lg:gap-12 items-end"
                        >
                            <div className="pb-4">
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e3efe6] border border-[#c7dccd] text-[#28573a] text-xs font-bold uppercase tracking-wider mb-6">
                                    <HeartHandshake size={15} />
                                    School Uniform Sponsorship
                                </span>
                                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-[#111814]">
                                    Sponsor a learner with school shoes and uniform.
                                </h1>
                                <p className="text-lg text-[#516058] leading-relaxed max-w-xl mb-8">
                                    The Wealth Mindset is helping school kids receive the essentials they need to attend school with dignity, confidence, and focus.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <a
                                        href="#register"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#22543d] hover:bg-[#1a4431] text-white font-bold transition-colors"
                                    >
                                        Submit Sponsorship Details
                                        <HeartHandshake size={18} />
                                    </a>
                                    <a
                                        href="#payment"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-[#b9c8bd] text-[#26332b] hover:bg-white transition-colors font-bold"
                                    >
                                        View Payment Details
                                    </a>
                                </div>
                            </div>
                            <figure className="overflow-hidden rounded-lg bg-white border border-[#ded8c8] shadow-sm">
                                <img
                                    src="/school-kids.png"
                                    alt="School kids wearing white shirts and grey uniforms"
                                    className="h-[330px] md:h-[520px] w-full object-cover object-center"
                                />
                                <figcaption className="px-4 py-3 text-sm text-[#657067]">
                                    The programme supports learners with practical school essentials, including shoes and uniform items.
                                </figcaption>
                            </figure>
                        </motion.div>
                    </div>
                </section>

                <section className="px-6 md:px-10 py-14 bg-white border-y border-[#e4dfd2]">
                    <div className="max-w-7xl mx-auto space-y-10">
                        <div className="grid lg:grid-cols-3 gap-6">
                            {[
                                ['Shoes', 'School shoes for learners who need durable daily footwear.'],
                                ['Uniform', 'Shirts, trousers, skirts, socks, and other school uniform items.'],
                                ['Dignity', 'A practical contribution that helps children arrive ready to learn.']
                            ].map(([title, text]) => (
                                <div key={title} className="border border-[#e2ddd0] rounded-lg p-6 bg-[#fbfaf6]">
                                    <div className="w-11 h-11 rounded-md bg-[#e3efe6] border border-[#c7dccd] flex items-center justify-center text-[#22543d] mb-5">
                                        <Shirt size={22} />
                                    </div>
                                    <h2 className="text-xl font-bold text-[#17211b] mb-2">{title}</h2>
                                    <p className="text-[#5e6b62] leading-relaxed">{text}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-center">
                            <div>
                                <span className="text-[#22543d] text-xs font-bold uppercase tracking-widest">What Sponsorship Provides</span>
                                <h2 className="text-3xl md:text-4xl font-bold text-[#17211b] mt-3 mb-4">
                                    Practical school essentials, prepared with care.
                                </h2>
                                <p className="text-[#5e6b62] leading-relaxed text-lg">
                                    Contributions go toward school shoes, shirts, socks, and uniform items for learners who need support. This keeps the focus on a simple outcome: helping children arrive at school ready and confident.
                                </p>
                                <p className="mt-5 text-sm text-[#6f7a72]">
                                    Suggested reference for payments: <strong className="text-[#17211b]">{reference}</strong>
                                </p>
                            </div>
                            <figure className="rounded-lg overflow-hidden border border-[#ded8c8] bg-[#f7f4ed] shadow-sm">
                                <img
                                    src="/school-uniform-sponsor.png"
                                    alt="New school uniforms, shoes, socks, and bags ready for sponsorship"
                                    className="w-full"
                                />
                                <figcaption className="px-4 py-3 text-sm text-[#657067]">
                                    Example of the shoes, socks, shirts, and uniform items covered by sponsorship contributions.
                                </figcaption>
                            </figure>
                        </div>
                    </div>
                </section>

                <section className="px-6 md:px-10 py-14">
                    <div className="max-w-7xl mx-auto">
                        <div className="max-w-2xl mb-8">
                            <span className="text-[#22543d] text-xs font-bold uppercase tracking-widest">How It Works</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#17211b] mt-3">A simple, trackable process.</h2>
                        </div>
                        <div className="grid md:grid-cols-4 gap-4">
                            {[
                                ['Register', 'Submit your sponsorship details below.'],
                                ['Pay', 'Use FNB EFT or Cash App with your full-name reference.'],
                                ['Send Proof', 'Send proof of payment by WhatsApp or email.'],
                                ['Allocate', 'The team confirms and allocates support to learners.']
                            ].map(([title, text], index) => (
                                <div key={title} className="bg-white border border-[#e2ddd0] rounded-lg p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-9 h-9 rounded-md bg-[#22543d] text-white flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <StepForward size={18} className="text-[#22543d]" />
                                    </div>
                                    <h3 className="font-bold text-[#17211b] mb-2">{title}</h3>
                                    <p className="text-sm leading-relaxed text-[#5e6b62]">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="register" className="px-6 md:px-10 pb-24">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white border border-[#e2ddd0] rounded-lg p-6 md:p-8 shadow-sm"
                        >
                            {!submitted ? (
                                <>
                                    <h2 className="text-3xl font-bold mb-2 text-[#17211b]">Sponsor Registration</h2>
                                    <p className="text-[#5e6b62] mb-8">Register your details and use your full name as the payment reference.</p>

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
                                                <label className="block text-xs font-semibold text-[#4f5d55] mb-2">Sponsorship Type</label>
                                                <select id="sponsorshipType" value={formData.sponsorshipType} onChange={handleChange} className="w-full rounded-md border border-[#cfd8d1] bg-white px-4 py-3 text-sm text-[#17211b] outline-none transition-colors focus:border-[#22543d] focus:ring-2 focus:ring-[#22543d]/10">
                                                    {sponsorshipOptions.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <FormInput id="amount" label="Amount You Want To Give" type="number" min="0" value={formData.amount} onChange={handleChange} placeholder="550" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-[#4f5d55] mb-2">Payment Method</label>
                                            <select id="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full rounded-md border border-[#cfd8d1] bg-white px-4 py-3 text-sm text-[#17211b] outline-none transition-colors focus:border-[#22543d] focus:ring-2 focus:ring-[#22543d]/10">
                                                <option value="FNB EFT">FNB EFT</option>
                                                <option value="Cash App">Cash App</option>
                                                <option value="Will confirm with team">Will confirm with team</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-[#4f5d55] mb-2">Notes</label>
                                            <textarea
                                                id="notes"
                                                value={formData.notes}
                                                onChange={handleChange}
                                                rows="4"
                                                className="w-full resize-none rounded-md border border-[#cfd8d1] bg-white px-4 py-3 text-sm text-[#17211b] outline-none transition-colors focus:border-[#22543d] focus:ring-2 focus:ring-[#22543d]/10"
                                                placeholder="Tell us if you want to sponsor a specific learner, school, grade, or item."
                                            />
                                        </div>

                                        {submitError && (
                                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                                                {submitError}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-4 rounded-md bg-[#22543d] hover:bg-[#1a4431] text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Sponsorship Details'}
                                            {!isSubmitting && <Check size={18} />}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-14">
                                    <div className="w-20 h-20 bg-[#e3efe6] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#c7dccd]">
                                        <Check size={40} className="text-[#22543d]" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-3 text-[#17211b]">Registration Received</h2>
                                    <p className="text-[#5e6b62] max-w-md mx-auto mb-8">
                                        Thank you for supporting the School Uniform Sponsorship Programme. Please complete payment using the reference below.
                                    </p>
                                    <div className="bg-[#f7f4ed] border border-[#e2ddd0] rounded-md px-5 py-4 inline-flex items-center gap-4">
                                        <span className="text-[#657067] text-sm">Reference</span>
                                        <strong className="text-[#22543d]">{reference}</strong>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        <aside id="payment" className="space-y-6">
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
                                    className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-md bg-[#22543d] hover:bg-[#1a4431] text-white font-bold transition-colors"
                                >
                                    Open Cash App
                                    <CreditCard size={16} />
                                </a>
                            </PaymentCard>

                            <div className="bg-white border border-[#e2ddd0] rounded-lg p-6 shadow-sm">
                                <h3 className="text-[#17211b] font-bold mb-2">Send Proof Of Payment</h3>
                                <p className="text-sm text-[#657067] mb-4">Use WhatsApp or email after your EFT or Cash App payment is complete.</p>
                                <div className="space-y-3">
                                    <a
                                        href={`https://wa.me/27786511959?text=${proofMessage}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-md bg-[#22543d] hover:bg-[#1a4431] text-white font-bold transition-colors"
                                    >
                                        <MessageCircle size={18} />
                                        WhatsApp Proof
                                    </a>
                                    <a
                                        href={`mailto:admin@thewealth-mindset.com?subject=${encodeURIComponent(reference)}`}
                                        className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-md border border-[#b9c8bd] text-[#26332b] hover:bg-[#f7f4ed] font-bold transition-colors"
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
            <label className="block text-xs font-semibold text-[#4f5d55] mb-2">{label}</label>
            <input
                id={id}
                type={type}
                required={required}
                min={min}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-md border border-[#cfd8d1] bg-white px-4 py-3 text-sm text-[#17211b] outline-none transition-colors focus:border-[#22543d] focus:ring-2 focus:ring-[#22543d]/10"
            />
        </div>
    );
}

function PaymentCard({ title, icon: Icon, children }) {
    return (
        <div className="bg-white border border-[#e2ddd0] rounded-lg p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-[#17211b] font-bold mb-5">
                <Icon size={18} className="text-[#22543d]" />
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
        <div className="flex items-center justify-between gap-4 rounded-md bg-[#f7f4ed] border border-[#e2ddd0] px-4 py-3">
            <div className="min-w-0">
                <p className="text-xs text-[#6f7a72] uppercase font-bold tracking-wider">{label}</p>
                <p className="text-[#17211b] font-semibold break-words">{value}</p>
            </div>
            {copyLabel && (
                <button
                    type="button"
                    onClick={() => onCopy(copyLabel, value)}
                    className="p-2 rounded-md text-[#657067] hover:text-[#17211b] hover:bg-white transition-colors flex-shrink-0"
                    title={`Copy ${label}`}
                >
                    {copied === copyLabel ? <Check size={18} className="text-[#22543d]" /> : <Copy size={18} />}
                </button>
            )}
        </div>
    );
}
