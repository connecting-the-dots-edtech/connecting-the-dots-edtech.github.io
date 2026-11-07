/**
 * The connecting curve: true cosine segments between consecutive dots
 * (spec §5.2 "One curve"). Pure maths plus one DOM measuring helper; no
 * DOM access at module scope, so this file also runs under plain Node.
 */

export type CurvePoint = { x: number; y: number; soon: boolean };

export type CurveSegment = { d: string; dotted: boolean };

/** Cosine ease: 0 -> 0, 0.5 -> 0.5, 1 -> 1, flat at both ends. */
export const ease = (u: number) => (1 - Math.cos(Math.PI * u)) / 2;

/**
 * Centres of the `[data-curve-pt]` descendants of `container`, in DOM order,
 * in the container's own coordinate space (the space an absolutely
 * positioned `left-0 top-0` SVG inside it draws in). Hidden anchors
 * (`offsetParent === null`) are skipped; `data-soon` marks an era with no
 * events.
 */
export function measureCurvePoints(container: HTMLElement): CurvePoint[] {
  const cr = container.getBoundingClientRect();
  const ox = cr.left + container.clientLeft - container.scrollLeft;
  const oy = cr.top + container.clientTop - container.scrollTop;
  const pts: CurvePoint[] = [];
  container.querySelectorAll<HTMLElement>('[data-curve-pt]').forEach((el) => {
    if (el.offsetParent === null) return;
    const r = el.getBoundingClientRect();
    pts.push({ x: r.left - ox + r.width / 2, y: r.top - oy + r.height / 2, soon: el.hasAttribute('data-soon') });
  });
  return pts;
}

const STEPS = 28;

/**
 * One path per consecutive pair of points, 28 `L` steps each. Horizontal:
 * x linear, y eased. Vertical: y linear, x eased. A segment touching a
 * `soon` point is dotted.
 */
export function curveSegments(pts: CurvePoint[], vertical: boolean): CurveSegment[] {
  const segs: CurveSegment[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    let d = 'M' + a.x.toFixed(1) + ',' + a.y.toFixed(1);
    for (let k = 1; k <= STEPS; k++) {
      const u = k / STEPS;
      const x = vertical ? a.x + (b.x - a.x) * ease(u) : a.x + (b.x - a.x) * u;
      const y = vertical ? a.y + (b.y - a.y) * u : a.y + (b.y - a.y) * ease(u);
      d += ' L' + x.toFixed(1) + ',' + y.toFixed(1);
    }
    segs.push({ d, dotted: a.soon || b.soon });
  }
  return segs;
}
