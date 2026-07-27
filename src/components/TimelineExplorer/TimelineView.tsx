import { eras, events, eraById } from '../../data/timeline';
import { eraStyles, eraWidthClasses } from '../../data/eraStyles';
import { useTimelineApp } from '../../state/TimelineAppContext';
import { useDragScroll } from '../../hooks/useDragScroll';
import { useParallax } from '../../hooks/useParallax';
import type { TimelineEvent, Era } from '../../data/types';

function EraBackdrop({ era }: { era: Era }) {
  const ref = useParallax<HTMLDivElement>(0.12);
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="font-serif text-[122px] whitespace-nowrap tracking-[0.04em] text-white/3">{era.en}</span>
    </div>
  );
}

function EventCard({ ev, era, side }: { ev: TimelineEvent; era: Era; side: 'up' | 'down' }) {
  const { openQuickLook } = useTimelineApp();
  const style = eraStyles[era.id];
  return (
    <button
      type="button"
      onClick={() => openQuickLook(ev)}
      className={`w-full cursor-pointer overflow-hidden rounded-2xl border border-border-strong bg-card p-0 text-left shadow-[0_22px_46px_rgba(0,0,0,0.62)] ${
        side === 'up' ? style.accentBorderTop3 : style.accentBorderBottom3
      }`}
    >
      {side === 'up' && (
        <div className="flex h-30 items-center justify-center border-b border-border bg-[repeating-linear-gradient(45deg,rgba(201,162,90,0.12)_0px,rgba(201,162,90,0.12)_7px,rgba(201,162,90,0.04)_7px,rgba(201,162,90,0.04)_14px)]">
          <span className="font-mono text-[10px] tracking-wide text-faint">{ev.thumb}</span>
        </div>
      )}
      <div className="p-4 pt-3.5 pb-4">
        <div className={`text-[11px] font-semibold tracking-[0.16em] uppercase ${style.accentText}`}>{era.en}</div>
        <div className="mt-1.5 font-bn text-[19px] leading-[1.34] font-semibold text-gold-pale">{ev.title}</div>
        <div className="mt-2 line-clamp-3 font-bn text-[13.5px] leading-[1.7] text-dim">{ev.body}</div>
        <div className="mt-3 flex gap-3 border-t border-border pt-2.75 text-[11px] tracking-[0.04em] text-faint">
          <span>◈ 4</span>
          <span>▷ 1</span>
          <span>♪ 1</span>
        </div>
      </div>
      {side === 'down' && (
        <div className="flex h-30 items-center justify-center border-t border-border bg-[repeating-linear-gradient(45deg,rgba(201,162,90,0.12)_0px,rgba(201,162,90,0.12)_7px,rgba(201,162,90,0.04)_7px,rgba(201,162,90,0.04)_14px)]">
          <span className="font-mono text-[10px] tracking-wide text-faint">{ev.thumb}</span>
        </div>
      )}
    </button>
  );
}

function EventColumn({ ev, era }: { ev: TimelineEvent; era: Era }) {
  const { openQuickLook } = useTimelineApp();
  const style = eraStyles[era.id];
  const side = ev.up ? 'up' : 'down';

  return (
    <div className="flex w-80 flex-none flex-col items-center">
      <div className="flex w-full flex-[1.16] flex-col items-center justify-end">
        {side === 'up' ? (
          <>
            <EventCard ev={ev} era={era} side="up" />
            <span className={`h-8.5 w-0.5 ${style.stemDown}`} />
          </>
        ) : (
          <span className="mb-3 font-serif text-3xl tracking-[0.03em] whitespace-nowrap text-gold-pale/42">{ev.year}</span>
        )}
      </div>

      <button
        type="button"
        onClick={() => openQuickLook(ev)}
        aria-label={`${ev.titleEn} — ${ev.year}`}
        className={`h-4.5 w-4.5 flex-none animate-pulse-ring rounded-full border-[3px] bg-ink-alt p-0 shadow-[0_0_0_6px_rgba(8,9,15,0.92),0_0_16px_rgba(201,162,90,0.5)] ${style.accentBorder}`}
      />

      <div className="flex w-full flex-1 flex-col items-center justify-start">
        {side === 'up' ? (
          <span className="mt-3 font-serif text-3xl tracking-[0.03em] whitespace-nowrap text-gold-pale/42">{ev.year}</span>
        ) : (
          <>
            <span className={`h-8.5 w-0.5 ${style.stemUp}`} />
            <EventCard ev={ev} era={era} side="down" />
          </>
        )}
      </div>
    </div>
  );
}

export function TimelineView() {
  const { trackRef, zoom } = useTimelineApp();
  useDragScroll(trackRef);

  return (
    <div className="mt-8.5">
      <div ref={trackRef} className="scrollbar-thin overflow-x-auto overflow-y-hidden px-5 sm:px-10">
        <div className="relative flex h-180 min-w-min">
          <div className="absolute top-[54%] right-0 left-0 z-1 h-0.5 -translate-y-1/2 bg-[linear-gradient(90deg,rgba(201,162,90,0.12)_0%,rgba(201,162,90,0.65)_5%,rgba(201,162,90,0.65)_95%,rgba(201,162,90,0.12)_100%)] shadow-[0_0_16px_rgba(201,162,90,0.4)]" />
          <div className="pointer-events-none absolute top-[54%] right-0 left-0 z-1 h-2.5 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_63px,rgba(201,162,90,0.3)_63px,rgba(201,162,90,0.3)_64px)]" />
          <div className="absolute top-[54%] left-0 z-1 -translate-y-1/2">
            <span className="block h-2.25 w-2.25 rounded-full border-2 border-gold" />
          </div>
          <div className="absolute top-[54%] right-1.5 z-5 -translate-y-1/2 text-[15px] leading-none text-gold">▶</div>

          {eras.map((era) => {
            const eraEvents = events.filter((ev) => ev.era === era.id);
            const style = eraStyles[era.id];
            const widthClass = eraWidthClasses[era.id][zoom];
            return (
              <div
                key={era.id}
                data-era={era.id}
                className={`relative overflow-hidden border-r border-dashed border-[rgba(201,162,90,0.24)] ${style.tintBg} ${widthClass}`}
              >
                <EraBackdrop era={era} />
                <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.014)_0px,rgba(255,255,255,0.014)_2px,transparent_2px,transparent_22px)]" />

                <div className="absolute inset-x-0 top-0 z-3 flex items-center gap-3 border-b border-border bg-linear-to-b from-ink/62 to-transparent px-5.5 py-3.75 pb-3.5">
                  <span className={`text-[22px] leading-none ${style.accentText}`}>{era.glyph}</span>
                  <div className="min-w-0">
                    <div className="overflow-hidden font-bn text-lg leading-[1.15] text-ellipsis whitespace-nowrap text-cream">
                      {era.bn}
                    </div>
                    <div className={`mt-0.75 text-[10px] tracking-[0.18em] whitespace-nowrap uppercase ${style.accentText}`}>
                      {era.en}
                    </div>
                  </div>
                </div>

                <div
                  className={`absolute top-[54%] left-0 z-4 h-3.5 w-3.5 -translate-x-px -translate-y-1/2 rotate-45 border-2 ${style.tintBg} ${style.accentBorder}`}
                />
                <div
                  className={`absolute top-[calc(54%+18px)] left-1.5 z-4 rounded-full border border-border-gold bg-ink/55 px-2.25 py-0.5 font-serif text-[11px] whitespace-nowrap ${style.accentText}`}
                >
                  {era.span}
                </div>

                <div className="absolute inset-0 z-2 flex items-stretch justify-around px-5.5">
                  {eraEvents.map((ev) => (
                    <EventColumn key={ev.id} ev={ev} era={eraById[ev.era]} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
