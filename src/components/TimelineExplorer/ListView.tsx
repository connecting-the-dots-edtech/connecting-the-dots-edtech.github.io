import { events, eraById } from '../../data/timeline';
import { eraStyles } from '../../data/eraStyles';
import { useTimelineApp } from '../../state/TimelineAppContext';

export function ListView() {
  const { openQuickLook } = useTimelineApp();

  return (
    <div className="mx-auto mt-8.5 flex max-w-225 flex-col gap-0.5 px-5 sm:px-10">
      {events.map((ev) => {
        const era = eraById[ev.era];
        const style = eraStyles[era.id];
        return (
          <button
            key={ev.id}
            type="button"
            onClick={() => openQuickLook(ev)}
            className={`grid grid-cols-[120px_1fr_auto] items-center gap-5 rounded-[10px] border border-border bg-white/2 p-4 px-5 text-left ${style.accentBorderLeft3}`}
          >
            <span className={`font-serif text-base ${style.accentText}`}>{ev.year}</span>
            <span className="flex flex-col">
              <span className="font-bn text-[17px] text-cream-text">{ev.title}</span>
              <span className="mt-0.75 text-xs tracking-wide text-faint uppercase">{era.en}</span>
            </span>
            <span className="hidden text-[11px] text-quiet sm:block">◈ 4 &nbsp; ▷ 1 &nbsp; ♪ 1</span>
          </button>
        );
      })}
    </div>
  );
}
