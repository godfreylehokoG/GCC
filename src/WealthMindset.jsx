import { useState, useEffect } from "react";

export default function WealthMindset() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const navItems = ["Home", "Events", "Tutorials", "About", "Contact"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f2b] to-[#05060f] text-[#eef2f6] font-[Poppins]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-10 py-5 backdrop-blur bg-black/40">
        <h1 className="text-2xl font-bold text-indigo-400">The Wealth Mindset</h1>
        <button
          aria-label="Toggle Menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className={`space-y-1 transition ${menuOpen ? "rotate-90" : ""}`}
        >
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
      </header>

      {/* Burger Overlay */}
      {menuOpen && (
        <nav className="fixed inset-0 z-40 bg-black/80 backdrop-blur flex flex-col items-center justify-center space-y-10 text-2xl">
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
        </nav>
      )}

      {/* Hero */}
      <section id="home" className="grid md:grid-cols-2 gap-16 px-10 py-32 items-center">
        <div>
          <h2 className="text-5xl font-bold mb-6 leading-tight">Build a Powerful Wealth Mindset</h2>
          <p className="opacity-80 mb-8 max-w-xl">Long-term wealth through discipline, crypto education, and intentional investing.</p>
          <button className="px-10 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold hover:scale-105 transition">Get Started</button>
        </div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg"
          alt="Bitcoin"
          className="animate-[float_6s_ease-in-out_infinite] drop-shadow-[0_20px_40px_rgba(247,147,26,0.35)]"
        />
      </section>

      {/* Events */}
      <section id="events" className="px-10 pb-32">
        <h2 className="text-4xl font-bold mb-12">Upcoming Events</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[{ t: "Crypto Wealth Bootcamp", d: "Feb 20, 2026", l: "Online via Zoom" }, { t: "Web3 Investing AMA", d: "Mar 5, 2026", l: "Twitter Spaces" }, { t: "Mindset & Money Live", d: "Apr 10, 2026", l: "Dubai, UAE" }].map((e) => (
            <div key={e.t} className="bg-white/5 backdrop-blur p-8 rounded-2xl hover:-translate-y-2 transition">
              <h3 className="text-indigo-400 text-xl mb-2">{e.t}</h3>
              <p className="mb-6">📅 {e.d}</p>
              <button
                onClick={() => setLocation(e.l)}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90"
              >
                View Location
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Tutorials */}
      <section id="tutorials" className="px-10 pb-32">
        <h2 className="text-4xl font-bold mb-12">Tutorials</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 backdrop-blur p-6 rounded-2xl hover:-translate-y-1 transition">
              <iframe
                className="w-full h-52 rounded-xl"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Tutorial video"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="grid md:grid-cols-2 gap-16 px-10 pb-32 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-6">About Us</h2>
          <p className="opacity-80 max-w-xl">
            GGC is focused on economic empowerment through education, leadership development, and access to tangible wealth solutions. A key initiative within GGC is gold education and ownership, emphasizing gold coins as a tool for wealth preservation, protection against inflation, and building long-term, generational value rooted in real, physical assets.</p>
        </div>
        <iframe
          className="w-full h-64 rounded-2xl"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="About video"
          allowFullScreen
        />
      </section>

      {/* Contact */}
      <section id="contact" className="px-10 pb-32">
        <h2 className="text-4xl font-bold mb-12">Contact</h2>
        <div className="max-w-md bg-white/5 backdrop-blur p-8 rounded-2xl space-y-4">
          <input placeholder="Name" className="w-full p-3 rounded bg-black/40 outline-none focus:ring-2 focus:ring-indigo-500" />
          <input placeholder="Surname" className="w-full p-3 rounded bg-black/40 outline-none focus:ring-2 focus:ring-indigo-500" />
          <input placeholder="Email" type="email" className="w-full p-3 rounded bg-black/40 outline-none focus:ring-2 focus:ring-indigo-500" />
          <button className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold hover:scale-105 transition">Send Message</button>
        </div>
      </section>

      {/* Location Modal */}
      {location && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center">
          <div className="bg-white/10 p-8 rounded-2xl text-center max-w-sm">
            <h3 className="text-xl mb-4">📍 Event Location</h3>
            <p className="mb-6">{location}</p>
            <button
              onClick={() => setLocation(null)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <footer className="py-10 text-center opacity-60">
        © 2026 The Wealth Mindset · Built for Web3
      </footer>
    </div>
  );
}
