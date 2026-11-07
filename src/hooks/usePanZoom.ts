import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';

export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PanZoomOptions {
  /** widest allowed view, in canvas units */
  maxW: number;
  /** the view to show on mount (may read the stage size) */
  initial: (stage: HTMLElement) => ViewBox;
  /** a press that didn't move more than 4px; `target` is where the press started */
  onTap: (target: Element) => void;
  /** CSS selector of overlays inside the stage that must never start a pan */
  ignore: string;
}

const MIN_W = 320;

/**
 * Pan and zoom an SVG by writing its viewBox through a ref. The view is a continuous runtime
 * value (like the timeline clip rect), so it never goes through React state. Drag pans, two
 * pointers pinch-zoom, Ctrl/⌘ + wheel zooms at the cursor, a plain wheel pans.
 */
export function usePanZoom(stageRef: RefObject<HTMLElement | null>, svgRef: RefObject<SVGSVGElement | null>, opts: PanZoomOptions) {
  const view = useRef<ViewBox>({ x: 0, y: 0, w: 1, h: 1 });
  const anim = useRef(0);
  const optsRef = useRef(opts);
  useLayoutEffect(() => {
    optsRef.current = opts;
  });

  const apply = useCallback(() => {
    const v = view.current;
    svgRef.current?.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.h}`);
  }, [svgRef]);

  /** Screen pixels per canvas unit with preserveAspectRatio="xMidYMid meet". */
  const scale = useCallback(() => {
    const st = stageRef.current;
    if (!st) return 1;
    return Math.min(st.clientWidth / view.current.w, st.clientHeight / view.current.h);
  }, [stageRef]);

  const clientToCanvas = useCallback(
    (cx: number, cy: number): [number, number] => {
      const st = stageRef.current;
      if (!st) return [0, 0];
      const r = st.getBoundingClientRect();
      const s = scale();
      const v = view.current;
      const ox = (r.width - v.w * s) / 2;
      const oy = (r.height - v.h * s) / 2;
      return [v.x + (cx - r.left - ox) / s, v.y + (cy - r.top - oy) / s];
    },
    [stageRef, scale],
  );

  const zoomAt = useCallback(
    (factor: number, cx: number, cy: number) => {
      const v = view.current;
      const w = Math.max(MIN_W, Math.min(optsRef.current.maxW, v.w * factor));
      const k = w / v.w;
      view.current = { x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k, w, h: v.h * k };
      apply();
    },
    [apply],
  );

  /** Ease the view to `target` (instant under reduced motion). */
  const animateTo = useCallback(
    (target: ViewBox) => {
      cancelAnimationFrame(anim.current);
      const from = { ...view.current };
      const dur = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 380;
      const t0 = performance.now();
      const step = (now: number) => {
        const u = dur ? Math.min(1, (now - t0) / dur) : 1;
        const k = 1 - Math.pow(1 - u, 3);
        view.current = {
          x: from.x + (target.x - from.x) * k,
          y: from.y + (target.y - from.y) * k,
          w: from.w + (target.w - from.w) * k,
          h: from.h + (target.h - from.h) * k,
        };
        apply();
        if (u < 1) anim.current = requestAnimationFrame(step);
      };
      anim.current = requestAnimationFrame(step);
    },
    [apply],
  );

  /** Zoom around the view centre (the +/− buttons). */
  const zoomBy = useCallback(
    (factor: number) => {
      const v = view.current;
      const w = Math.max(MIN_W, Math.min(optsRef.current.maxW, v.w * factor));
      const h = (w * v.h) / v.w;
      animateTo({ x: v.x + v.w / 2 - w / 2, y: v.y + v.h / 2 - h / 2, w, h });
    },
    [animateTo],
  );

  /** Centre a canvas point, never zoomed out wider than `maxViewW`. */
  const centerOn = useCallback(
    (x: number, y: number, maxViewW: number) => {
      const v = view.current;
      const w = Math.min(v.w, maxViewW);
      const h = (w * v.h) / v.w;
      animateTo({ x: x - w / 2, y: y - h / 2, w, h });
    },
    [animateTo],
  );

  useEffect(() => {
    const st = stageRef.current;
    if (!st) return;
    view.current = optsRef.current.initial(st);
    apply();

    const pts = new Map<number, [number, number]>();
    let start = { view: { ...view.current }, pts: new Map(pts) };
    let moved = false;
    let downTarget: Element | null = null;

    const onDown = (e: PointerEvent) => {
      const target = e.target as Element;
      if (target.closest(optsRef.current.ignore)) return;
      st.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, [e.clientX, e.clientY]);
      start = { view: { ...view.current }, pts: new Map(pts) };
      moved = false;
      downTarget = target;
      cancelAnimationFrame(anim.current);
    };
    const onMove = (e: PointerEvent) => {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, [e.clientX, e.clientY]);
      if (pts.size === 1 && start.pts.size === 1) {
        const [x0, y0] = start.pts.get(e.pointerId) ?? [e.clientX, e.clientY];
        const dx = e.clientX - x0;
        const dy = e.clientY - y0;
        if (Math.abs(dx) + Math.abs(dy) > 4) {
          moved = true;
          st.dataset.dragging = 'true';
        }
        if (moved) {
          const s = scale();
          view.current = { ...start.view, x: start.view.x - dx / s, y: start.view.y - dy / s };
          apply();
        }
      } else if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        const [a0, b0] = [...start.pts.values()];
        if (!a0 || !b0) return;
        moved = true;
        const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
        const d0 = Math.hypot(a0[0] - b0[0], a0[1] - b0[1]) || 1;
        view.current = { ...start.view };
        const [cx, cy] = clientToCanvas((a0[0] + b0[0]) / 2, (a0[1] + b0[1]) / 2);
        zoomAt(d0 / d, cx, cy);
      }
    };
    const onUp = (e: PointerEvent) => {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      delete st.dataset.dragging;
      if (!moved && pts.size === 0 && downTarget) optsRef.current.onTap(downTarget);
      start = { view: { ...view.current }, pts: new Map(pts) };
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const [cx, cy] = clientToCanvas(e.clientX, e.clientY);
        zoomAt(Math.exp(e.deltaY * 0.01), cx, cy);
      } else {
        const s = scale();
        view.current = { ...view.current, x: view.current.x + e.deltaX / s, y: view.current.y + e.deltaY / s };
        apply();
      }
    };

    st.addEventListener('pointerdown', onDown);
    st.addEventListener('pointermove', onMove);
    st.addEventListener('pointerup', onUp);
    st.addEventListener('pointercancel', onUp);
    st.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      cancelAnimationFrame(anim.current);
      st.removeEventListener('pointerdown', onDown);
      st.removeEventListener('pointermove', onMove);
      st.removeEventListener('pointerup', onUp);
      st.removeEventListener('pointercancel', onUp);
      st.removeEventListener('wheel', onWheel);
    };
  }, [stageRef, apply, scale, clientToCanvas, zoomAt]);

  return { animateTo, zoomBy, centerOn };
}
