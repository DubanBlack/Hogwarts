import { useEffect, useRef, useState } from 'react';
import { useTextScramble } from '../hooks/useTextScramble';
import gsap from 'gsap';

interface GallerySectionProps {
  visible: boolean;
  onClose?: () => void;
}

const GALLERY_IMAGES = [
  { src: '/images/gallery-1.jpg', caption: 'Epic Creature Battle', aspect: '4/3' },
  { src: '/images/gallery-2.jpg', caption: 'Ancient Temple', aspect: '3/4' },
  { src: '/images/gallery-3.jpg', caption: 'Aether Drake Portrait', aspect: '3/4' },
  { src: '/images/gallery-4.jpg', caption: 'Tactical Battle View', aspect: '4/3' },
];

export default function GallerySection({ visible, onClose }: GallerySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const headingText = useTextScramble('PREMIOS ANUALES', visible, 800);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('.gal-reveal');
    gsap.fromTo(els,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
    );
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full max-w-5xl mx-auto px-6 py-8" style={{ zIndex: 10 }}>
      <div className="text-center mb-8">
        <span className="gal-reveal font-mono text-[11px] tracking-[0.2em] uppercase text-ethereal-blue block mb-4">
          EXCELENCIA EDUCATIVA
        </span>
        <h2 className="gal-reveal font-display text-3xl md:text-5xl text-pure-white">
          {headingText}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full">
        {GALLERY_IMAGES.map((img, i) => (
          <div
            key={i}
            className="gal-reveal relative rounded overflow-hidden cursor-pointer group"
            style={{ aspectRatio: img.aspect, opacity: 0 }}
            onClick={() => setLightbox(i)}
          >
            <img
              src={img.src}
              alt={img.caption}
              className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-space/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
              <span className="font-body text-sm text-pure-white">{img.caption}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[60] bg-deep-space/95 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-pale-silver hover:text-pure-white transition-colors"
            onClick={() => setLightbox(null)}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={GALLERY_IMAGES[lightbox].src}
            alt={GALLERY_IMAGES[lightbox].caption}
            className="max-w-full max-h-[85vh] object-contain rounded"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-body text-sm text-pale-silver">
            {GALLERY_IMAGES[lightbox].caption}
          </span>
        </div>
      )}
    </section>
  );
}
