import { useEffect, useRef } from 'react';
import { eraVar } from '../../data/eraStyles';
import { eras } from '../../data/timeline';
import { useTimelineApp } from '../../state/TimelineAppContext';

/** Era bar sized like the track's bands, with a gold box marking the visible window. */
export function ScrubberMinimap() {
  const { scrollToEra, trackRef } = useTimelineApp();
  const barRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sc = trackRef.current;
    const bar = barRef.current;
    const box = viewRef.current;
    if (!sc || !bar || !box) return;
    const bands = sc.querySelectorAll<HTMLElement>('[data-era]');
    const buttons = bar.querySelectorAll<HTMLElement>('button');

    const sync = () => {
      const total = sc.scrollWidth;
      if (!total) return;
      buttons.forEach((b, i) => {
        if (bands[i]) b.style.flex = `${bands[i].offsetWidth} 1 0`;
      });
      box.style.left = (sc.scrollLeft / total) * 100 + '%';
      box.style.width = (sc.clientWidth / total) * 100 + '%';
    };

    sync();
    sc.addEventListener('scroll', sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(sc);
    const track = sc.querySelector('#tl-track');
    if (track) ro.observe(track);
    return () => {
      sc.removeEventListener('scroll', sync);
      ro.disconnect();
    };
  }, [trackRef]);

  return (
    <div
      id="tl-minimap"
      ref={barRef}
      className="relative flex h-[34px] min-w-0 flex-1 overflow-hidden rounded-[8px] border border-line"
    >
      {eras.map((era) => (
        <button
          key={era.id}
          type="button"
          onClick={() => scrollToEra(era.id)}
          className={
            'min-w-0 flex-1 basis-0 border-r border-line bg-surface font-bn text-[12.5px] text-text-2 last:border-r-0 hover:text-e ' +
            eraVar[era.id]
          }
        >
          <span className="block overflow-hidden px-1.5 text-ellipsis whitespace-nowrap">{era.short}</span>
        </button>
      ))}
      <span
        id="tl-minimap-view"
        aria-hidden="true"
        className="pointer-events-none absolute top-0 bottom-0 rounded-[6px] border-2 border-gold transition-[left] duration-75 ease-linear"
        ref={viewRef}
      />
    </div>
  );
}
