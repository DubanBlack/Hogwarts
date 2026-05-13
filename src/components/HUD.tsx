import { useRef, useState } from 'react';

interface HUDProps {
  activeSection: number;
  onNavigate: (index: number) => void;
}

const NAV_ITEMS = [
  { label: 'Clases', index: 0 },
  { label: 'Personal', index: 1 },
  { label: 'Jefes de casa', index: 2 },
  { label: 'Premios anuales', index: 3 },
  { label: 'Roadmap', index: 4 },
];

const ISLAND_NAMES = ['Clases', 'Personal', 'Jefes de casa', 'Premios anuales', 'Roadmap'];
const ISLAND_COLORS = ['#4ECDC4', '#7B68EE', '#D4AF37', '#4ECDC4', '#D4AF37'];

export default function HUD({ activeSection, onNavigate }: HUDProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  return (
    <>
      {/* Top Navigation */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5"
        style={{
          background: 'linear-gradient(to bottom, rgba(5,5,8,0.8) 0%, transparent 100%)',
        }}
      >
        {/* Logo 
        <div className="font-display text-xl md:text-2xl tracking-[0.12em] text-pure-white text-glow">
          titulo
        </div>*/}

        {/* Desktop Nav Links 
        <div className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.index)}
              className={`nav-link-underline font-body text-[13px] tracking-[0.04em] uppercase transition-colors duration-300 ${
                activeSection === item.index
                  ? 'text-pure-white'
                  : 'text-pale-silver hover:text-pure-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>*/}

        {/* Desktop CTA 
        <button className="hidden lg:block px-7 py-2.5 rounded-full border border-ethereal-blue text-ethereal-blue text-[13px] tracking-[0.04em] uppercase font-body transition-all duration-500 hover:bg-ethereal-blue hover:text-deep-space">
          Beta Signup
        </button>*/}

        {/* Mobile menu button */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className={`w-6 h-[1px] bg-pure-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
          <span className={`w-6 h-[1px] bg-pure-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-[1px] bg-pure-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-deep-space/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 lg:hidden">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onNavigate(item.index);
                setMobileMenuOpen(false);
              }}
              className="font-display text-2xl text-pure-white tracking-[0.04em]"
            >
              {item.label}
            </button>
          ))}
         {/*  <button className="mt-4 px-8 py-3 rounded-full border border-ethereal-blue text-ethereal-blue text-sm tracking-[0.04em] uppercase">
            Beta Signup
          </button>*/}
        </div>
      )}

      {/* Radial Island Navigation (Desktop) */}
      <div className="hidden md:flex fixed top-1/2 left-8 -translate-y-1/2 z-50 flex-col gap-6">
        {ISLAND_NAMES.map((name, i) => (
          <button
            key={name}
            onClick={() => onNavigate(i)}
            className="flex flex-row items-center gap-2 group"
          >
            <div
              className="w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-400"
              style={{
                borderColor: activeSection === i ? ISLAND_COLORS[i] : 'rgba(160,160,176,0.4)',
                backgroundColor: activeSection === i ? `${ISLAND_COLORS[i]}33` : 'transparent',
                transform: activeSection === i ? 'scale(1.15)' : 'scale(1)',
              }}
            >

            </div>
            <span
              className="text-[10px] font-mono uppercase tracking-[0.08em] transition-colors duration-300"
              style={{
                color: activeSection === i ? ISLAND_COLORS[i] : 'rgba(160,160,176,0.5)',
              }}
            >
              {name}
            </span>
          </button>
        ))}
      </div>

      {/* Mobile dot navigation */}
      <div className="flex md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 gap-2">
        {ISLAND_NAMES.map((_, i) => (
          <button
            key={i}
            onClick={() => onNavigate(i)}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: activeSection === i ? '#4ECDC4' : 'rgba(160,160,176,0.3)',
              transform: activeSection === i ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </>
  );
}
