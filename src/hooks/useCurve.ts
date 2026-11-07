import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';
import { flushSync } from 'react-dom';
import { curveSegments, measureCurvePoints } from '../lib/curve';
import type { CurveSegment } from '../lib/curve';

interface CurveState {
  width: number;
  height: number;
  segments: CurveSegment[];
}

const EMPTY: CurveState = { width: 0, height: 0, segments: [] };

/**
 * Measures the `[data-curve-pt]` anchors inside `containerRef` and returns
 * the SVG size (the container's scrollWidth/scrollHeight) plus the cosine
 * segments through them. Re-measures on mount, when `vertical` flips, when
 * the container resizes, on window resize, and once web fonts are ready.
 */
export function useCurve(
  containerRef: RefObject<HTMLElement | null>,
  vertical: boolean,
): CurveState {
  const [state, setState] = useState<CurveState>(EMPTY);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let alive = true;

    const compute = (): CurveState => {
      // The curve SVG is an absolute child of the container, so its previous
      // size counts toward scrollWidth/scrollHeight and would keep the SVG
      // from ever shrinking. Collapse it while reading, then restore it.
      const svg = el.querySelector<SVGSVGElement>(':scope > svg[data-curve-svg]');
      const w = svg?.getAttribute('width');
      const h = svg?.getAttribute('height');
      svg?.setAttribute('width', '0');
      svg?.setAttribute('height', '0');
      const width = el.scrollWidth;
      const height = el.scrollHeight;
      if (svg && w != null) svg.setAttribute('width', w);
      if (svg && h != null) svg.setAttribute('height', h);
      return { width, height, segments: curveSegments(measureCurvePoints(el), vertical) };
    };

    // Async triggers commit synchronously so the drawn curve never lags a
    // layout change by a frame.
    const remeasure = () => {
      if (alive) flushSync(() => setState(compute()));
    };

    setState(compute());

    const ro = new ResizeObserver(remeasure);
    ro.observe(el);
    window.addEventListener('resize', remeasure);
    document.fonts?.ready.then(remeasure);

    return () => {
      alive = false;
      ro.disconnect();
      window.removeEventListener('resize', remeasure);
    };
  }, [containerRef, vertical]);

  return state;
}
