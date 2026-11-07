import { eraVar } from '../../data/eraStyles';
import type { TimelineEvent } from '../../data/types';
import { bnDigits, excerpt, pad2, readMinutes } from '../../lib/format';
import { useTimelineApp } from '../../state/TimelineAppContext';
import { ClockIcon } from './icons';

interface EventCardProps {
  ev: TimelineEvent;
  variant: 'timeline' | 'feature';
  className?: string;
}

const BASE =
  'rounded-[14px] border border-line-strong bg-linear-[160deg] from-[color-mix(in_srgb,var(--e)_13%,var(--surface))] to-surface to-55% text-left shadow-(--shadow) transition-[border-color,box-shadow,translate] duration-150 hover:border-(--e) hover:shadow-[var(--shadow),0_0_0_1px_var(--e),0_0_26px_color-mix(in_srgb,var(--e)_22%,transparent)]';

const VARIANT = {
  timeline: 'grid w-[260px] gap-[5px] px-4 py-3.5 phone:w-auto',
  feature: 'relative grid grid-rows-[auto_auto_1fr_auto] gap-2 overflow-hidden px-[22px] pt-[22px] pb-[18px] hover:-translate-y-[3px]',
};

const TITLE = 'line-clamp-2 min-h-[2.8em] font-bn-display text-[21px] leading-[1.4] text-text';

/** The one event card (spec §5.2): era-tinted, two-line title, read-time footer. Opens the reader. */
export function EventCard({ ev, variant, className }: EventCardProps) {
  const { openQuickLook } = useTimelineApp();
  const mins = readMinutes(ev.body);
  const feature = variant === 'feature';

  return (
    <button
      type="button"
      data-card={variant}
      title={ev.title}
      onClick={() => openQuickLook(ev)}
      className={BASE + ' ' + VARIANT[variant] + ' ' + eraVar[ev.era] + (className ? ' ' + className : '')}
    >
      {feature ? (
        <>
          <span
            aria-hidden="true"
            className="absolute top-1 right-4 font-bn-display text-[76px] leading-none text-e opacity-20"
          >
            {bnDigits(ev.id)}
          </span>
          <span className="font-bn text-[14.5px] font-medium text-muted">
            <b className="font-semibold text-e">অধ্যায় {pad2(ev.id)}</b> · {ev.year}
          </span>
          <span className={TITLE + ' pr-[76px]'}>{ev.title}</span>
          <span className="font-bn text-[15px] leading-[1.75] text-text-2">{excerpt(ev.body)}</span>
        </>
      ) : (
        <>
          <span className="flex items-baseline gap-2 font-bn text-[14px] text-muted">
            <b className="font-bn-display text-[16px] font-normal text-e">{pad2(ev.id)}</b>
            {ev.year}
          </span>
          <span className={TITLE}>{ev.title}</span>
        </>
      )}
      <span
        lang="en"
        className={
          'flex justify-between border-t border-line font-ui text-[13.5px] text-muted ' +
          (feature ? 'mt-1.5 pt-3' : 'mt-1 pt-2')
        }
      >
        <span className="inline-flex items-center gap-1.5" aria-label={mins + ' min read'}>
          <ClockIcon className="size-3.5 flex-none" />
          {mins} min
        </span>
        <span className="font-semibold text-e">Read →</span>
      </span>
    </button>
  );
}
