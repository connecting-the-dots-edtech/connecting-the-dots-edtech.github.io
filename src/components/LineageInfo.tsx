import { useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { events } from '../data/timeline';
import { DEFAULT_SOURCE, LINK_TEXT } from '../data/lineage';
import type { LineageNode } from '../data/types';
import { childrenOf, lineageById } from '../lib/lineage';
import { useTimelineApp } from '../state/TimelineAppContext';
import { CloseIcon } from './ui/icons';

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-3 grid gap-[3px]">
      <span lang="en" className="font-ui text-xs font-semibold tracking-[0.06em] text-muted uppercase">
        {label}
      </span>
      <div className="font-bn text-[15px] leading-[1.65] text-text">{children}</div>
    </div>
  );
}

/**
 * The details of one lineage node: ✕ and Arabic name, Bangla name, tags, Parent / Children links,
 * Sent to, Note, Source and one `Read →` per article. Shared by the desktop panel (`#lin-info`) and the
 * phone bottom sheet (`#lin-sheet`); the caller supplies the positioned container.
 */
export function LineageInfo({ n, onSelect, onClose }: { n: LineageNode; onSelect: (id: string) => void; onClose: (pointer: boolean) => void }) {
  const { openQuickLook } = useTimelineApp();
  const nameRef = useRef<HTMLHeadingElement>(null);
  /** set by a Parent/Children link, so focus follows to the new node's name instead of dropping to <body> */
  const focusName = useRef(false);
  const go = (id: string) => {
    focusName.current = true;
    onSelect(id);
  };
  // each node starts at the top of its panel or sheet
  useLayoutEffect(() => {
    const name = nameRef.current;
    const box = name?.closest('#lin-info, #lin-sheet');
    if (box) box.scrollTop = 0;
    if (focusName.current) {
      focusName.current = false;
      name?.focus({ preventScroll: true });
    }
  }, [n.id]);
  const parent = n.parent ? lineageById[n.parent] : undefined;
  const kids = childrenOf(n.id);
  const tags = [n.kind === 'u' ? 'উলুল আযম রাসূল' : '', n.kind !== 'n' ? 'নবী' : '', n.book ? `কিতাব: ${n.book}` : ''].filter(Boolean);
  const evs = (n.events ?? []).map((id) => events.find((e) => e.id === id)).filter((e) => e !== undefined);
  const link =
    'cursor-pointer font-bn text-[15px] text-gold underline decoration-[color-mix(in_srgb,var(--gold)_45%,transparent)] underline-offset-[3px]';
  return (
    <>
      <div className="mb-1 flex min-h-[34px] items-center justify-between gap-2.5">
        <button type="button" lang="en" aria-label="Close" onClick={(e) => onClose(e.detail > 0)} className="grid size-8 flex-none cursor-pointer place-items-center rounded-lg text-text-2 hover:bg-raised">
          <CloseIcon className="size-4" />
        </button>
        {n.ar && (
          <div lang="ar" dir="rtl" className="font-ar text-[26px] leading-normal text-gold">
            {n.ar}
          </div>
        )}
      </div>
      <h2 ref={nameRef} tabIndex={-1} className="font-bn-display text-[25px] leading-[1.3] text-text">
        {n.bn}
      </h2>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="rounded-full border border-[color-mix(in_srgb,var(--gold)_55%,transparent)] px-2.5 py-px font-bn text-[13px] text-gold">
              {t}
            </span>
          ))}
        </div>
      )}
      {parent && n.link && (
        <InfoRow label="Parent">
          <button type="button" className={link} onClick={() => go(parent.id)}>
            {parent.bn}
          </button>
          <span className="block text-[13px] text-muted">{LINK_TEXT[n.link]}</span>
        </InfoRow>
      )}
      {n.unknown && (
        <InfoRow label="Parent">
          <span className="block text-[13px] text-muted">বংশধারা জানা যায় না</span>
        </InfoRow>
      )}
      {kids.length > 0 && (
        <InfoRow label="Children">
          <span className="flex flex-wrap gap-x-3 gap-y-1">
            {kids.map((c) => (
              <button key={c.id} type="button" className={link} onClick={() => go(c.id)}>
                {c.bn}
              </button>
            ))}
          </span>
        </InfoRow>
      )}
      {n.sent && <InfoRow label="Sent to">{n.sent}</InfoRow>}
      {n.note && <InfoRow label="Note">{n.note}</InfoRow>}
      <InfoRow label="Source">{n.source ?? (n.link === 'h' ? DEFAULT_SOURCE.h : DEFAULT_SOURCE.q)}</InfoRow>
      {evs.map((ev) => (
        <button
          key={ev.id}
          type="button"
          onClick={() => openQuickLook(ev)}
          className="mt-2 grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5 rounded-[10px] border border-line-strong px-3 py-2.5 text-left hover:border-gold"
        >
          <span className="font-bn-display text-[15.5px] leading-[1.35] text-text">{ev.title}</span>
          <span lang="en" className="font-ui text-[13px] font-semibold whitespace-nowrap text-gold">
            Read →
          </span>
        </button>
      ))}
    </>
  );
}
