/** `'auto'` when the visitor prefers reduced motion, else `'smooth'`. Use for JS-initiated scrolls. */
export function scrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}
