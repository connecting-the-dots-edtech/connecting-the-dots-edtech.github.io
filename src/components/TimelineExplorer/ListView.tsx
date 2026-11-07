import { eraVar } from '../../data/eraStyles';
import { eras, eventsForEra } from '../../data/timeline';
import { pad2, readMinutes } from '../../lib/format';
import { useTimelineApp } from '../../state/TimelineAppContext';
import { SectionHeading } from '../ui/SectionHeading';

const ROW =
  'group grid w-full grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-[14px] border-b border-line px-1 py-[14px] text-left';

/** Events grouped by era, as a reading list. */
export function ListView() {
  const { openQuickLook } = useTimelineApp();

  return (
    <div className="pr-[max(16px,env(safe-area-inset-right,0px))] pl-[max(16px,env(safe-area-inset-left,0px))]">
      <div className="mx-auto grid max-w-[1120px] gap-7 py-2 pb-6">
        {eras.map((era) => {
          const evs = eventsForEra(era.id);
          if (evs.length === 0) return null;
          return (
            <section key={era.id} className={'grid gap-5 ' + eraVar[era.id]}>
              <SectionHeading as="h2" eraId={era.id} title={era.bn} meta={era.span} />
              <div className="grid border-t border-line-strong">
                {evs.map((ev) => (
                  <button key={ev.id} type="button" onClick={() => openQuickLook(ev)} className={ROW}>
                    <span className="font-bn-display text-[22px] text-e">{pad2(ev.id)}</span>
                    <span className="block font-bn-display text-[19px] leading-[1.35] text-text group-hover:text-gold">
                      {ev.title}
                    </span>
                    <span lang="en" className="font-ui text-[13.5px] whitespace-nowrap text-muted">
                      {readMinutes(ev.body)} min read
                    </span>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
