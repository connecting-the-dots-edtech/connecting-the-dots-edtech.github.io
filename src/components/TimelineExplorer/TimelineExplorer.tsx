import { useTimelineApp } from '../../state/TimelineAppContext';
import { TimelineView } from './TimelineView';
import { ListView } from './ListView';
import { ScrubberMinimap } from './ScrubberMinimap';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import type { ViewMode } from '../../data/types';

const VIEWS: { id: ViewMode; label: string }[] = [
  { id: 'timeline', label: 'Timeline' },
  { id: 'list', label: 'List' },
];

export function TimelineExplorer() {
  const { view, setView, zoom, zoomIn, zoomOut, zoomLabel } = useTimelineApp();
  const { ref: revealRef, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="timeline"
      ref={revealRef}
      className={`relative border-t border-border-gold bg-linear-to-b from-ink to-ink-alt pt-18 pb-17.5 sm:pt-20 transition-[opacity,transform] duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      {/* The timeline itself is the first thing on screen — no heading or
          controls above it — so opening this page shows the rail full-height
          without scrolling. The view toggle and zoom controls live below it
          instead of gating access to the thing people actually came for. */}
      {view === 'timeline' && (
        <>
          <TimelineView />
          <ScrubberMinimap />
        </>
      )}
      {view === 'list' && <ListView />}

      <div className="mx-auto mt-10 flex max-w-310 justify-center px-5 sm:px-10">
        <div className="flex flex-col items-center gap-3.5">
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
    </section>
  );
}
