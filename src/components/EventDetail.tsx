import { events, eraById, categories, eventMatchesCategory } from '../data/timeline';
import { eraStyles } from '../data/eraStyles';
import { useTimelineApp } from '../state/TimelineAppContext';
import { useParallax } from '../hooks/useParallax';
import { useScrollReveal } from '../hooks/useScrollReveal';

function categoryLabelFor(evId: number): string {
  const ev = events.find((e) => e.id === evId)!;
  return categories.find((c) => c !== 'All' && eventMatchesCategory(ev, c)) ?? 'General';
}

export function EventDetail() {
  const { detailEvent, showFullEvent } = useTimelineApp();
  const era = eraById[detailEvent.era];
  const style = eraStyles[era.id];
  const index = events.findIndex((e) => e.id === detailEvent.id);
  const prev = index > 0 ? events[index - 1] : null;
  const next = index < events.length - 1 ? events[index + 1] : null;
  const bgRef = useParallax<HTMLDivElement>(0.07);
  const { ref: revealRef, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="event"
      ref={revealRef}
      className={`relative overflow-hidden border-t border-border-gold bg-ink-alt px-5 py-25 transition-[opacity,transform] duration-700 ease-out sm:px-10 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <div
        ref={bgRef}
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-20 inset-x-0 bg-linear-to-b from-ink-alt to-ink"
      />
      <div className="relative mx-auto max-w-290">
        <div className="mb-7 text-xs tracking-[0.34em] text-gold uppercase">◆ Event Detail — Documentary View</div>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <div className={`text-[13px] tracking-[0.12em] uppercase ${style.accentText}`}>
              {detailEvent.year} · {era.en}
            </div>
            <h2 className="mt-3 font-bn text-[clamp(30px,4vw,46px)] leading-[1.25] font-semibold text-cream">
              {detailEvent.title}
            </h2>
            <div className="mt-1.5 font-serif text-[15px] text-faint">{detailEvent.titleEn}</div>

            {detailEvent.arabic && (
              <div dir="rtl" className="my-5 font-ar text-3xl leading-[1.6] text-gold">
                {detailEvent.arabic}
              </div>
            )}

            <div className="my-2 mb-6 flex h-85 items-center justify-center rounded-2xl border border-border bg-[repeating-linear-gradient(45deg,rgba(201,162,90,0.1)_0px,rgba(201,162,90,0.1)_8px,rgba(201,162,90,0.03)_8px,rgba(201,162,90,0.03)_16px)]">
              <span className="font-mono text-xs text-faint">{detailEvent.thumb}</span>
            </div>

            <p className="font-bn text-lg leading-[1.9] text-dim">{detailEvent.body}</p>

            {detailEvent.source && (
              <div className="mt-8.5 border-t border-border-gold pt-5.5">
                <div className="mb-3.5 text-[11px] tracking-[0.2em] text-gold uppercase">Source</div>
                <div className="flex gap-3 py-2.5 text-sm text-mute">
                  <span className="text-teal">◇</span>
                  <span>{detailEvent.source}</span>
                </div>
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-22.5">
            <div className="overflow-hidden rounded-2xl border border-border bg-(--surface-1)">
              <div className="flex border-b border-border">
                <span className="flex-1 bg-gold-fill py-3 text-center text-xs font-semibold text-[#12121A]">Images</span>
                <span className="flex-1 py-3 text-center text-xs text-mute">Video</span>
                <span className="flex-1 py-3 text-center text-xs text-mute">Audio</span>
              </div>
              <div className="flex h-45 items-center justify-center bg-[repeating-linear-gradient(45deg,rgba(95,168,160,0.1)_0px,rgba(95,168,160,0.1)_8px,rgba(95,168,160,0.03)_8px,rgba(95,168,160,0.03)_16px)]">
                <span className="font-mono text-[11px] text-faint">{detailEvent.thumb}</span>
              </div>
              <div className="flex gap-2 p-3">
                <span className="h-12 flex-1 rounded-md border border-[rgba(201,162,90,0.4)] bg-[rgba(201,162,90,0.14)]" />
                <span className="h-12 flex-1 rounded-md bg-(--surface-2)" />
                <span className="h-12 flex-1 rounded-md bg-(--surface-2)" />
                <span className="h-12 flex-1 rounded-md bg-(--surface-2)" />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-(--surface-1) p-4.5 text-[13px] leading-[1.9] text-mute">
              <div className="flex justify-between">
                <span className="text-quiet">Era</span>
                <span className="font-bn">{era.bn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-quiet">Category</span>
                <span>{categoryLabelFor(detailEvent.id)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-quiet">Period</span>
                <span>{era.span}</span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                disabled={!prev}
                onClick={() => prev && showFullEvent(prev)}
                className="flex-1 rounded-full bg-gold-fill py-3.25 text-center text-sm font-semibold text-[#12121A] disabled:opacity-35"
              >
                ← Prev event
              </button>
              <button
                type="button"
                disabled={!next}
                onClick={() => next && showFullEvent(next)}
                className="flex-1 rounded-full border border-border-strong py-3.25 text-center text-sm text-cream-text disabled:opacity-35"
              >
                Next event →
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
