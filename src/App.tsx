import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Preloader from './components/Preloader';
import ParticleBackground from './components/ParticleBackground';
import IslandScene from './components/IslandScene';
import HUD from './components/HUD';
import LoreSection from './sections/LoreSection';
import CreaturesSection from './sections/CreaturesSection';
import GameplaySection from './sections/GameplaySection';
import GallerySection from './sections/GallerySection';
import RoadmapSection from './sections/RoadmapSection';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_SECTIONS = 5;

export default function App() {
  const [loading, setLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [openSection, setOpenSection] = useState<number | null>(null);
  // scrollProgress continuo 0..1 para IslandScene
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenisRef = useRef<any>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const openSectionRef = useRef<number | null>(null);

  const handlePreloaderComplete = useCallback(() => {
    setLoading(false);
	//agregar ParticleBackground.tsx antes de las islas
    setTimeout(() => setAppReady(true), 0);
  }, []);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (!appReady) return;

    let lenis: any;

    async function initLenis() {
      const Lenis = (await import('@studio-freight/lenis')).default;
      lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
      lenisRef.current = lenis;

      lenis.on('scroll', (e: any) => {
        // Si hay overlay abierto, ignorar el scroll para las islas
        if (openSectionRef.current !== null) return;

        const scrollY = e.scroll;
        const windowHeight = window.innerHeight;
        const totalScrollHeight = windowHeight * (TOTAL_SECTIONS - 1);

        // Progreso continuo 0..1 (para IslandScene)
        const continuousProgress = Math.max(0, Math.min(1, scrollY / totalScrollHeight));
        setScrollProgress(continuousProgress);

        // Sección activa discreta (para HUD dots)
        const newActiveSection = Math.floor(scrollY / windowHeight);
        setActiveSection(Math.min(TOTAL_SECTIONS - 1, Math.max(0, newActiveSection)));

        ScrollTrigger.update();
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    initLenis();

    gsap.ticker.add((time) => {
      if (lenisRef.current) lenisRef.current.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (lenisRef.current) lenisRef.current.destroy();
    };
  }, [appReady]);

  // Bloquear/desbloquear scroll de Lenis cuando se abre/cierra overlay
  useEffect(() => {
    openSectionRef.current = openSection;
    if (lenisRef.current) {
      if (openSection !== null) {
        lenisRef.current.stop();
      } else {
        lenisRef.current.start();
      }
    }
  }, [openSection]);

  // Navigation handler - mueve cámara via scroll Y actualiza scrollProgress inmediatamente
  const handleNavigate = useCallback((index: number) => {
    const targetScroll = index * window.innerHeight;
    const totalScrollHeight = window.innerHeight * (TOTAL_SECTIONS - 1);

    // Actualizar scrollProgress INMEDIATAMENTE para que la isla se mueva al instante
    const immediateProgress = Math.max(0, Math.min(1, targetScroll / totalScrollHeight));
    setScrollProgress(immediateProgress);
    setActiveSection(index);

    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetScroll, { duration: 1.5 });
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }, []);

  // Open section overlay when clicking an island
  const handleIslandClick = useCallback((index: number) => {
    const targetScroll = index * window.innerHeight;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetScroll, { duration: 0.8 });
    }
    setTimeout(() => {
      setOpenSection(index);
    }, 400);
  }, []);

  // Close overlay
  const handleClose = useCallback(() => {
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => setOpenSection(null),
      });
    } else {
      setOpenSection(null);
    }
  }, []);

  // Animate overlay in when openSection changes
  useEffect(() => {
    if (openSection !== null && overlayRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [openSection]);

  // Keyboard ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openSection !== null) handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSection, handleClose]);

  if (loading) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  return (
    <div className="relative">
      <ParticleBackground />

      {/* Canvas 3D siempre visible en el fondo */}
      {appReady && (
        <IslandScene
          scrollProgress={scrollProgress}
          onIslandClick={handleIslandClick}
		  overlayOpen={openSection !== null}
        />
      )}

      {/* HUD siempre visible */}
      {appReady && (
        <HUD
          activeSection={activeSection}
          onNavigate={handleNavigate}
        />
      )}

      {/* Scroll container invisible - solo para mover la cámara */}
      <div className="relative" style={{ zIndex: 2, pointerEvents: 'none' }}>
        {Array.from({ length: TOTAL_SECTIONS }).map((_, i) => (
          <div key={i} className="h-screen w-full" />
        ))}
      </div>

      {/* Overlay de sección */}
      {openSection !== null && (
        <div
          ref={overlayRef}
          className="fixed inset-0 overflow-y-auto"
          style={{ zIndex: 70, background: 'rgba(5, 5, 8, 0.88)', backdropFilter: 'blur(8px)' }}
        >
          {/* Botón cerrar global */}
          <button
            onClick={handleClose}
            className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 transition-all duration-300 font-mono text-[11px] tracking-[0.1em] uppercase text-pale-silver hover:text-pure-white"
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            
          </button>

          {/* Contenido de la sección activa */}
          <div className="min-h-full flex items-center justify-center py-20">
            {openSection === 0 && <LoreSection visible={true} onClose={handleClose} />}
            {openSection === 1 && <CreaturesSection visible={true} onClose={handleClose} />}
            {openSection === 2 && <GameplaySection visible={true} onClose={handleClose} />}
            {openSection === 3 && <GallerySection visible={true} onClose={handleClose} />}
            {openSection === 4 && <RoadmapSection visible={true} onClose={handleClose} />}
          </div>
        </div>
      )}
    </div>
  );
}
