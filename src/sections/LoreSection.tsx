import { useEffect, useRef } from 'react';
import { useTextScramble } from '../hooks/useTextScramble';
import gsap from 'gsap';

interface CreaturesSectionProps {
  visible: boolean;
  onClose?: () => void;
}

const CREATURE_CLASSES = [
  { name: 'Adivinación', element: 'Fire', desc: 'Creatures of flame and fury. Masters of destruction and area damage.', count: '2,400+', color: '#FF6B35', icon: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12"><circle cx="24" cy="28" r="12" stroke="#FF6B35" strokeWidth="2" /><path d="M24 8c0 0-8 10-8 18" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" /><path d="M24 8c0 0 8 10 8 18" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" /><circle cx="24" cy="26" r="4" fill="#FF6B35" opacity="0.3" /></svg>
  )},
  { name: 'Aritmancia', element: 'Water', desc: 'Fluid beings of the deep. Healers and strategic controllers.', count: '1,800+', color: '#4ECDC4', icon: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12"><path d="M24 8c-8 8-16 16-16 24 0 8.8 7.2 16 16 16s16-7.2 16-16c0-8-8-16-16-24z" stroke="#4ECDC4" strokeWidth="2" /><path d="M18 36c0-4 2.7-8 6-8s6 4 6 8" stroke="#4ECDC4" strokeWidth="1.5" strokeLinecap="round" /></svg>
  )},
  { name: 'Terra', element: 'Earth', desc: 'Stone guardians of the. Unmatched defense and resilience.', count: '2,100+', color: '#8B7355', icon: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12"><path d="M8 36l16-28 16 28H8z" stroke="#8B7355" strokeWidth="2" strokeLinejoin="round" /><circle cx="24" cy="32" r="4" stroke="#8B7355" strokeWidth="1.5" /></svg>
  )},
  { name: 'Aer', element: 'Air', desc: 'Swift spirits of the wind. Speed and precision in every strike.', count: '1,600+', color: '#A0C4E8', icon: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12"><path d="M8 20h24c4.4 0 8-3.6 8-8s-3.6-8-8-8" stroke="#A0C4E8" strokeWidth="2" strokeLinecap="round" /><path d="M8 28h16c2.2 0 4 1.8 4 4s-1.8 4-4 4" stroke="#A0C4E8" strokeWidth="2" strokeLinecap="round" /><path d="M8 36h8" stroke="#A0C4E8" strokeWidth="2" strokeLinecap="round" /></svg>
  )},
  { name: 'Lux', element: 'Light', desc: 'Radiant beings of purity. Support and blessing magic specialists.', count: '1,900+', color: '#FFD700', icon: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12"><circle cx="24" cy="24" r="8" stroke="#FFD700" strokeWidth="2" /><path d="M24 8v4M24 36v4M8 24h4M36 24h4M12.7 12.7l2.8 2.8M32.5 32.5l2.8 2.8M12.7 35.3l2.8-2.8M32.5 15.5l2.8-2.8" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" /></svg>
  )},
  { name: 'Umbra', element: 'Dark', desc: 'Shadow dwellers of mystery. Stealth and curse magic experts.', count: '1,500+', color: '#6B5B95', icon: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12"><path d="M24 8v32c-8.8 0-16-7.2-16-16s7.2-16 16-16z" stroke="#6B5B95" strokeWidth="2" /><circle cx="28" cy="24" r="4" stroke="#6B5B95" strokeWidth="1.5" /></svg>
  )},
  { name: 'Natura', element: 'Nature', desc: 'Guardians of the wild. Summoners and growth magic wielders.', count: '2,200+', color: '#7CB342', icon: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12"><path d="M24 40V20" stroke="#7CB342" strokeWidth="2" strokeLinecap="round" /><path d="M24 20c0-8 6-14 12-14-2 6-6 10-12 10z" stroke="#7CB342" strokeWidth="2" strokeLinejoin="round" /><path d="M24 24c0-6-4-10-10-10 2 4 4 8 10 8z" stroke="#7CB342" strokeWidth="2" strokeLinejoin="round" /><path d="M20 40h8" stroke="#7CB342" strokeWidth="2" strokeLinecap="round" /></svg>
  )},
  { name: 'Fulgur', element: 'Lightning', desc: 'Storm riders of chaos. Burst damage and chain attack masters.', count: '1,700+', color: '#FFEB3B', icon: (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12"><path d="M26 8L16 26h8l-4 14 16-20h-8l6-12h-8z" stroke="#FFEB3B" strokeWidth="2" strokeLinejoin="round" /></svg>
  )},
];

export default function CreaturesSection({ visible, onClose }: CreaturesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const SCRAMBLE_DELAY = 500;
   const headingText = useTextScramble('CLASES ACTIVAS', visible, SCRAMBLE_DELAY);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('.creature-reveal');
    gsap.fromTo(els,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
    );
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full max-w-5xl mx-auto px-8 md:px-12 py-8" style={{ zIndex: 10 }}>
      <div className="flex flex-col items-center justify-center">
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <span className="creature-reveal font-mono text-[11px] tracking-[0.2em] uppercase text-mystic-violet block mb-4">
            MES VIGENTE
          </span>
          <h2 className="creature-reveal font-display text-3xl md:text-5xl text-pure-white mb-4" style={{ opacity: 0,  minHeight: '1.2em'}}>
            {headingText}
          </h2>
          <p className="creature-reveal font-body text-base md:text-lg text-pale-silver leading-relaxed">
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto w-full">
          {CREATURE_CLASSES.map((cls, i) => (
            <div
              key={cls.name}
              className="creature-reveal glass-card rounded p-4 md:p-5 flex flex-col items-center text-center transition-all duration-600 hover:-translate-y-2 group cursor-pointer"
              style={{ opacity: 0, transitionDelay: `${i * 50}ms` }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `${cls.color}40`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${cls.color}15`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div className="mb-3 transition-transform duration-300 group-hover:scale-110">
                {cls.icon}
              </div>
              <h3 className="font-display text-lg text-pure-white mb-1">{cls.name}</h3>
              <p className="font-body text-xs text-pale-silver/70 leading-snug mb-2 line-clamp-2">{cls.desc}</p>
              <span className="font-mono text-[10px] tracking-[0.08em] uppercase" style={{ color: cls.color }}>
                {cls.count} species
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
