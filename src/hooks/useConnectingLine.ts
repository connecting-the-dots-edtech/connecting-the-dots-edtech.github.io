import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/** Fraction of the remaining distance closed per 60fps frame; scaled by elapsed time. */
const CATCH_UP = 0.03;
const FRAME_MS = 1000 / 60;

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
    let last = 0;
    let alive = true;

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

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(100, now - last) : FRAME_MS;
      last = now;
      const k = 1 - Math.pow(1 - CATCH_UP, dt / FRAME_MS);
      const t = target();
      let c = reduced.matches ? t : cur.current + (t - cur.current) * k;
      if (Math.abs(t - c) < 0.5) c = t;
      cur.current = c;
      apply();
      if (c !== t) raf = requestAnimationFrame(tick);
      else last = 0;
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

    // Layout can settle after mount (scrollbars, fonts) without a scroll or
    // window resize, which would leave the clip at a stale edge.
    const ro = new ResizeObserver(kick);
    ro.observe(track);
    if (scroller) ro.observe(scroller);
    void document.fonts?.ready.then(() => {
      if (alive) kick();
    });

    return () => {
      alive = false;
      ro.disconnect();
      cancelAnimationFrame(raf);
      scrollSource?.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
    };
  }, [trackRef, scrollerRef, clipRectRef, vertical, width, height]);
}
