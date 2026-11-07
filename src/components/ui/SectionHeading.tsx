import { eraVar } from '../../data/eraStyles';
import { eraNumber } from '../../data/timeline';
import type { EraId } from '../../data/types';
import { pad2 } from '../../lib/format';
import { StarOrnament } from './icons';

interface SectionHeadingProps {
  title: string;
  id?: string;
  /** Replaces the star with the era's number, in the era colour. */
  eraId?: EraId;
  /** Muted data line under the title (never instructions). */
  meta?: string;
  as?: 'h1' | 'h2';
}

/** Centred ornament + Tiro Bangla heading + optional meta line (spec §5.2). */
export function SectionHeading({ title, id, eraId, meta, as: Tag = 'h2' }: SectionHeadingProps) {
  return (
    <div className={'grid justify-items-center gap-2 text-center' + (eraId ? ' ' + eraVar[eraId] : '')}>
      {eraId ? (
        <div aria-hidden="true" className="flex w-[min(240px,70%)] items-center gap-3">
          <span className="h-px flex-1 bg-linear-to-r from-transparent to-e" />
          <b className="font-bn-display text-[18px] font-normal text-e">{pad2(eraNumber(eraId))}</b>
          <span className="h-px flex-1 bg-linear-to-r from-e to-transparent" />
        </div>
      ) : (
        <div aria-hidden="true" className="flex w-[min(240px,70%)] items-center gap-3 text-gold">
          <span className="h-px flex-1 bg-linear-to-r from-transparent to-gold" />
          <StarOrnament className="size-3.5 flex-none" />
          <span className="h-px flex-1 bg-linear-to-r from-gold to-transparent" />
        </div>
      )}
      <Tag id={id} className="font-bn-display text-[clamp(26px,3.2vw,34px)] leading-[1.35] text-text">
        {title}
      </Tag>
      {meta && <div className="font-bn text-[14.5px] text-muted">{meta}</div>}
    </div>
  );
}
