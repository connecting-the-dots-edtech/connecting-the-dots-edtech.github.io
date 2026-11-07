import { useEffect, useRef, useState } from 'react';
import { EraJourney } from '../components/EraJourney';
import { EraPanel } from '../components/EraPanel';
import { eras } from '../data/timeline';
import { isPlainArrow, isTypingTarget } from '../lib/keys';
import { scrollBehavior } from '../lib/motion';
import { useTimelineApp } from '../state/TimelineAppContext';

export function ErasPage() {
  const { selectedEra, setSelectedEra, quickLookEvent, searchOpen } = useTimelineApp();
  // the panel only fades after the first change, not on first load
  const [changed, setChanged] = useState(false);
  const shown = useRef(selectedEra);

  useEffect(() => {
    if (shown.current === selectedEra) return;
    shown.current = selectedEra;
    setChanged(true);
    const journey = document.getElementById('era-journey');
    if (!journey) return;
    const top = journey.getBoundingClientRect().top;
    if (top < 0) window.scrollBy({ top: top - 90, behavior: scrollBehavior() });
  }, [selectedEra]);

  useEffect(() => {
    if (quickLookEvent !== null || searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (!isPlainArrow(e)) return;
      if (isTypingTarget(document.activeElement)) return;
      const i = eras.findIndex((x) => x.id === selectedEra);
      const target = eras[i + (e.key === 'ArrowRight' ? 1 : -1)];
      e.preventDefault();
      if (target) setSelectedEra(target.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [quickLookEvent, searchOpen, selectedEra, setSelectedEra]);

  return (
    <>
      <h1 className="sr-only">যুগে যুগে</h1>
      <div className="pr-[max(16px,env(safe-area-inset-right,0px))] pl-[max(16px,env(safe-area-inset-left,0px))]">
        <section aria-label="Choose an era" className="mx-auto max-w-280 pt-8 pb-14">
          <EraJourney selectedId={selectedEra} onSelect={setSelectedEra} />
          <EraPanel id={selectedEra} animate={changed} />
        </section>
      </div>
    </>
  );
}
