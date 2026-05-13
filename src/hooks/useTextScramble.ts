import { useEffect, useRef, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';

/**
 * useTextScramble
 * Devuelve el texto con efecto scramble (caracteres random que se resuelven
 * letra por letra hacia el texto final).
 *
 * @param text     - Texto final a mostrar
 * @param trigger  - Cuando cambia a true, inicia el scramble
 * @param delay    - Milisegundos a esperar antes de iniciar (default 0)
 *
 * IMPORTANTE: Mientras el scramble no haya arrancado, retorna '' (string vacío)
 * para que el elemento no muestre caracteres random cuando aún está invisible.
 */
export function useTextScramble(text: string, trigger: boolean, delay: number = 0): string {
  // Empieza vacío — nunca '' con caracteres random antes del delay
  const [display, setDisplay] = useState('');
  const frameRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Limpiar timers anteriores
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!trigger) {
      // Si se oculta, resetear a vacío para el próximo render
      setDisplay('');
      return;
    }

    // Esperar el delay antes de empezar el scramble
    timeoutRef.current = setTimeout(() => {
      const length = text.length;
      let frame = 0;
      // Cuántos frames por letra resuelta (más alto = más lento)
      const FRAMES_PER_CHAR = 3;
      const totalFrames = length * FRAMES_PER_CHAR;

      const animate = () => {
        // Cuántas letras ya están "resueltas"
        const resolved = Math.floor(frame / FRAMES_PER_CHAR);

        let output = '';
        for (let i = 0; i < length; i++) {
          if (i < resolved) {
            // Letra ya resuelta: mostrar la real
            output += text[i];
          } else if (text[i] === ' ') {
            // Espacios siempre como espacio
            output += ' ';
          } else {
            // Letra aún scrambled: carácter random
            output += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }

        setDisplay(output);
        frame++;

        if (frame <= totalFrames) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          // Asegurarse de terminar con el texto exacto
          setDisplay(text);
        }
      };

      animate();
    }, delay);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, trigger, delay]);

  return display;
}
