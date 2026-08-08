import { useEffect, useState } from 'react';
import { eraById } from '../data/timeline';
import { eraStyles } from '../data/eraStyles';
import { useTimelineApp } from '../state/TimelineAppContext';
import type { TimelineEvent } from '../data/types';

const EXIT_DURATION_MS = 300;

/**
 * A docked side panel, not a blocking modal: no backdrop, so the page
 * behind stays scrollable and clickable. Opening a different event while
 * this is already open just swaps the panel's content in place; only the
 * open/close transitions animate.
 */
export function EventModal() {
  const { quickLookEvent, closeQuickLook } = useTimelineApp();
  const [renderedEvent, setRenderedEvent] = useState<TimelineEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (quickLookEvent) {
      setRenderedEvent(quickLookEvent);
      // Only animate the entrance the first time the panel opens — if it's
      // already open and the user clicked a different card, just swap
      // content in place instead of re-running the slide-in.
      if (!renderedEvent) {
        setVisible(false);
        // A single rAF often fires before the "off-screen" frame actually
        // paints, so the browser jumps straight to the end state instead of
        // transitioning. Nesting two rAFs guarantees a real painted frame
        // in between.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setVisible(true));
        });
      }
    } else if (renderedEvent) {
      setVisible(false);
      const t = setTimeout(() => setRenderedEvent(null), EXIT_DURATION_MS);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quickLookEvent]);

  useEffect(() => {
    if (!renderedEvent) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeQuickLook();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [renderedEvent, closeQuickLook]);

  if (!renderedEvent) return null;

  const era = eraById[renderedEvent.era];
  const style = eraStyles[era.id];
  const paragraphs = renderedEvent.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={renderedEvent.titleEn}
      className={`fixed inset-y-0 right-0 z-130 flex w-full max-w-135 flex-col border-l border-border-gold bg-panel shadow-[-32px_0_60px_rgba(0,0,0,0.55)] transition-transform duration-300 ease-out ${
        visible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className={`h-1.5 w-full flex-none ${style.accentBg}`} />

      <button
        type="button"
        onClick={closeQuickLook}
        aria-label="Close"
        className="absolute top-6 right-6 z-20 h-9.5 w-9.5 rounded-full border-none bg-(--surface-3) text-base text-cream-text hover:bg-(--surface-4)"
      >
        ✕
      </button>

      <div className="relative flex-1 overflow-y-auto px-8 pt-10 pb-10 sm:px-10">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full opacity-[0.08] blur-3xl ${style.accentBg}`}
        />

        <span className={`text-2xl leading-none ${style.accentText}`} aria-hidden="true">
          {era.glyph}
        </span>

        <h3 className="mt-4 mb-6 font-bn text-[28px] leading-[1.4] font-semibold text-cream">{renderedEvent.title}</h3>

        <div className="mb-6 flex items-center gap-3" aria-hidden="true">
          <span className={`h-px flex-1 ${style.accentBg} opacity-25`} />
          <span className={`text-xs ${style.accentText}`}>◆</span>
          <span className={`h-px flex-1 ${style.accentBg} opacity-25`} />
        </div>

        <div className="relative font-bn text-[17px] leading-[1.9] text-dim">
          {paragraphs.map((para, i) => (
            <p key={i} className={i > 0 ? 'mt-5' : 'text-[18px] text-cream-text/90'}>
              {para}
            </p>
          ))}
        </div>

        {renderedEvent.source && (
          <div className="mt-8 flex gap-2 border-t border-border-gold pt-4 font-bn text-sm text-quiet italic">
            <span className="text-teal not-italic">◇</span>
            <span>সূত্র: {renderedEvent.source}</span>
          </div>
        )}
      </div>
    </div>
  );
}
