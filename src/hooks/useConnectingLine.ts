import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

const CATCH_UP = 0.03;

const clamp = (v: number, max: number) => Math.max(0, Math.min(max, v));

/**
 * The timeline curve's draw-in (spec §5.3): the curve starts hidden, grows
 * from the first dot on load, then keeps growing toward the edge of the
 * visible area, easing behind the scroll so it visibly catches up.
 *
 * The reveal is a clip rect (CurveSvg's `clipRectRef`) whose width
 * (horizontal) or height (vertical) is the progress `cur`. That is a
 * continuous runtime value, so it is written imperatively with
 * `setAttribute` from a rAF loop rather than through React state.
 */
export function useConnectingLine(
  trackRef: RefObject<HTMLElement | null>,
  scrollerRef: RefObject<HTMLElement | null>,
  vertical: boolean,
  clipRectRef: RefObject<SVGRectElement | null>,
  curveSize: { width: number; height: number },
): void {
  const cur = useRef(0);
  const lastVertical = useRef(vertical);
  const { width, height } = curveSize;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const scroller = scrollerRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;

    // Unclamped edge of the visible area, in track coordinates.
    const edge = () => {
      const top = track.getBoundingClientRect();
      if (vertical) return window.innerHeight - top.top;
      return scroller ? scroller.getBoundingClientRect().right - top.left : 0;
    };
    const target = () => clamp(edge(), vertical ? height : width);

    const apply = () => {
      const rect = clipRectRef.current;
      if (!rect) return;
      rect.setAttribute('width', String(vertical ? width : cur.current));
      rect.setAttribute('height', String(vertical ? cur.current : height));
    };

    const tick = () => {
      raf = 0;
      const t = target();
      let c = reduced.matches ? t : cur.current + (t - cur.current) * CATCH_UP;
      if (Math.abs(t - c) < 0.5) c = t;
      cur.current = c;
      apply();
      if (c !== t) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    // On a layout flip, keep what is already drawn up to the new edge instead
    // of restarting from 0. The edge is unclamped here because the curve size
    // for the new layout may not have been measured yet.
    if (lastVertical.current !== vertical) {
      lastVertical.current = vertical;
      cur.current = Math.max(0, Math.min(cur.current, edge()));
    }

    apply();
    kick();

    const scrollSource: HTMLElement | Window | null = vertical ? window : scroller;
    scrollSource?.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);

    return () => {
      cancelAnimationFrame(raf);
      scrollSource?.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
    };
  }, [trackRef, scrollerRef, clipRectRef, vertical, width, height]);
}
