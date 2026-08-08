import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

interface Geometry {
  width: number;
  height: number;
  d: string;
}

const EMPTY_GEOMETRY: Geometry = { width: 0, height: 0, d: '' };

const BULGE_PX = 170;
const CATCH_UP_RATE = 0.02;
const VISIBILITY_THRESHOLD = 0.15;

/**
 * Draws a wavy connector through a set of DOM nodes (measured, not laid out
 * by this hook) and reveals it as a scroll-linked stroke that deliberately
 * lags behind the scroll position instead of tracking it 1:1 — so the line
 * is visibly still "catching up" for a moment after the user stops
 * scrolling, rather than snapping into place on every scroll event. The
 * line stays fully retracted until its container actually scrolls into
 * view, then grows from the very first node up to whatever's currently on
 * screen as an entrance animation — the same easing that drives ongoing
 * scroll tracking afterward, just starting from zero instead of a target.
 *
 * Like useParallax/useDragScroll, the per-frame stroke-dasharray/dashoffset
 * values are continuous and runtime-only, so they're mutated imperatively
 * on the path ref rather than passed through React state as a style prop.
 */
export function useConnectingLine(
  containerRef: RefObject<HTMLElement | null>,
  scrollRef: RefObject<HTMLElement | null>,
  nodeIds: number[],
) {
  const nodesRef = useRef<Map<number, HTMLElement>>(new Map());
  const pathRef = useRef<SVGPathElement>(null);
  const [geometry, setGeometry] = useState<Geometry>(EMPTY_GEOMETRY);

  // Persists across zoom/resize-triggered recomputes so only the very first
  // paint starts the line at zero — a later resize continues from wherever
  // the line had already caught up to, instead of resetting.
  const currentRef = useRef(0);
  const initializedRef = useRef(false);

  const registerNode = useCallback((id: number, el: HTMLElement | null) => {
    if (el) nodesRef.current.set(id, el);
    else nodesRef.current.delete(id);
  }, []);

  const recompute = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerBox = container.getBoundingClientRect();

    const points = nodeIds
      .map((id) => nodesRef.current.get(id))
      .filter((el): el is HTMLElement => Boolean(el))
      .map((el) => {
        const box = el.getBoundingClientRect();
        return {
          x: box.left + box.width / 2 - containerBox.left,
          y: box.top + box.height / 2 - containerBox.top,
        };
      })
      .sort((a, b) => a.x - b.x);

    if (points.length < 2) {
      setGeometry({ width: containerBox.width, height: containerBox.height, d: '' });
      return;
    }

    // A clean, continuous sine-like wave: every segment bulges the same
    // amount, alternating up/down by position, so the curve reads as one
    // smooth cosine rather than a sequence of unevenly-shaped bends. The
    // card stems (TimelineView's EventColumn) are long enough on their own
    // to keep the cards clear of this — the curve doesn't need to dodge
    // them itself.
    const y = points[0].y;
    let d = `M ${points[0].x},${y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const x0 = points[i].x;
      const x1 = points[i + 1].x;
      const amp = Math.min(BULGE_PX, (x1 - x0) * 0.4);
      const sign = i % 2 === 0 ? -1 : 1;
      const c1x = x0 + (x1 - x0) * 0.35;
      const c2x = x0 + (x1 - x0) * 0.65;
      const cy = y + sign * amp;
      d += ` C ${c1x},${cy} ${c2x},${cy} ${x1},${y}`;
    }
    setGeometry({ width: containerBox.width, height: containerBox.height, d });
  }, [containerRef, nodeIds]);

  useLayoutEffect(() => {
    recompute();
  }, [recompute]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(recompute);
    observer.observe(container);
    window.addEventListener('resize', recompute);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', recompute);
    };
  }, [containerRef, recompute]);

  useEffect(() => {
    const path = pathRef.current;
    const scrollEl = scrollRef.current;
    const container = containerRef.current;
    if (!path || !geometry.d || !container) return;

    const total = path.getTotalLength();
    path.style.strokeDasharray = `${total}`;
    // Fully retracted until the section actually scrolls into view — so the
    // line is never sitting there pre-connected before the visitor arrives.
    path.style.strokeDashoffset = `${total}`;

    function lengthAtX(targetX: number) {
      let lo = 0;
      let hi = total;
      for (let i = 0; i < 24; i++) {
        const mid = (lo + hi) / 2;
        if (path!.getPointAtLength(mid).x < targetX) lo = mid;
        else hi = mid;
      }
      return lo;
    }

    let frame: number;

    function tick() {
      const edgeX = scrollEl
        ? Math.min(scrollEl.scrollLeft + scrollEl.clientWidth, geometry.width)
        : geometry.width;
      const target = lengthAtX(edgeX);
      currentRef.current += (target - currentRef.current) * CATCH_UP_RATE;
      path!.style.strokeDashoffset = `${total - currentRef.current}`;
      frame = requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Start from nothing and let the normal per-frame easing below grow
        // it toward the current screen's target — that's the entrance
        // animation, no separate jump-then-catch-up needed.
        if (!initializedRef.current) {
          currentRef.current = 0;
          initializedRef.current = true;
        } else {
          currentRef.current = Math.min(currentRef.current, total);
        }
        frame = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: VISIBILITY_THRESHOLD },
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [geometry, scrollRef, containerRef]);

  return { pathRef, geometry, registerNode };
}
