import { eras } from '../../data/timeline';
import { eraStyles } from '../../data/eraStyles';
import { useTimelineApp } from '../../state/TimelineAppContext';

export function ScrubberMinimap() {
  const { scrollToEra } = useTimelineApp();

  return (
    <div className="mx-auto mt-6 max-w-310 px-5 sm:px-10">
      <div className="flex h-11.5 overflow-hidden rounded-[10px] border border-border">
        {eras.map((era) => {
          const style = eraStyles[era.id];
          return (
            <button
              key={era.id}
              type="button"
              onClick={() => scrollToEra(era.id)}
              className={`relative flex items-center justify-center border-r border-black/35 text-[10px] tracking-[0.12em] text-[#B8B09C] uppercase ${style.tintBg} ${style.minimapFlex}`}
            >
              <span className={`absolute inset-x-0 top-0 h-0.5 opacity-70 ${style.accentBg}`} />
              {era.short}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[11px] tracking-wide text-ghost">
        <span>◄ BEFORE TIME</span>
        <span>Drag the timeline or tap an era to jump</span>
        <span>PRESENT ►</span>
      </div>
    </div>
  );
}
