import { useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { eraById } from '../data/timeline';
import { eraVar } from '../data/eraStyles';
import { useTimelineApp } from '../state/TimelineAppContext';
import { SearchIcon } from './ui/icons';

export function SearchOverlay() {
  const { searchOpen, closeSearch, query, setQuery, category, setCategory, categories, categoryCounts, searchResults, openQuickLook } =
    useTimelineApp();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchOpen) return;
    inputRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen, closeSearch]);

  if (!searchOpen) return null;

  // Keep arrow keys inside the dialog so page-level handlers (timeline scrub, reader nav) never see them.
  const keepArrowsLocal = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.stopPropagation();
  };

  const q = query.trim();

  return (
    <>
      <div className="fixed inset-0 z-65 bg-(--scrim)" onClick={closeSearch} aria-hidden="true" />
      <div
        id="search"
        lang="bn"
        role="dialog"
        aria-modal="true"
        aria-label="Search events"
        onKeyDown={keepArrowsLocal}
        className="fixed top-[max(10vh,env(safe-area-inset-top))] left-1/2 z-75 flex max-h-[76vh] w-[min(680px,calc(100%-32px))] -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-(--shadow)"
      >
        <label className="flex items-center gap-3 border-b border-line px-4.5 py-3.5">
          <SearchIcon className="h-4.5 w-4.5 flex-none text-muted" />
          <input
            id="s-q"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: আদম, ফেরেশতা, জিন…"
            autoComplete="off"
            className="min-w-0 flex-1 border-0 bg-transparent font-bn text-[19px] text-text outline-none placeholder:text-muted"
          />
        </label>

        <div lang="en" className="flex flex-wrap gap-2 border-b border-line px-4.5 py-3">
          {categories.map((k) => {
            const n = categoryCounts[k];
            const selected = category === k;
            return (
              <button
                key={k}
                type="button"
                data-cat={k}
                aria-pressed={selected}
                disabled={n === 0 && k !== 'All'}
                onClick={() => setCategory(k)}
                className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 font-ui text-[14.5px] disabled:cursor-default disabled:opacity-45 ${
                  selected ? 'border-gold-fill bg-gold-fill text-on-gold' : 'border-line-strong text-text-2'
                }`}
              >
                {k} <span className={selected ? 'text-on-gold' : 'text-muted'}>{n}</span>
              </button>
            );
          })}
        </div>

        <div className="overflow-y-auto px-2 pt-1.5 pb-2.5">
          {searchResults.length > 0 ? (
            searchResults.map((ev) => (
              <button
                key={ev.id}
                type="button"
                data-result
                onClick={() => {
                  closeSearch();
                  openQuickLook(ev);
                }}
                className={`${eraVar[ev.era]} grid w-full grid-cols-[10px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg p-2.5 text-left hover:bg-raised focus-visible:bg-raised`}
              >
                <i className="h-2 w-2 rounded-full bg-e" />
                <span className="block font-bn text-base text-text">{ev.title}</span>
                <span className="font-bn text-[13px] whitespace-nowrap text-muted">{eraById[ev.era].bn}</span>
              </button>
            ))
          ) : (
            <div lang="en" className="p-7 text-center font-ui text-sm text-muted">
              No events match “{q}”. Try আদম or জিন.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
