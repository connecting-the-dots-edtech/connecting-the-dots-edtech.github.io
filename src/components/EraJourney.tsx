import { useRef } from 'react';
import { eraVar } from '../data/eraStyles';
import { eras, eventsForEra } from '../data/timeline';
import type { EraId } from '../data/types';
import { useCurve } from '../hooks/useCurve';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { bnDigits, pad2 } from '../lib/format';
import { CurveSvg } from './ui/CurveSvg';

interface EraJourneyProps {
  /** Eras page only: the highlighted stop (enlarged halo dot, aria-pressed). */
  selectedId?: EraId;
  onSelect: (id: EraId) => void;
}

/* Desktop: dots alternate 40% / 60% of a 290px row, labels above / below.
   Tablet and phone (≤960px): a vertical list, dots offset left / right. */
const DOT_BASE =
  'absolute left-1/2 z-2 rounded-full transition-transform duration-150 tablet:static tablet:m-0 tablet:flex-none';
const DOT_HIGH = 'top-[40%] tablet:ml-3.5';
const DOT_LOW = 'top-[60%] tablet:ml-9';
const DOT_FULL =
  '-mt-2.5 -ml-2.5 size-5 border-3 border-bg bg-e shadow-[0_0_0_2px_var(--e),0_0_18px_color-mix(in_srgb,var(--e)_55%,transparent)]';
const DOT_EMPTY = '-mt-[7px] -ml-[7px] size-3.5 border-2 border-[color-mix(in_srgb,var(--e)_75%,transparent)] bg-bg';
const DOT_ON =
  'scale-[1.3] shadow-[0_0_0_2px_var(--e),0_0_0_8px_color-mix(in_srgb,var(--e)_22%,transparent),0_0_26px_color-mix(in_srgb,var(--e)_60%,transparent)]';
const DOT_HOVER = 'group-hover:scale-[1.18]';

const LABEL_BASE =
  'absolute left-1/2 grid w-full -translate-x-1/2 gap-0.5 px-1 text-center tablet:static tablet:flex tablet:w-auto tablet:translate-x-0 tablet:flex-wrap tablet:items-baseline tablet:gap-x-2.5 tablet:gap-y-0.5 tablet:text-left';
const LABEL_HIGH = 'bottom-[calc(60%+22px)] tablet:ml-[30px]';
const LABEL_LOW = 'top-[calc(60%+22px)] tablet:ml-2';

/** The eight eras as dots on the gold cosine curve (home and Eras page). */
export function EraJourney({ selectedId, onSelect }: EraJourneyProps) {
  const ref = useRef<HTMLDivElement>(null);
  const curve = useCurve(ref, useMediaQuery('(max-width: 960px)'));

  return (
    <div
      id="era-journey"
      ref={ref}
      className="relative mt-2 flex h-[290px] tablet:mx-auto tablet:h-auto tablet:max-w-[520px] tablet:flex-col tablet:py-1"
    >
      <CurveSvg width={curve.width} height={curve.height} segments={curve.segments} />
      {eras.map((era, i) => {
        const n = eventsForEra(era.id).length;
        const meta = n > 0 ? bnDigits(n) + 'টি ঘটনা' : '';
        const low = i % 2 === 1;
        const on = selectedId === era.id;

        const dot =
          DOT_BASE +
          ' ' +
          (low ? DOT_LOW : DOT_HIGH) +
          ' ' +
          (n > 0 ? DOT_FULL : DOT_EMPTY + (on ? ' border-solid' : ' border-dashed')) +
          ' ' +
          (on ? DOT_ON : DOT_HOVER);
        const name =
          'font-bn-display text-[18px] leading-[1.35] group-hover:text-e ' +
          (on ? 'text-e' : n > 0 ? 'text-text' : 'text-text-2');

        return (
          <button
            key={era.id}
            type="button"
            data-jr-stop={era.id}
            aria-pressed={selectedId ? on : undefined}
            aria-label={era.bn + (meta ? ': ' + meta : '')}
            onClick={() => onSelect(era.id)}
            className={
              'group relative min-w-0 flex-[1_1_0] tablet:flex tablet:items-center tablet:py-[9px] tablet:text-left ' +
              eraVar[era.id]
            }
          >
            <span className={dot} data-curve-pt="" data-soon={n > 0 ? undefined : ''} />
            <span className={LABEL_BASE + ' ' + (low ? LABEL_LOW : LABEL_HIGH)}>
              <span className={'font-bn-display text-[15px] text-e' + (on ? ' font-semibold' : '')}>{pad2(i + 1)}</span>
              <span className={name}>{era.bn}</span>
              {meta && <span className="font-bn text-[13.5px] text-muted">{meta}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
