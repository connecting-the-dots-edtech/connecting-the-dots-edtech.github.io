import { useTimelineApp } from '../../state/TimelineAppContext';
import { TimelineView } from './TimelineView';
import { ListView } from './ListView';
import { ScrubberMinimap } from './ScrubberMinimap';
import type { ViewMode } from '../../data/types';

const VIEWS: { id: ViewMode; label: string }[] = [
  { id: 'timeline', label: 'Timeline' },
  { id: 'list', label: 'List' },
];

export function TimelineExplorer() {
  const { view, setView } = useTimelineApp();

  return (
    <section id="timeline" className="relative pb-17.5">
      {/* The timeline itself is the first thing on screen — no heading or
          controls above it — so opening this page shows the rail full-height
          without scrolling. The view toggle lives below it. */}
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
        </div>
      </div>
    </section>
  );
}
