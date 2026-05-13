import { useEffect, useRef, useState } from 'react';
import { useTextScramble } from '../hooks/useTextScramble';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GameplaySectionProps {
  visible: boolean;
  onClose?: () => void;
}

const FEATURES = [
  {
    title: 'Real-Time Battles',
    desc: 'Command your creatures in fast-paced tactical battles. Position units, time abilities, and outmaneuver opponents on dynamic floating arenas.',
    color: '#4ECDC4',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#4ECDC4" strokeWidth="1.5" className="w-8 h-8"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ),
  },
  {
    title: 'Base Building',
    desc: 'Construct and upgrade your floating citadel. Build training grounds, artifact forges, and defensive structures to strengthen your forces.',
    color: '#7B68EE',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#7B68EE" strokeWidth="1.5" className="w-8 h-8"><path d="M3 21h18M5 21V7l8-4 8 4v14M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ),
  },
  {
    title: 'PvP & PvE',
    desc: 'Climb the ranked ladder in competitive PvP, or team up with friends to conquer challenging PvE campaigns across the shattered realm.',
    color: '#D4AF37',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" className="w-8 h-8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" /></svg>
    ),
  },
];

export default function GameplaySection({ visible, onClose }: GameplaySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const headingText = useTextScramble('Jefes de Casa', visible, 800);

  useEffect(() => {
    setInView(true);
  }, []);

  useEffect(() => {
    if (!inView || !sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('.gp-reveal');
    gsap.fromTo(els,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out' }
    );
  }, [inView]);

  return (
    <section ref={sectionRef} className="relative w-full max-w-7xl mx-auto px-8 md:px-12 py-8" style={{ zIndex: 10 }}>
      <div className="w-full flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 space-y-6">
          <div className="gp-reveal">
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-arcane-gold">
              FUERZA
            </span>
          </div>
          <h2 className="gp-reveal font-display text-3xl md:text-5xl text-pure-white">
            {headingText}
          </h2>
          <div className="space-y-4 mt-8">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="gp-reveal glass-card rounded p-6 flex gap-5 transition-all duration-500 hover:translate-x-2 group cursor-default"
                style={{ borderLeftWidth: '3px', borderLeftColor: feature.color }}
              >
                <div className="flex-shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-display text-xl text-pure-white mb-2">{feature.title}</h3>
                  <p className="font-body text-sm text-pale-silver/80 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="gp-reveal w-full md:w-1/2">
          <div className="relative rounded overflow-hidden" style={{ aspectRatio: '16/10' }}>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              style={{ boxShadow: '0 0 60px rgba(212, 175, 55, 0.15)' }}
            >
              <source src="/videos/battle-arena.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-deep-space/40 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
