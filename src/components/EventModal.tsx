import { useEffect } from 'react';
import { eraById } from '../data/timeline';
import { eraStyles } from '../data/eraStyles';
import { useTimelineApp } from '../state/TimelineAppContext';

export function EventModal() {
  const { quickLookEvent, closeQuickLook, showFullEvent } = useTimelineApp();

  useEffect(() => {
    if (!quickLookEvent) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeQuickLook();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [quickLookEvent, closeQuickLook]);

  if (!quickLookEvent) return null;
  const era = eraById[quickLookEvent.era];
  const style = eraStyles[era.id];

  return (
    <div
      className="fixed inset-0 z-130 flex items-center justify-center bg-[rgba(6,7,12,0.8)] px-6 py-10 backdrop-blur-md"
      onClick={closeQuickLook}
      role="dialog"
      aria-modal="true"
      aria-label={quickLookEvent.titleEn}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[86vh] w-full max-w-180 animate-rise-in-fast overflow-y-auto rounded-[20px] border border-border-gold bg-panel"
      >
        <div className="relative flex h-55 items-center justify-center rounded-t-[20px] bg-[repeating-linear-gradient(45deg,rgba(201,162,90,0.12)_0px,rgba(201,162,90,0.12)_8px,rgba(201,162,90,0.03)_8px,rgba(201,162,90,0.03)_16px)]">
          <span className="font-mono text-[11px] text-faint">{quickLookEvent.thumb}</span>
          <button
            type="button"
            onClick={closeQuickLook}
            aria-label="Close"
            className="absolute top-4 right-4 h-9.5 w-9.5 rounded-full border-none bg-[rgba(6,7,12,0.7)] text-base text-cream-text"
          >
            ✕
          </button>
          <span className={`absolute bottom-3.5 left-5 rounded-full bg-[rgba(6,7,12,0.6)] px-3 py-1.25 text-[11px] tracking-[0.16em] uppercase ${style.accentText}`}>
            {era.en} · {quickLookEvent.year}
          </span>
        </div>
        <div className="p-7 pt-7 pb-8">
          <h3 className="mb-1.5 font-bn text-[28px] leading-[1.3] font-semibold text-cream">{quickLookEvent.title}</h3>
          <div className="mb-4.5 font-serif text-[15px] text-faint">{quickLookEvent.titleEn}</div>
          <p className="mb-5.5 font-bn text-[17px] leading-[1.9] text-dim">{quickLookEvent.body}</p>
          <div className="mb-5.5 flex gap-2">
            <span className="h-17.5 flex-1 rounded-lg border border-[rgba(201,162,90,0.3)] bg-[rgba(201,162,90,0.12)]" />
            <span className="h-17.5 flex-1 rounded-lg bg-white/4" />
            <span className="h-17.5 flex-1 rounded-lg border border-[rgba(95,168,160,0.3)] bg-[rgba(95,168,160,0.1)]" />
          </div>
          <div className="flex gap-3">
            <a
              href="#event"
              onClick={() => showFullEvent(quickLookEvent)}
              className="flex-1 rounded-full bg-gold py-3.5 text-center text-sm font-semibold text-[#12121A]"
            >
              Read full event →
            </a>
            <button
              type="button"
              onClick={closeQuickLook}
              className="rounded-full border border-border-strong bg-transparent px-5.5 py-3.5 text-sm text-cream-text"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
