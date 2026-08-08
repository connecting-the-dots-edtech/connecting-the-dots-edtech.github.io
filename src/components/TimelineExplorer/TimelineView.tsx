import { useMemo, useRef } from 'react';
import { eras, events, eraById } from '../../data/timeline';
import { eraStyles, eraWidthClasses } from '../../data/eraStyles';
import { useTimelineApp } from '../../state/TimelineAppContext';
import { useDragScroll } from '../../hooks/useDragScroll';
import { useConnectingLine } from '../../hooks/useConnectingLine';
import type { TimelineEvent, Era } from '../../data/types';

function EventCard({ ev, era, side }: { ev: TimelineEvent; era: Era; side: 'up' | 'down' }) {
  const { openQuickLook } = useTimelineApp();
  const style = eraStyles[era.id];
  return (
    <button
      type="button"
      onClick={() => openQuickLook(ev)}
      className={`flex w-full cursor-pointer items-center justify-center rounded-2xl border border-(--card-border) bg-card px-5 py-4.5 text-center shadow-(--card-shadow) ${
        side === 'up' ? style.accentBorderTop3 : style.accentBorderBottom3
      }`}
    >
      <span className="font-bn text-[19px] leading-[1.4] font-semibold text-gold-pale">{ev.title}</span>
    </button>
  );
}

function EventColumn({
  ev,
  era,
  onNodeRef,
}: {
  ev: TimelineEvent;
  era: Era;
  onNodeRef: (id: number, el: HTMLElement | null) => void;
}) {
  const { openQuickLook } = useTimelineApp();
  const style = eraStyles[era.id];
  const side = ev.up ? 'up' : 'down';

  return (
    <div className="flex w-64 flex-none flex-col items-center">
      <div className="flex w-full flex-[1.16] flex-col items-center justify-end">
        {side === 'up' && (
          <>
            <EventCard ev={ev} era={era} side="up" />
            <span className={`h-32.5 w-0.5 ${style.stemDown}`} />
          </>
        )}
      </div>

      <button
        ref={(el) => onNodeRef(ev.id, el)}
        type="button"
        onClick={() => openQuickLook(ev)}
        aria-label={ev.titleEn}
        className={`h-4.5 w-4.5 flex-none animate-pulse-ring rounded-full border-[3px] bg-ink-alt p-0 shadow-[0_0_0_6px_rgba(8,9,15,0.92),0_0_16px_rgba(201,162,90,0.5)] ${style.accentBorder}`}
      />

      <div className="flex w-full flex-1 flex-col items-center justify-start">
        {side === 'down' && (
          <>
            <span className={`h-32.5 w-0.5 ${style.stemUp}`} />
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

  const containerRef = useRef<HTMLDivElement>(null);
  const nodeIds = useMemo(() => events.map((ev) => ev.id), []);
  const { pathRef, geometry, registerNode } = useConnectingLine(containerRef, trackRef, nodeIds);

  return (
    <div className="mt-8.5">
      <div ref={trackRef} className="scrollbar-thin overflow-x-auto overflow-y-hidden px-5 sm:px-10">
        <div ref={containerRef} className="relative flex h-180 min-w-min">
          {geometry.d && (
            <svg
              className="pointer-events-none absolute inset-0 z-1"
              width={geometry.width}
              height={geometry.height}
              viewBox={`0 0 ${geometry.width} ${geometry.height}`}
            >
              <path
                ref={pathRef}
                d={geometry.d}
                fill="none"
                strokeWidth={2}
                strokeLinecap="round"
                className="stroke-gold drop-shadow-[0_0_6px_rgba(201,162,90,0.5)]"
              />
            </svg>
          )}
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
                  className={`absolute top-[calc(54%+18px)] left-1.5 z-4 rounded-full border border-border-gold bg-ink/55 px-2.25 py-0.5 font-serif text-[11px] whitespace-nowrap ${style.accentText}`}
                >
                  {era.span}
                </div>

                <div className="absolute inset-0 z-2 flex items-stretch justify-around px-5.5">
                  {eraEvents.map((ev) => (
                    <EventColumn key={ev.id} ev={ev} era={eraById[ev.era]} onNodeRef={registerNode} />
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
