import { useEffect, useRef, useState } from 'react';
import { useTextScramble } from '../hooks/useTextScramble';

interface HeroSectionProps {
  visible: boolean;
  onExplore: () => void;
}

function AnimatedCounter({ target, suffix = '', delay = 0 }: { target: number; suffix?: string; delay?: number }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const timeout = setTimeout(() => {
      const duration = 1000;
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeout);
  }, [target, delay]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function HeroSection({ visible, onExplore }: HeroSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleText = useTextScramble('HOGWARTS', visible, 1500);

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center relative px-6"
      style={{ zIndex: 10 }}
    >
      <div className="text-center max-w-2xl mx-auto">
        <h1
          ref={titleRef}
          className="font-display text-5xl md:text-7xl lg:text-8xl tracking-[0.12em] text-pure-white text-glow mb-6"
        >
          {titleText}
        </h1>




      </div>

    </section>
  );
}
