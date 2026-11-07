/**
 * The eight-point-star medallion (prototype `medallion()`), drawn in a
 * 420×420 viewBox. All point lists are computed once at module load.
 */

const C = 210;
const f = (n: number) => n.toFixed(1);

function starPoints(r: number, rot: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI / 8) * i + rot;
    const rr = i % 2 ? r * 0.76 : r;
    pts.push(f(C + rr * Math.cos(a)) + ',' + f(C + rr * Math.sin(a)));
  }
  return pts.join(' ');
}

function squarePoints(r: number, rot: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 4; i++) {
    const a = rot + (Math.PI / 2) * i + Math.PI / 4;
    pts.push(f(C + r * Math.cos(a)) + ',' + f(C + r * Math.sin(a)));
  }
  return pts.join(' ');
}

const OUTER_SQ_A = squarePoints(178, 0);
const OUTER_SQ_B = squarePoints(178, Math.PI / 4);
const STAR_A = starPoints(132, 0);
const STAR_B = starPoints(132, Math.PI / 8);
const STAR_INNER = starPoints(84, Math.PI / 16);
const CORE_FILL = squarePoints(16, 0);
const CORE_LINE = squarePoints(16, Math.PI / 4);
const DOTS = Array.from({ length: 24 }, (_, i) => {
  const a = (Math.PI / 12) * i;
  return { cx: f(C + 196 * Math.cos(a)), cy: f(C + 196 * Math.sin(a)), r: i % 3 ? 1.6 : 3 };
});

interface EmblemProps {
  /** Rotate the outer ring (home hero only; 140s per turn). */
  spin: boolean;
  className?: string;
}

export function Emblem({ spin, className }: EmblemProps) {
  return (
    <svg viewBox="0 0 420 420" aria-hidden="true" className={className}>
      <g className={spin ? 'origin-[210px_210px] animate-[spin_140s_linear_infinite]' : undefined}>
        <g className="fill-none stroke-gold [stroke-opacity:0.32]" strokeWidth="1">
          <polygon points={OUTER_SQ_A} />
          <polygon points={OUTER_SQ_B} />
          <circle cx={C} cy={C} r="182" />
        </g>
        <g className="fill-gold [fill-opacity:0.55]">
          {DOTS.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={d.r} />
          ))}
        </g>
      </g>
      <g className="fill-none stroke-gold" strokeWidth="1.3">
        <polygon points={STAR_A} />
        <polygon points={STAR_B} />
      </g>
      <g className="fill-none stroke-gold [stroke-opacity:0.55]" strokeWidth="1">
        <polygon points={STAR_INNER} />
        <circle cx={C} cy={C} r="52" />
      </g>
      <g className="fill-gold">
        <polygon points={CORE_FILL} />
      </g>
      <g className="fill-none stroke-gold" strokeWidth="1.3">
        <polygon points={CORE_LINE} />
      </g>
    </svg>
  );
}
