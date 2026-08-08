import { useTimelineApp } from '../../state/TimelineAppContext';
import { TimelineView } from './TimelineView';
import { ListView } from './ListView';
import { MapView } from './MapView';
import { ScrubberMinimap } from './ScrubberMinimap';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import type { ViewMode } from '../../data/types';

const VIEWS: { id: ViewMode; label: string }[] = [
  { id: 'timeline', label: 'Timeline' },
  { id: 'list', label: 'List' },
  { id: 'map', label: 'Map' },
];

export function TimelineExplorer() {
  const { view, setView, zoom, zoomIn, zoomOut, zoomLabel } = useTimelineApp();
  const { ref: revealRef, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="timeline"
      ref={revealRef}
      className={`relative border-t border-border-gold bg-linear-to-b from-ink to-ink-alt py-22.5 pb-17.5 transition-[opacity,transform] duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <div className="mx-auto flex max-w-310 flex-wrap items-end justify-between gap-6 px-5 sm:px-10">
        <div>
          <div className="mb-3 text-xs tracking-[0.34em] text-gold uppercase">◆ The Grand Timeline</div>
          <h2 className="font-serif text-[clamp(30px,4vw,48px)] font-normal text-cream">Scrub through the ages</h2>
          <p className="mt-3 max-w-130 text-[15px] leading-[1.6] text-mute">
            Drag horizontally to travel through time. Each era carries its own parallax backdrop; zoom in to reveal
            individual events.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3.5 sm:items-end">
          <div className="inline-flex rounded-full border border-border-strong bg-(--surface-2) p-1" role="tablist" aria-label="Timeline view mode">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={view === v.id}
                onClick={() => setView(v.id)}
                className={
                  view === v.id
                    ? 'rounded-full bg-gold-fill px-4.5 py-2 text-[13px] text-[#12121A]'
                    : 'rounded-full px-4.5 py-2 text-[13px] text-dim'
                }
              >
                {v.label}
              </button>
            ))}
          </div>

          {view === 'timeline' && (
            <div className="flex items-center gap-2.5 text-[13px] text-mute">
              <span className="tracking-wide">ZOOM</span>
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoom === 0}
                aria-label="Zoom out"
                className="h-8.5 w-8.5 rounded-full border border-border-gold bg-(--surface-1) text-xl leading-none text-gold disabled:opacity-35"
              >
                −
              </button>
              <span className="min-w-16.5 text-center text-xs tracking-wide text-cream-text uppercase">{zoomLabel}</span>
              <button
                type="button"
                onClick={zoomIn}
                disabled={zoom === 3}
                aria-label="Zoom in"
                className="h-8.5 w-8.5 rounded-full border border-border-gold bg-(--surface-1) text-lg leading-none text-gold disabled:opacity-35"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

      {view === 'timeline' && (
        <>
          <TimelineView />
          <ScrubberMinimap />
        </>
      )}
      {view === 'list' && <ListView />}
      {view === 'map' && <MapView />}
    </section>
  );
}
