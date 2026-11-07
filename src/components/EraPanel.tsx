import { useLayoutEffect, useRef } from 'react';
import type { FocusEvent } from 'react';
import { eraVar } from '../data/eraStyles';
import { eraById, eras, eventsForEra } from '../data/timeline';
import type { Era, EraId } from '../data/types';
import { bnDigits } from '../lib/format';
import { useTimelineApp } from '../state/TimelineAppContext';
import { Emblem } from './ui/Emblem';
import { EventCard } from './ui/EventCard';
import { SectionHeading } from './ui/SectionHeading';

interface EraPanelProps {
  id: EraId;
  /** fade the era content in (only after the first change, never on first load) */
  animate?: boolean;
}

const NAV_BTN =
  'grid gap-0.5 rounded-[14px] border border-line-strong bg-surface px-4 py-3 shadow-(--shadow) hover:border-(--e)';
const NAV_LABEL = 'font-ui text-[13.5px] text-muted';
const NAV_NAME = 'font-bn-display text-[19px] text-e phone:text-[16px]';

/**
 * Details for the selected era: its events as cards (or an empty state) plus
 * previous / next navigation. Only the content block is keyed by era (so it
 * re-mounts and fades); the nav row persists, so a focused nav button keeps
 * focus across the change.
 */
export function EraPanel({ id, animate = false }: EraPanelProps) {
  const { setSelectedEra, scrollToEra } = useTimelineApp();
  const era = eraById[id];
  const evs = eventsForEra(id);
  const n = evs.length;
  const i = eras.findIndex((e) => e.id === id);
  const prev: Era | undefined = eras[i - 1];
  const next: Era | undefined = eras[i + 1];

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  // the nav button that last had focus
  const lastNav = useRef<HTMLElement | null>(null);
  const trackNavFocus = (e: FocusEvent<HTMLElement>) => {
    lastNav.current = e.target.dataset.eraNav ? e.target : null;
  };

  // At the first / last era one nav button disappears. If it had focus, hand
  // focus to the same-direction button, else the remaining one.
  useLayoutEffect(() => {
    const el = lastNav.current;
    if (!el || el.isConnected) return;
    const active = document.activeElement;
    if (active && active !== document.body) return;
    const target = el.dataset.eraNav === 'next' ? nextRef.current ?? prevRef.current : prevRef.current ?? nextRef.current;
    target?.focus({ preventScroll: true });
  }, [id]);

  return (
    <div id="era-panel" className={'border-t border-line pt-7 ' + eraVar[id]}>
      <div key={id} className={animate ? 'animate-swap-in' : undefined}>
        <SectionHeading
          eraId={id}
          title={era.bn}
          meta={era.span + (n ? ' · ' + bnDigits(n) + 'টি ঘটনা' : '')}
        />
        {n > 0 ? (
          <div className="mt-6 grid grid-cols-3 gap-4 tablet:mx-auto tablet:max-w-[560px] tablet:grid-cols-1">
            {evs.map((ev) => (
              <EventCard key={ev.id} ev={ev} variant="feature" />
            ))}
          </div>
        ) : (
          <div className="mt-[22px] grid justify-items-center gap-3 rounded-[14px] border border-dashed border-line-strong px-4 py-9 text-center">
            <Emblem spin={false} className="h-[120px] w-[120px] opacity-55" />
            <p lang="en" className="font-ui text-[16px] text-text-2">
              No events published for this era yet
            </p>
          </div>
        )}
      </div>
      <div
        onFocus={trackNavFocus}
        className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3 phone:grid-cols-2"
      >
        {prev ? (
          <button
            ref={prevRef}
            type="button"
            data-era-nav="prev"
            onClick={() => setSelectedEra(prev.id)}
            className={NAV_BTN + ' text-left ' + eraVar[prev.id]}
          >
            <small lang="en" className={NAV_LABEL}>
              ← Previous era
            </small>
            <span className={NAV_NAME}>{prev.bn}</span>
          </button>
        ) : (
          <span />
        )}
        {n > 0 ? (
          <button
            type="button"
            lang="en"
            onClick={() => scrollToEra(id)}
            className="inline-flex justify-self-center rounded-full border border-[color-mix(in_srgb,var(--e)_55%,transparent)] px-5 py-2.5 font-ui text-[15px] font-semibold text-e hover:border-(--e) phone:order-first phone:col-span-full"
          >
            View on Timeline →
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button
            ref={nextRef}
            type="button"
            data-era-nav="next"
            onClick={() => setSelectedEra(next.id)}
            className={NAV_BTN + ' text-right ' + eraVar[next.id]}
          >
            <small lang="en" className={NAV_LABEL}>
              Next era →
            </small>
            <span className={NAV_NAME}>{next.bn}</span>
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
