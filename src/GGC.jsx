import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  BarChart3,
  Users,
  TrendingUp,
  Globe,
  Mail,
  ShieldCheck,
  Calendar,
  Play,
} from 'lucide-react';

// Import modular components
import Hero from './components/Hero';
import EventSection from './components/EventSection';
import Academy from './components/Academy';
import NewsSection from './components/NewsSection';
import Philosophy from './components/Philosophy';
import ZoomPortal from './components/ZoomPortal';
import MissionImpact from './components/MissionImpact';
import Partners from './components/Partners';
import GlobalGoldCoin from './components/GlobalGoldCoin';
import Leadership from './components/Leadership';
import BookShowcase from './components/BookShowcase';

// Import data
import siteData from './data.json';

export default function GGC() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your Wealth Mindset Assistant. How can I help you today regarding our 12-week curriculum or the upcoming South African tour?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interest: 'seminar'
  });

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  useEffect(() => {
    const consent = localStorage.getItem('ggc_cookie_consent');
    if (!consent) setShowCookies(true);
  }, []);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setMessages([...messages, { role: 'user', text: chatInput }]);
    setChatInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: "That sounds like a great interest! At Wealth Mindset, we believe education comes before action. Would you like to know more about our next live Zoom masterclass or our legacy outreach projects in the villages?"
      }]);
    }, 1000);
  };

  const acceptCookies = () => {
    localStorage.setItem('ggc_cookie_consent', 'true');
    setShowCookies(false);
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Lead Captured:', formData);
    setFormSubmitted(true);
  };

  const navItems = ["Philosophy", "GGC", "Leadership", "Trainings", "Events", "Tutorials", "News", "Contact"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f2b] to-[#05060f] text-[#eef2f6] font-[Poppins]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 backdrop-blur bg-black/40">
        <a href="#" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src="/WealthMindset-removebg.png" alt="GGC Logo" className="h-10 md:h-12 w-auto" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors"
            >
              {item}
            </a>
          ))}
          <a
            href="https://zoom.us/j/your-meeting-id"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-lg"
          >
            <Play size={16} />
            ZOOM TRAININGS
          </a>
        </nav>

        <div className="flex items-center space-x-4">

          {/* Hamburger (Mobile/Tablet only) */}
          <button
            aria-label="Toggle Menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`lg:hidden space-y-1.5 transition ${menuOpen ? "rotate-90" : ""}`}
          >
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? "opacity-0" : ""}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>
        </div>
      </header>

      {/* Burger Overlay */}
      {menuOpen && (
        <nav className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 text-2xl">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="hover:text-indigo-400 transition"
            >
              {item}
            </a>
          ))}
          <a
            href="https://zoom.us/j/your-meeting-id"
            className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full text-lg font-bold flex items-center gap-3 transition-all"
            onClick={() => setMenuOpen(false)}
          >
            <Play size={24} fill="currentColor" />
            JOIN ZOOM TRAINING
          </a>
        </nav>
      )}

      {/* Hero Section */}
      <Hero />

      {/* Partners Section - Strategic Alliances */}
      <Partners />

      {/* Global Gold Coin - Main Partner & Vehicle */}
      <GlobalGoldCoin data={siteData.globalGoldCoin} />

      {/* Philosophy & Services Section */}
      <Philosophy
        philosophy={siteData.philosophy}
        services={siteData.services}
      />

      {/* Zoom Training Portal */}
      <ZoomPortal trainings={siteData.trainings} />

      {/* Events Section */}
      <EventSection events={siteData.events} />

      {/* Mission & Impact Section */}
      <MissionImpact impact={siteData.philosophy.impact} />

      {/* Academy Section */}
      <Academy lessons={siteData.lessons} curriculum={siteData.curriculum} />

      {/* Leadership Section */}
      <Leadership leadership={siteData.leadership} />

      {/* Book Showcase Section */}
      <BookShowcase book={siteData.book} />

      {/* About Section */}
      <section id="about" className="grid md:grid-cols-2 gap-16 px-6 md:px-10 pb-32 items-center max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-4">
            Our Foundation
          </span>
          <h2 className="text-4xl font-bold mb-6">About Wealth Mindset</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Wealth Mindset is a financial education and mindset development company designed to empower individuals and communities with the knowledge, discipline, and strategic thinking required to build sustainable wealth and long-term legacy.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Focusing on transforming financial behavior by addressing mindset, education, and access to ethical wealth-building tools, Wealth Mindset operates through live trainings, digital education, community engagement, and strategic partnerships.
          </p>
          <div className="bg-indigo-500/5 border border-indigo-500/20 p-6 rounded-2xl italic text-gray-300">
            "Education comes before action. Understanding comes before investment. We believe in providing the roadmap before you take the first step."
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden border border-white/10"
        >
          <iframe
            className="w-full h-64 md:h-80"
            src="https://www.youtube.com/embed/bBC-nXj3Ng4"
            title="How does Bitcoin actually work? - 3Blue1Brown"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>
      </section>


      {/* News Section */}
      <NewsSection news={siteData.news} />

      {/* Contact / Lead Capture */}
      <section id="contact" className="px-6 md:px-10 pb-32 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-2xl form-glass p-8 md:p-10 rounded-3xl shadow-2xl"
        >
          {!formSubmitted ? (
            <div id="form-container">
              <h3 className="text-3xl font-bold mb-2">Register Interest</h3>
              <p className="text-gray-400 mb-8">Join the VIP list for early access and tour info.</p>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleFormChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleFormChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="+27 ..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Interested in</label>
                  <select
                    id="interest"
                    value={formData.interest}
                    onChange={handleFormChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="seminar" className="bg-slate-900">SA Seminars</option>
                    <option value="investment" className="bg-slate-900">GGC Investment</option>
                    <option value="updates" className="bg-slate-900">General Updates</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transform transition-all active:scale-95"
                >
                  SIGN UP NOW
                </button>
              </form>
            </div>
          ) : (
            <div id="success-message" className="text-center py-10">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-3xl font-bold mb-4">You're on the list!</h3>
              <p className="text-gray-400 mb-8">Thank you for your interest. Our team will contact you shortly with details about the tour.</p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="text-indigo-400 font-semibold hover:underline"
              >
                Back to form
              </button>
            </div>
          )}
        </motion.div>
      </section>

      {/* AI CONSULTANT CHAT */}
      <>
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(99,102,241,0.4)] hover:scale-110 transition-transform"
        >
          <MessageSquare size={24} className="text-white" />
        </button>

        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.8 }}
              className="fixed bottom-28 right-8 z-50 w-80 md:w-96 h-[500px] bg-gray-900 border border-indigo-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center font-bold text-indigo-400">AI</div>
                  <span className="text-white font-bold">GGC Assistant</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-white/70 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-white/10 text-gray-200'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-white/10 flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Ask about GGC..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <button onClick={handleSendChat} className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                  <Send size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>


      {/* COOKIE CONSENT */}
      {showCookies && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-6 bg-black/90 backdrop-blur-xl border-t border-indigo-500/30"
        >
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <ShieldCheck className="text-indigo-400 mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-300">
                We use cookies to enhance your experience, analyze our traffic, and provide secure lead capture. By continuing to visit this site you agree to our use of cookies.
              </p>
            </div>
            <div className="flex space-x-4 w-full md:w-auto">
              <button onClick={acceptCookies} className="flex-1 md:flex-none bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-2 rounded-full font-bold transition-all hover:scale-105">
                Accept All
              </button>
              <button onClick={acceptCookies} className="flex-1 md:flex-none border border-white/20 hover:bg-white/5 text-white px-8 py-2 rounded-full font-bold transition-all">
                Preferences
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <img src="/WealthMindset-removebg.png" alt="GGC Logo" className="h-12 w-auto mb-6 mx-auto md:mx-0 grayscale hover:grayscale-0 transition-all" />
            <p className="text-gray-500 max-w-sm mx-auto md:mx-0">
              Empowering individuals and communities with the knowledge and discipline required to build sustainable wealth.
            </p>
          </div>
          <div className="text-center md:text-right space-y-4">
            <div className="text-[10px] uppercase font-bold text-gray-600 tracking-[0.2em] mb-4">Official Disclaimers</div>
            <p className="text-[10px] text-gray-500 leading-relaxed max-w-md ml-auto">
              Wealth Mindset provides educational content and mindset coaching only. We are not a financial advisory firm. No specific financial results or guarantees are provided. All information is for educational purposes to emphasize informed decision-making and long-term thinking.
            </p>
            <p className="text-xs text-gray-400 font-semibold pt-4 italic">
              © 2026 The Wealth Mindset · Legacy, Tradition, & Wealth
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
