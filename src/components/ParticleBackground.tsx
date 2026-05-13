import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
  twinklePhase: number;
  twinkleSpeed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<ShootingStar[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 60 : 150;
    const CONNECTION_DIST = 120;
    const MOUSE_DIST = 150;
    const SPRING_STRENGTH = 0.02;

    const COLORS = [
      'rgba(78, 205, 196, ',
      'rgba(123, 104, 238, ',
      'rgba(240, 240, 245, ',
    ];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();

    function createParticle(): Particle {
      const colorIdx = Math.random() < 0.5 ? 0 : Math.random() < 0.7 ? 1 : 2;
      return {
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.15,
        radius: 1 + Math.random() * 1.5,
        color: COLORS[colorIdx],
        opacity: 0.15 + Math.random() * 0.3,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.5 + Math.random() * 1.5,
      };
    }

    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, createParticle);

    let lastStarTime = 0;
    const starInterval = () => 3000 + Math.random() * 5000;

    function createShootingStar(): ShootingStar {
      const startX = Math.random() * canvas!.width;
      const startY = Math.random() * canvas!.height * 0.3;
      const angle = Math.PI * 0.25 + Math.random() * Math.PI * 0.5;
      const speed = 3 + Math.random() * 4;
      const isGold = Math.random() > 0.5;
      return {
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 80 + Math.random() * 70,
        opacity: 0.8,
        color: isGold ? '212, 175, 55' : '78, 205, 196',
        life: 0,
        maxLife: 40 + Math.random() * 40,
      };
    }

    function animate(timestamp: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameRef.current++;

      // Update and draw particles
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Drift
        p.x += p.vx;
        p.y += p.vy;

        // Mouse constellation effect
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST && dist > 0) {
          p.vx += (dx / dist) * SPRING_STRENGTH;
          p.vy += (dy / dist) * SPRING_STRENGTH;
        }

        // Damping
        p.vx *= 0.995;
        p.vy *= 0.995;

        // Wrap
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Twinkle
        p.twinklePhase += p.twinkleSpeed * 0.016;
        const twinkle = 0.8 + Math.sin(p.twinklePhase) * 0.2;
        const alpha = p.opacity * twinkle;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + alpha + ')';
        ctx.fill();

        // Connection lines
        if (!isMobile) {
          let connections = 0;
          for (let j = i + 1; j < particles.length && connections < 3; j++) {
            const p2 = particles[j];
            const cdx = p.x - p2.x;
            const cdy = p.y - p2.y;
            const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
            if (cdist < CONNECTION_DIST) {
              connections++;
              const lineAlpha = (1 - cdist / CONNECTION_DIST) * 0.15 * twinkle;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(78, 205, 196, ${lineAlpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      // Shooting stars
      if (timestamp - lastStarTime > starInterval()) {
        starsRef.current.push(createShootingStar());
        lastStarTime = timestamp;
      }

      const stars = starsRef.current;
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.life++;
        s.x += s.vx;
        s.y += s.vy;

        if (s.life > s.maxLife) {
          stars.splice(i, 1);
          continue;
        }

        const lifeRatio = s.life / s.maxLife;
        const alpha = s.opacity * (1 - lifeRatio);

        const gradient = ctx.createLinearGradient(
          s.x, s.y,
          s.x - s.vx * s.length * 0.3,
          s.y - s.vy * s.length * 0.3
        );
        gradient.addColorStop(0, `rgba(${s.color}, ${alpha})`);
        gradient.addColorStop(1, `rgba(${s.color}, 0)`);

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * s.length * 0.3, s.y - s.vy * s.length * 0.3);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      frameRef.current = requestAnimationFrame(animate);
    }

    frameRef.current = requestAnimationFrame(animate);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouse, { passive: true });
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
