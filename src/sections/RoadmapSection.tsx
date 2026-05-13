import { useEffect, useRef } from 'react';
import { useTextScramble } from '../hooks/useTextScramble';
import gsap from 'gsap';

interface LoreSectionProps {
  visible: boolean;
  onClose?: () => void;
}

export default function LoreSection({ visible, onClose }: LoreSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const SCRAMBLE_DELAY = 300;
   const headingText = useTextScramble('TÍTULO GRANDE', visible, SCRAMBLE_DELAY);

  useEffect(() => {
    if (!contentRef.current) return;
    const els = contentRef.current.querySelectorAll('.reveal-item');
    gsap.fromTo(els,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.1 }
    );
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full max-w-7xl mx-auto px-8 md:px-12 py-8" style={{ zIndex: 10 }}>
      <div className="w-full flex flex-col md:flex-row items-center gap-12">
        {/* Left - Island Image */}
        <div className="reveal-item w-full md:w-1/2">
          <div className="relative rounded overflow-hidden" style={{ aspectRatio: '16/10' }}>
            <img
              src="/images/lore-island.jpg"
              alt="Lore Island"
              className="w-full h-full object-cover"
              style={{ boxShadow: '0 0 60px rgba(78, 205, 196, 0.15), 0 0 120px rgba(78, 205, 196, 0.05)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-space/60 to-transparent" />
          </div>
        </div>

        {/* Right - Content */}
        <div ref={contentRef} className="w-full md:w-1/2 space-y-6">
          <div className="reveal-item" style={{ opacity: 0 }}>
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-ethereal-blue">
              CONTENIDO EXTRA
            </span>
          </div>

          <h2 className="reveal-item font-display text-3xl md:text-4xl lg:text-5xl text-pure-white leading-tight" style={{ opacity: 0,  minHeight: '1.2em'}}>
            {headingText}
          </h2>

          <p className="reveal-item font-body text-lg text-pale-silver leading-relaxed" style={{ opacity: 0 }}>
            Long ago, the sky realm of Elisus was whole — a paradise of floating continents united by ancient magic. When the Rupture came, the realm shattered into countless islands drifting in the cosmic void. Now, warring factions vie for control of the Soul Shards that hold the power to restore — or destroy — what remains.
          </p>

          <p className="reveal-item font-body text-base text-pale-silver/80 leading-relaxed" style={{ opacity: 0 }}>
            As a Sky Commander, you will forge alliances, battle rival factions, and uncover the mysteries of the Rupture. Every creature you collect, every battle you win, brings you closer to the truth behind the shattering.
          </p>

          <div className="reveal-item pt-4" style={{ opacity: 0 }}>
            <button className="group flex items-center gap-3 text-ethereal-blue font-body text-sm tracking-[0.02em] transition-all duration-300">
              <span>Botón</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
