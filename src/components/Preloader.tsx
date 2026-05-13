import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [, setProgress] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline();

    // Simulate loading progress
    const progressTl = gsap.timeline({
      onComplete: () => {
        // Exit animation
        const exitTl = gsap.timeline({
          onComplete: () => {
            onComplete();
          }
        });

        exitTl.to(containerRef.current, {
          opacity: 0,
          y: -30,
          duration: 1,
          ease: 'power2.inOut',
        });
      }
    });

    progressTl.to({ value: 0 }, {
      value: 100,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: function() {
        const val = Math.round(this.targets()[0].value);
        setProgress(val);
        if (progressRef.current) {
          progressRef.current.style.width = `${val}%`;
        }
        if (counterRef.current) {
          counterRef.current.textContent = String(val).padStart(2, '0');
        }
      }
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ backgroundColor: '#050508' }}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="font-display text-3xl md:text-4xl tracking-[0.08em] text-pure-white">
            INGRESA AL
          </h1>
          <h1 className="font-display text-3xl md:text-4xl tracking-[0.08em] text-pure-white">
        UNIVERSO DE HOGWARTS
          </h1>
        </div>

        {/* Spinner */}
        <div className="w-8 h-8 border-2 border-pale-silver/30 border-t-arcane-gold rounded-full animate-spin" />

        {/* Progress Bar */}
        <div className="w-60 h-[2px] bg-pale-silver/20 relative overflow-hidden">
          <div
            ref={progressRef}
            className="absolute left-0 top-0 h-full bg-arcane-gold"
            style={{ width: '0%' }}
          />
        </div>

        {/* Counter */}
        <span
          ref={counterRef}
          className="font-mono text-sm text-pale-silver tracking-[0.1em]"
        >
          00
        </span>
      </div>

      {/* Headphones message 
      <div className="absolute bottom-8 flex items-center gap-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-pale-silver">
          <path d="M3 14v3a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
          <path d="M21 14v3a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h1a2 2 0 012 2z" />
          <path d="M5 12V8a7 7 0 0114 0v4" />
        </svg>
        <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-pale-silver/70">
          Enciende el audio
        </span>
      </div>*/}
    </div>
  );
}
