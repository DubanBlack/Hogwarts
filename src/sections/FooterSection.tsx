import { useState } from 'react';

export default function FooterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="relative py-24 md:py-32 px-6" style={{ zIndex: 10, backgroundColor: '#050508' }}>
      <div className="max-w-4xl mx-auto text-center">
        {/* Beta CTA */}
        <h2 className="font-display text-4xl md:text-6xl text-pure-white mb-8 text-glow">
          Join the Beta
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full sm:w-72 px-5 py-3 bg-deep-space border border-pale-silver/30 text-pure-white font-body text-sm rounded-sm placeholder:text-pale-silver/40 focus:outline-none focus:border-ethereal-blue transition-colors duration-300"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-arcane-gold text-deep-space font-body text-sm tracking-[0.04em] uppercase font-medium rounded-full transition-all duration-500 hover:brightness-110 hover:scale-105"
          >
            {submitted ? 'Signed Up!' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div className="w-full h-px bg-pure-white/5 mb-10" />

        {/* Social Links */}
        <div className="flex items-center justify-center gap-8 mb-10">
          {['Twitter', 'Discord', 'Telegram', 'Medium'].map((social) => (
            <button
              key={social}
              className="font-body text-[13px] tracking-[0.04em] uppercase text-pale-silver hover:text-pure-white transition-colors duration-300"
            >
              {social}
            </button>
          ))}
        </div>

        {/* Bottom links */}
        <div className="flex items-center justify-center gap-6">
          <button className="font-mono text-[11px] tracking-[0.08em] uppercase text-pale-silver/50 hover:text-pale-silver transition-colors">
            Privacy Policy
          </button>
          <span className="text-pale-silver/20">·</span>
          <button className="font-mono text-[11px] tracking-[0.08em] uppercase text-pale-silver/50 hover:text-pale-silver transition-colors">
            Terms of Service
          </button>
          <span className="text-pale-silver/20">·</span>
          <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-pale-silver/50">
            &copy; 2026 Cloud Castles
          </span>
        </div>
      </div>
    </footer>
  );
}
