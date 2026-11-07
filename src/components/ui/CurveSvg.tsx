import type { Ref } from 'react';
import type { CurveSegment } from '../../lib/curve';

interface CurveSvgProps {
  width: number;
  height: number;
  segments: CurveSegment[];
  /** When set, the paths are wrapped in a clip whose rect the caller animates. */
  clipPathId?: string;
  clipRectRef?: Ref<SVGRectElement>;
}

const GLOW = 'fill-none stroke-gold stroke-[10] opacity-[0.13] [stroke-linecap:round] [stroke-linejoin:round]';
const SOLID = 'fill-none stroke-gold stroke-[2.5] [stroke-linecap:round] [stroke-linejoin:round]';
const DOTTED =
  'fill-none stroke-gold stroke-2 [stroke-dasharray:1_8] opacity-85 [stroke-linecap:round] [stroke-linejoin:round]';

/** The single gold connecting thread: a glow layer under the solid/dotted segments. */
export function CurveSvg({ width, height, segments, clipPathId, clipRectRef }: CurveSvgProps) {
  const glows = segments.map((s, i) => (s.dotted ? null : <path key={'g' + i} d={s.d} className={GLOW} />));
  const paths = segments.map((s, i) => <path key={'p' + i} d={s.d} className={s.dotted ? DOTTED : SOLID} />);

  return (
    <svg
      data-curve-svg=""
      width={width}
      height={height}
      viewBox={'0 0 ' + width + ' ' + height}
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 z-1 overflow-visible"
    >
      {clipPathId ? (
        <>
          <defs>
            <clipPath id={clipPathId}>
              <rect ref={clipRectRef} id="tl-clip-rect" x={0} y={0} width={0} height={0} />
            </clipPath>
          </defs>
          <g clipPath={'url(#' + clipPathId + ')'}>
            {glows}
            {paths}
          </g>
        </>
      ) : (
        <>
          {glows}
          {paths}
        </>
      )}
    </svg>
  );
}
