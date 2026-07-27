import { useEffect, useRef } from 'react';

/**
 * Imperatively translates the element on scroll instead of storing scrollY in
 * React state, so dozens of parallax layers don't each trigger a re-render.
 */
export function useParallax<T extends HTMLElement>(speed: number) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const apply = () => {
      raf = 0;
      const y = window.scrollY || 0;
      el.style.transform = `translateY(${y * speed * -0.15}px)`;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return ref;
}
