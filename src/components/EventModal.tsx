import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { events, eraById } from '../data/timeline';
import { eraVar } from '../data/eraStyles';
import { useTimelineApp } from '../state/TimelineAppContext';
import { pad2, readMinutes, splitSource } from '../lib/format';
import { isPlainArrow, isTypingTarget } from '../lib/keys';
import { CloseIcon } from './ui/icons';
import type { TimelineEvent } from '../data/types';

type TextSize = 1 | 2 | 3;

const NAV_TITLE = 'overflow-hidden font-bn-display text-[16px] leading-[1.35] text-ellipsis whitespace-nowrap';

const SIZE_KEY = 'ctd-size';

const SIZE_BUTTONS: { size: TextSize; label: string; aria: string }[] = [
  { size: 1, label: 'অ−', aria: 'Smaller text' },
  { size: 2, label: 'অ', aria: 'Default text size' },
  { size: 3, label: 'অ+', aria: 'Larger text' },
];

const TEXT_SIZE_CLASS: Record<TextSize, string> = {
  1: 'text-[16px] leading-[1.85]',
  2: 'text-[18px] leading-[1.85]',
  3: 'text-[20.5px] leading-[1.8]',
};

function readSize(): TextSize {
  try {
    const n = Number(localStorage.getItem(SIZE_KEY));
    if (n === 1 || n === 2 || n === 3) return n;
  } catch {
    /* storage unavailable */
  }
  return 2;
}

/**
 * Right-hand reading panel. Stays mounted the whole time so the slide-in/out
 * can transition; it is not modal (the page behind stays usable), so the
 * page-level key handlers step aside while `quickLookEvent !== null` and this
 * component owns Escape / ArrowLeft / ArrowRight.
 */
export function EventModal() {
  const { quickLookEvent, openQuickLook, closeQuickLook, searchOpen } = useTimelineApp();

  // Keep showing the last event while the panel slides out.
  const [shown, setShown] = useState<TimelineEvent | null>(quickLookEvent);
  if (quickLookEvent && quickLookEvent !== shown) setShown(quickLookEvent);

  const [size, setSize] = useState<TextSize>(readSize);
  const open = quickLookEvent !== null;

  const panelRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  // the nav button that had focus when the reader stepped to another event
  const steppedFrom = useRef<HTMLButtonElement | null>(null);

  const index = shown ? events.findIndex((e) => e.id === shown.id) : -1;
  const prev = index > 0 ? events[index - 1] : undefined;
  const next = index >= 0 ? events[index + 1] : undefined;
  const shownId = shown?.id;

  const chooseSize = (s: TextSize) => {
    setSize(s);
    try {
      localStorage.setItem(SIZE_KEY, String(s));
    } catch {
      /* storage unavailable */
    }
  };

  // Focus the panel on open; hand focus back to whatever opened it on close.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement;
    panelRef.current?.focus({ preventScroll: true });
    return () => {
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true });
    };
  }, [open]);

  // A different event starts at the top.
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [shownId]);

  // Reading-progress bar: imperative width (continuous runtime value).
  useEffect(() => {
    const body = bodyRef.current;
    const bar = progressRef.current;
    if (!body || !bar) return;
    const update = () => {
      const max = body.scrollHeight - body.clientHeight;
      bar.style.width = `${max > 0 ? (body.scrollTop / max) * 100 : 100}%`;
    };
    update();
    body.addEventListener('scroll', update, { passive: true });
    return () => body.removeEventListener('scroll', update);
  }, [shownId, size]);

  const step = useCallback(
    (ev: TimelineEvent | undefined) => {
      if (!ev) return;
      const active = document.activeElement;
      steppedFrom.current = [prevRef.current, nextRef.current].find((b) => b !== null && b === active) ?? null;
      openQuickLook(ev);
    },
    [openQuickLook],
  );

  // At the first / last event a nav button becomes disabled. If it had focus,
  // hand focus to the other nav button, else the panel.
  useLayoutEffect(() => {
    const from = steppedFrom.current;
    steppedFrom.current = null;
    if (!from || !from.disabled) return;
    const other = from === prevRef.current ? nextRef.current : prevRef.current;
    (other && !other.disabled ? other : panelRef.current)?.focus({ preventScroll: true });
  }, [shownId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      if (e.key === 'Escape') {
        // search owns Escape while it is open
        if (!searchOpen && !e.metaKey && !e.ctrlKey && !e.altKey) closeQuickLook();
      } else if (isPlainArrow(e)) {
        if (searchOpen || isTypingTarget(document.activeElement)) return;
        e.preventDefault();
        step(e.key === 'ArrowLeft' ? prev : next);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, searchOpen, closeQuickLook, step, prev, next]);

  const era = shown ? eraById[shown.era] : undefined;
  const source = shown?.source ? splitSource(shown.source) : undefined;
  const paragraphs = shown
    ? shown.body
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  const panelBase =
    'fixed top-0 right-0 bottom-0 z-70 flex w-[min(600px,100%)] flex-col border-l border-line-strong bg-surface pt-[env(safe-area-inset-top,0px)] pr-[env(safe-area-inset-right,0px)] pb-[env(safe-area-inset-bottom,0px)] shadow-[-24px_0_60px_rgba(0,0,0,0.25)] outline-none';
  const panelState = open
    ? 'translate-x-0 visible [transition:translate_0.28s_ease-out]'
    : 'translate-x-[105%] invisible [transition:translate_0.28s_ease-out,visibility_0s_linear_0.28s]';

  const navBtn =
    'grid min-w-0 gap-0.5 rounded-[10px] border border-line-strong px-3.5 py-3 hover:border-gold disabled:cursor-default disabled:opacity-40 disabled:hover:border-line-strong';

  return (
    <aside
      ref={panelRef}
      id="reader"
      role="dialog"
      aria-modal="false"
      aria-labelledby="r-title"
      tabIndex={-1}
      lang="bn"
      data-open={open}
      className={`${panelBase} ${panelState} ${shown ? eraVar[shown.era] : ''}`}
    >
      <div className="relative flex items-center gap-2.5 border-b border-line px-[18px] py-3">
        <span className="mr-auto inline-flex min-w-0 items-center gap-2 font-bn text-[14px] text-text-2">
          {era && (
            <>
              <i className="h-[9px] w-[9px] flex-none rounded-full bg-e" />
              <span>
                {era.bn} · {era.span}
              </span>
            </>
          )}
        </span>
        <div role="group" aria-label="Text size" lang="en" className="inline-flex overflow-hidden rounded-lg border border-line-strong">
          {SIZE_BUTTONS.map((b) => (
            <button
              key={b.size}
              type="button"
              data-size={b.size}
              aria-label={b.aria}
              aria-pressed={size === b.size}
              onClick={() => chooseSize(b.size)}
              className="h-8 w-[38px] font-bn text-[15px] font-semibold text-text-2 not-first:border-l not-first:border-line-strong aria-pressed:bg-raised aria-pressed:text-text"
            >
              <span lang="bn">{b.label}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={closeQuickLook}
          aria-label="Close"
          lang="en"
          className="inline-grid h-9 w-9 flex-none place-items-center rounded-full border border-line-strong text-text-2 hover:border-gold hover:text-gold"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
        <span ref={progressRef} id="r-progress" className="absolute bottom-[-1px] left-0 h-0.5 w-0 bg-e" />
      </div>

      <div ref={bodyRef} id="r-body" className="flex-1 overflow-y-auto px-8 pt-7 pb-10 phone:px-[18px] phone:pt-[22px] phone:pb-8">
        {shown && era && (
          <>
            <div className="flex flex-wrap gap-x-3 gap-y-1 font-bn text-[14px] text-muted">
              <b className="font-medium text-e">অধ্যায় {pad2(shown.id)}</b>
              <span>{shown.year}</span>
              <span lang="en">{readMinutes(shown.body)} min read</span>
            </div>
            <h2 id="r-title" className="mt-2.5 font-bn-display text-[32px] leading-[1.3] font-normal phone:text-[27px]">
              {shown.title}
            </h2>
            {shown.source && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-raised px-3 py-1 font-bn text-[14px] text-text-2">
                <span lang="en">Source:</span> {shown.source}
              </div>
            )}

            <div lang="bn" className={`mt-[26px] max-w-[36em] font-bn text-text ${TEXT_SIZE_CLASS[size]}`}>
              {paragraphs.map((p, i) => (
                <p key={i} className={i > 0 ? 'mt-[1.1em]' : undefined}>
                  {p}
                </p>
              ))}
            </div>

            {source && (
              <div className="mt-8 grid gap-0.5 rounded-[10px] border border-line-strong px-[18px] py-4">
                <span lang="en" className="mb-0.5 font-ui text-xs font-semibold tracking-widest text-muted uppercase">Source</span>
                <b className="font-bn-display text-[18px] font-normal">{source.book}</b>
                {source.volume && <span className="font-bn text-[14px] text-muted">{source.volume}</span>}
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-2.5">
              <button ref={prevRef} type="button" disabled={!prev} onClick={() => step(prev)} className={navBtn}>
                <small lang="en" className="font-ui text-[13px] text-muted">
                  ← Previous
                </small>
                {prev ? (
                  <span className={NAV_TITLE}>{prev.title}</span>
                ) : (
                  <span lang="en" className={NAV_TITLE}>
                    This is the first event
                  </span>
                )}
              </button>
              <button
                ref={nextRef}
                type="button"
                disabled={!next}
                onClick={() => step(next)}
                className={`${navBtn} text-right`}
              >
                <small lang="en" className="font-ui text-[13px] text-muted">
                  Next →
                </small>
                {next ? (
                  <span className={NAV_TITLE}>{next.title}</span>
                ) : (
                  <span lang="en" className={NAV_TITLE}>
                    More events coming soon
                  </span>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
