import { useEffect, useRef, useState } from 'react';

/**
 * Reports whether an element has scrolled into view, once. Unlike
 * useParallax (a continuous, per-frame value driven imperatively so it
 * doesn't spam re-renders), this is a single discrete state flip, so plain
 * React state is the right tool — the component decides how to animate
 * the transition from that boolean via its own className.
 */
export function useScrollReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
