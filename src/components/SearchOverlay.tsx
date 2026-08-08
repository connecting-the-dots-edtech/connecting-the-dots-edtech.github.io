import { useEffect, useRef } from 'react';
import { eraById } from '../data/timeline';
import { eraStyles } from '../data/eraStyles';
import { useTimelineApp } from '../state/TimelineAppContext';

export function SearchOverlay() {
  const { searchOpen, closeSearch, query, setQuery, category, setCategory, categories, searchResults, openQuickLook } =
    useTimelineApp();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchOpen) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen, closeSearch]);

  if (!searchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-120 flex flex-col items-center overflow-y-auto bg-[rgba(6,7,12,0.86)] px-6 py-22.5 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Search the timeline"
    >
      <div className="w-full max-w-190">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-serif text-[22px] text-cream">Search the timeline</span>
          <button
            type="button"
            onClick={closeSearch}
            aria-label="Close search"
            className="h-10 w-10 rounded-full border border-border-strong text-lg text-cream-text"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-3.5 border-b-2 border-gold py-3.5">
          <span className="h-4.5 w-4.5 flex-none rounded-full border-2 border-gold" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try: হিজরত, Badr, Baghdad…"
            className="flex-1 border-none bg-transparent font-bn text-2xl text-cream outline-none"
          />
        </div>

        <div className="my-5.5 flex flex-wrap gap-2.5">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={
                category === c
                  ? 'rounded-full border border-gold-fill bg-gold-fill px-4 py-2 text-[13px] text-[#12121A]'
                  : 'rounded-full border border-border-strong bg-(--surface-2) px-4 py-2 text-[13px] text-mute'
              }
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {searchResults.map((ev) => {
            const era = eraById[ev.era];
            const style = eraStyles[era.id];
            return (
              <button
                key={ev.id}
                type="button"
                onClick={() => {
                  closeSearch();
                  openQuickLook(ev);
                }}
                className={`grid grid-cols-[90px_1fr_auto] items-center gap-4 rounded-[10px] border border-border bg-(--surface-1) p-3.5 px-4.5 text-left ${style.accentBorderLeft3}`}
              >
                <span className={`font-serif ${style.accentText}`}>{ev.year}</span>
                <span className="font-bn text-base text-cream-text">{ev.title}</span>
                <span className="hidden text-[11px] tracking-wide text-quiet uppercase sm:block">{era.en}</span>
              </button>
            );
          })}
          {searchResults.length === 0 && <div className="p-7.5 text-center text-sm text-quiet">No events match your search.</div>}
        </div>
      </div>
    </div>
  );
}
