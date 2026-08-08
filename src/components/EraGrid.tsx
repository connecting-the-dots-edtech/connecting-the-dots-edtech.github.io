import { eras, events } from '../data/timeline';
import { eraStyles } from '../data/eraStyles';
import { useTimelineApp } from '../state/TimelineAppContext';
import { useParallax } from '../hooks/useParallax';

export function EraGrid() {
  const { scrollToEra } = useTimelineApp();
  const glowRef = useParallax<HTMLDivElement>(0.08);

  return (
    <section id="eras" className="relative overflow-hidden border-t border-border-gold bg-ink px-5 py-25 sm:px-10">
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-20 inset-x-0 bg-[radial-gradient(60%_45%_at_50%_0%,rgba(201,162,90,0.07),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-310">
        <div className="mb-12.5 text-center">
          <div className="mb-3 text-xs tracking-[0.34em] text-gold uppercase">◆ Chapters of Time</div>
          <h2 className="font-serif text-[clamp(30px,4vw,48px)] font-normal text-cream">Eight eras, one continuous story</h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4.5">
          {eras.map((era) => {
            const count = events.filter((ev) => ev.era === era.id).length;
            const style = eraStyles[era.id];
            return (
              <button
                key={era.id}
                type="button"
                onClick={() => scrollToEra(era.id)}
                className={`relative block min-h-55 w-full overflow-hidden rounded-2xl border border-border text-left ${style.tintBg}`}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.015)_0px,rgba(255,255,255,0.015)_3px,transparent_3px,transparent_24px)]"
                />
                <div className="relative flex h-full min-h-55 flex-col p-6.5 pt-6.5">
                  <span className={`text-[34px] leading-none ${style.accentText}`}>{era.glyph}</span>
                  <div className="mt-auto">
                    <div className={`text-[11px] tracking-[0.18em] uppercase ${style.accentText}`}>{era.span}</div>
                    <div className="mt-1.5 font-bn text-2xl text-cream">{era.bn}</div>
                    <div className="mt-0.5 font-serif text-[15px] text-[#B8B09C]">{era.en}</div>
                    <div className="mt-3 text-xs text-faint">{count} events →</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
