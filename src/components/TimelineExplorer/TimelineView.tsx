import { useEffect, useRef, useState } from 'react';
import { eraVar } from '../../data/eraStyles';
import { eraNumber, eras, eventsForEra } from '../../data/timeline';
import type { TimelineEvent } from '../../data/types';
import { useConnectingLine } from '../../hooks/useConnectingLine';
import { useCurve } from '../../hooks/useCurve';
import { useDragScroll } from '../../hooks/useDragScroll';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { pad2 } from '../../lib/format';
import { isTypingTarget } from '../../lib/keys';
import { useTimelineApp } from '../../state/TimelineAppContext';
import { CurveSvg } from '../ui/CurveSvg';
import { EventCard } from '../ui/EventCard';
import { ChevronLeftIcon, ChevronRightIcon } from '../ui/icons';

/* Desktop: a 560px horizontal track, dots at 40% / 60% of the lane with the
   card above / below. Phone (≤760px): a vertical list, the curve snakes down
   the left side (dots alternate 14px / 36px), cards to the right of the dot. */
const SCROLLER =
  'scroll-smooth motion-reduce:scroll-auto overflow-x-auto overflow-y-hidden border-y border-line bg-linear-180 from-[color-mix(in_srgb,var(--raised)_60%,var(--surface))] to-surface pr-[max(16px,env(safe-area-inset-right,0px))] pl-[max(16px,env(safe-area-inset-left,0px))] [scrollbar-width:thin] phone:overflow-visible phone:border-0 phone:bg-none phone:bg-transparent';

const CAP = 'absolute top-1/2 z-3 -mt-1.5 size-3 rounded-full border-2 border-gold bg-surface phone:hidden';

const NODE_BASE =
  'absolute left-1/2 z-3 -mt-2.5 -ml-2.5 size-5 rounded-full border-3 border-surface bg-e shadow-[0_0_0_2px_var(--e),0_0_18px_color-mix(in_srgb,var(--e)_55%,transparent)] transition-transform duration-150 group-hover:scale-[1.2] hover:scale-[1.2] phone:static phone:m-0 phone:flex-none';
const NODE_UP = 'top-[40%] phone:ml-3.5';
const NODE_DOWN = 'top-[60%] phone:ml-9';

const CARD_BASE = 'absolute left-1/2 z-2 -ml-[130px] phone:static phone:my-1.5 phone:mr-3.5 phone:min-w-0 phone:flex-1';
const CARD_UP = 'bottom-[calc(60%+30px)] phone:ml-8';
const CARD_DOWN = 'top-[calc(60%+30px)] phone:ml-2.5';

const STEM_BASE = 'absolute left-1/2 z-2 -ml-px h-[21px] w-0.5 bg-e phone:hidden';
const STEM_UP = 'top-[calc(40%-30px)]';
const STEM_DOWN = 'top-[calc(60%+9px)]';

const ARROW =
  'absolute top-1/2 z-6 -mt-[22px] grid size-11 place-items-center rounded-full border border-line-strong bg-surface text-text shadow-(--shadow) hover:border-gold hover:text-gold disabled:pointer-events-none disabled:opacity-0 phone:hidden';

function EventColumn({ ev }: { ev: TimelineEvent }) {
  const { openQuickLook } = useTimelineApp();
  const up = ev.id % 2 === 1;

  return (
    <div className="group relative w-[150px] flex-none phone:flex phone:w-auto phone:items-center">
      <button
        type="button"
        data-curve-pt=""
        aria-label={ev.title}
        onClick={() => openQuickLook(ev)}
        className={NODE_BASE + ' ' + (up ? NODE_UP : NODE_DOWN)}
      />
      <span aria-hidden="true" className={STEM_BASE + ' ' + (up ? STEM_UP : STEM_DOWN)} />
      <EventCard ev={ev} variant="timeline" className={CARD_BASE + ' ' + (up ? CARD_UP : CARD_DOWN)} />
    </div>
  );
}

/** The horizontal timeline track with the gold cosine curve, arrows, drag and ←/→ keys. */
export function TimelineView() {
  const { trackRef, quickLookEvent, searchOpen } = useTimelineApp();
  const trackElRef = useRef<HTMLDivElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);

  const vertical = useMediaQuery('(max-width: 760px)');
  const curve = useCurve(trackElRef, vertical);
  useConnectingLine(trackElRef, trackRef, vertical, clipRectRef, curve);
  useDragScroll(trackRef);

  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const sc = trackRef.current;
    if (!sc) return;
    let start: boolean | null = null;
    let end: boolean | null = null;
    const update = () => {
      const s = sc.scrollLeft < 8;
      const e = sc.scrollLeft + sc.clientWidth > sc.scrollWidth - 8;
      if (s !== start) setAtStart((start = s));
      if (e !== end) setAtEnd((end = e));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(sc);
    if (trackElRef.current) ro.observe(trackElRef.current);
    sc.addEventListener('scroll', update, { passive: true });
    return () => {
      ro.disconnect();
      sc.removeEventListener('scroll', update);
    };
  }, [trackRef]);

  useEffect(() => {
    if (quickLookEvent !== null || searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (isTypingTarget(document.activeElement)) return;
      const sc = trackRef.current;
      if (!sc) return;
      e.preventDefault();
      sc.scrollBy({ left: e.key === 'ArrowLeft' ? -300 : 300 });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [quickLookEvent, searchOpen, trackRef]);

  const scrollPage = (dir: 1 | -1) => {
    const sc = trackRef.current;
    if (sc) sc.scrollBy({ left: dir * sc.clientWidth * 0.8 });
  };

  return (
    <div className="relative mt-[22px] phone:mt-[18px]">
      <button
        type="button"
        lang="en"
        aria-label="Earlier events"
        disabled={atStart}
        onClick={() => scrollPage(-1)}
        className={ARROW + ' left-3'}
      >
        <ChevronLeftIcon className="size-[18px]" />
      </button>

      <div id="tl-scroller" ref={trackRef} className={SCROLLER}>
        <div
          id="tl-track"
          ref={trackElRef}
          className="relative flex h-[560px] min-w-max phone:h-auto phone:min-w-0 phone:flex-col"
        >
          <CurveSvg
            width={curve.width}
            height={curve.height}
            segments={curve.segments}
            clipPathId="tl-clip"
            clipRectRef={clipRectRef}
          />
          <span data-curve-pt="" className={CAP + ' left-[18px] -ml-1.5'} />

          {eras.map((era) => {
            const evs = eventsForEra(era.id);
            return (
              <section
                key={era.id}
                data-era={era.id}
                className={
                  'flex flex-none flex-col border-r border-line phone:mb-3.5 phone:rounded-[12px] phone:border ' +
                  eraVar[era.id]
                }
              >
                <div className="sticky left-0 grid w-max max-w-full gap-px px-[22px] pt-3.5 phone:static phone:pt-3.5 phone:pr-4 phone:pb-1 phone:pl-16">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-bn-display text-[16px] text-e">{pad2(eraNumber(era.id))}</span>
                    <span className="font-bn-display text-[21px] leading-[1.35] text-text">{era.bn}</span>
                  </div>
                  <div className="font-bn text-[14px] text-muted">{era.span}</div>
                </div>

                {evs.length > 0 ? (
                  <div className="relative flex flex-1 px-16 phone:flex-col phone:px-0 phone:pt-1 phone:pb-3">
                    {evs.map((ev) => (
                      <EventColumn key={ev.id} ev={ev} />
                    ))}
                  </div>
                ) : (
                  <div className="relative w-[200px] flex-1 phone:min-h-[52px] phone:w-auto">
                    <span data-curve-pt="" data-soon="" className="absolute top-1/2 left-1/2 -mt-1 -ml-1 size-2 phone:left-[34px]" />
                  </div>
                )}
              </section>
            );
          })}

          <span data-curve-pt="" data-soon="" className={CAP + ' right-3'} />
        </div>
      </div>

      <button
        type="button"
        lang="en"
        aria-label="Later events"
        disabled={atEnd}
        onClick={() => scrollPage(1)}
        className={ARROW + ' right-3'}
      >
        <ChevronRightIcon className="size-[18px]" />
      </button>
    </div>
  );
}
