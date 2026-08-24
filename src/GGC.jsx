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
import Leadership from './components/Leadership';
import BookShowcase from './components/BookShowcase';
import AboutUs from './components/AboutUs';

// Import data
import siteData from './data.json';

async function parseApiResponse(response, fallbackMessage) {
  const responseText = await response.text();

  if (!responseText) {
    return {};
  }

  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error(fallbackMessage);
  }
}

export default function GGC() {
  const [events, setEvents] = useState(siteData.events);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your Wealth Mindset Assistant. How can I help you today regarding our 12-week curriculum or the upcoming South African tour?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');
  const [chatSessionId, setChatSessionId] = useState('');
  const [courseLeadFormOpen, setCourseLeadFormOpen] = useState(false);
  const [courseLeadLoading, setCourseLeadLoading] = useState(false);
  const [courseLeadSubmitted, setCourseLeadSubmitted] = useState(false);
  const [courseLeadError, setCourseLeadError] = useState('');
  const [courseLeadData, setCourseLeadData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    courseInterest: 'wealth-mindset-academy',
    notes: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
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

  useEffect(() => {
    const existingSessionId = localStorage.getItem('ggc_chat_session_id');
    if (existingSessionId) {
      setChatSessionId(existingSessionId);
      return;
    }

    const nextSessionId = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('ggc_chat_session_id', nextSessionId);
    setChatSessionId(nextSessionId);
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetch('/api/events')
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Unable to load events')))
      .then(result => {
        if (isMounted && Array.isArray(result.events)) {
          setEvents(result.events);
        }
      })
      .catch(error => {
        console.warn('Using bundled events:', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSendChat = async () => {
    const nextMessage = chatInput.trim();
    if (!nextMessage || chatLoading) return;

    const nextMessages = [...messages, { role: 'user', text: nextMessage }];
    setMessages(nextMessages);
    setChatInput('');
    setChatLoading(true);
    setChatError('');

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: nextMessage,
          sessionId: chatSessionId,
          history: nextMessages.slice(-8).map(message => ({
            role: message.role === 'ai' ? 'assistant' : 'user',
            content: message.text
          }))
        }),
      });

      const result = await parseApiResponse(
        response,
        'The local API did not return JSON. Use npm run dev:vercel to test chatbot APIs locally.'
      );

      if (!response.ok) {
        throw new Error(result.error || 'The assistant is unavailable right now.');
      }

      setMessages(prev => [...prev, {
        role: 'ai',
        text: result.response || 'I am here to help with Wealth Mindset events, training, and educational resources.',
        provider: result.provider,
        debug: result.debug
      }]);

      if (result.suggestedAction?.type === 'open_course_lead_form') {
        setCourseLeadFormOpen(true);
        setCourseLeadSubmitted(false);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatError(error.message || 'The assistant is unavailable right now.');
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'I am having trouble connecting right now. Please try again in a moment.'
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleCourseLeadChange = (e) => {
    const { id, value } = e.target;
    setCourseLeadData(prev => ({ ...prev, [id]: value }));
  };

  const handleCourseLeadSubmit = async (e) => {
    e.preventDefault();
    setCourseLeadLoading(true);
    setCourseLeadError('');

    try {
      const response = await fetch('/api/course-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseLeadData),
      });

      const result = await parseApiResponse(
        response,
        'The local API did not return JSON. Use npm run dev:vercel to test course registration locally.'
      );

      if (!response.ok) {
        throw new Error(result.error || 'Unable to register your course interest.');
      }

      setCourseLeadSubmitted(true);
      setCourseLeadData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        courseInterest: 'wealth-mindset-academy',
        notes: ''
      });
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Thank you. Your course interest has been registered, and the team will notify you when the courses go live.'
      }]);
    } catch (error) {
      console.error('Course lead form error:', error);
      setCourseLeadError(error.message || 'Unable to register your course interest.');
    } finally {
      setCourseLeadLoading(false);
    }
  };

  const acceptCookies = () => {
    localStorage.setItem('ggc_cookie_consent', 'true');
    setShowCookies(false);
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong. Please try again.');
      }

      console.log('Lead Captured:', result);
      setFormSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', interest: 'seminar' });
    } catch (err) {
      console.error('Lead form error:', err);
      setFormError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const navItems = ["About", "Philosophy", "Leadership", "Trainings", "Events", "Tutorials", "News", "Contact"];

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
            href="/school-uniform-sponsor"
            className="text-sm font-medium text-emerald-300 hover:text-emerald-200 transition-colors"
          >
            Sponsor Uniforms
          </a>
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
            href="/school-uniform-sponsor"
            className="hover:text-emerald-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            Sponsor Uniforms
          </a>
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

      {/* Events Section */}
      <EventSection events={events} />

      {/* Philosophy & Services Section */}
      <Philosophy
        philosophy={siteData.philosophy}
        services={siteData.services}
      />

      {/* Zoom Training Portal */}
      <ZoomPortal trainings={siteData.trainings} />

      {/* Mission & Impact Section */}
      <MissionImpact impact={siteData.philosophy.impact} />

      {/* Academy Section */}
      <Academy lessons={siteData.lessons} curriculum={siteData.curriculum} />

      {/* Leadership Section */}
      <Leadership leadership={siteData.leadership} />

      {/* Book Showcase Section */}
      <BookShowcase book={siteData.book} />

      {/* About Us Section */}
      <AboutUs about={siteData.about} />


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
                {formError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                    {formError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={formLoading}
                  className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transform transition-all active:scale-95 ${formLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {formLoading ? 'SUBMITTING...' : 'SIGN UP NOW'}
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
                  <span className="text-white font-bold">TWM Assistant</span>
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
                      {msg.role === 'ai' && msg.provider && (
                        <div className="mt-2 text-[10px] uppercase tracking-wider text-white/40">
                          {msg.provider === 'aws-bedrock-nova' ? 'v2.8' : 'v2.7'}
                        </div>
                      )}
                      {msg.role === 'ai' && msg.debug?.aiError && (
                        <div className="mt-2 rounded-lg bg-red-500/10 border border-red-500/20 px-2 py-1 text-[10px] text-red-200">
                          {msg.debug.aiError.name}: {msg.debug.aiError.message}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-2xl text-sm bg-white/10 text-gray-400">
                      Thinking...
                    </div>
                  </div>
                )}
                {chatError && (
                  <p className="text-xs text-red-300 px-1">
                    {chatError}
                  </p>
                )}
                {courseLeadFormOpen && (
                  <div className="bg-white/5 border border-indigo-400/30 rounded-2xl p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-white">Course Updates</h4>
                        <p className="text-xs text-gray-400">Get notified when the academy courses go live.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCourseLeadFormOpen(false)}
                        className="text-white/50 hover:text-white"
                        aria-label="Close course registration form"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {courseLeadSubmitted ? (
                      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-xs text-emerald-200">
                        You are registered for course updates.
                      </div>
                    ) : (
                      <form onSubmit={handleCourseLeadSubmit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            id="firstName"
                            type="text"
                            required
                            value={courseLeadData.firstName}
                            onChange={handleCourseLeadChange}
                            placeholder="First name"
                            className="min-w-0 bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                          <input
                            id="lastName"
                            type="text"
                            required
                            value={courseLeadData.lastName}
                            onChange={handleCourseLeadChange}
                            placeholder="Last name"
                            className="min-w-0 bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <input
                          id="email"
                          type="email"
                          required
                          value={courseLeadData.email}
                          onChange={handleCourseLeadChange}
                          placeholder="Email"
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          id="phone"
                          type="tel"
                          required
                          value={courseLeadData.phone}
                          onChange={handleCourseLeadChange}
                          placeholder="Phone"
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                        <select
                          id="courseInterest"
                          value={courseLeadData.courseInterest}
                          onChange={handleCourseLeadChange}
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        >
                          <option value="wealth-mindset-academy" className="bg-slate-900">Wealth Mindset Academy</option>
                          <option value="12-week-roadmap" className="bg-slate-900">12-Week Roadmap</option>
                          <option value="live-zoom-trainings" className="bg-slate-900">Live Zoom Trainings</option>
                          <option value="recorded-masterclasses" className="bg-slate-900">Recorded Masterclasses</option>
                        </select>
                        <textarea
                          id="notes"
                          value={courseLeadData.notes}
                          onChange={handleCourseLeadChange}
                          placeholder="What would you like to learn?"
                          rows={2}
                          className="w-full resize-none bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                        {courseLeadError && (
                          <p className="text-xs text-red-300">{courseLeadError}</p>
                        )}
                        <button
                          type="submit"
                          disabled={courseLeadLoading}
                          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-3 py-2 text-xs font-bold transition-colors"
                        >
                          {courseLeadLoading ? 'Registering...' : 'Register for Updates'}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/10 flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Ask about TWM..."
                  disabled={chatLoading}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleSendChat}
                  disabled={chatLoading || !chatInput.trim()}
                  className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
            <p className="text-gray-500 max-w-sm mx-auto md:mx-0 mb-6">
              Empowering individuals and communities with the knowledge and discipline required to build sustainable wealth.
            </p>
            <div className="space-y-2 text-sm">
              <a href="mailto:info@thewealth-mindset.com" className="flex items-center gap-2 text-gray-400 hover:text-indigo-400 transition-colors justify-center md:justify-start">
                <span>✉️</span>
                <span>info@thewealth-mindset.com</span>
              </a>
              <a href="https://wa.me/27786511959" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors justify-center md:justify-start">
                <span>💬</span>
                <span>+27 78 651 1959</span>
              </a>
            </div>
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
