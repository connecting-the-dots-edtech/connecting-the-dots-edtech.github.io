import { useImperativeHandle, useRef, useState } from 'react';
import type { Ref } from 'react';
import { flushSync } from 'react-dom';
import type { LineageLink } from '../data/types';
import { bnDigits } from '../lib/format';
import { lineageRows } from '../lib/lineage';
import type { LineageRow } from '../lib/lineage';
import { scrollBehavior } from '../lib/motion';

const LEGEND_NODES = [
  ['inline-block size-[15px] rounded-full bg-gold shadow-[0_0_0_2px_var(--bg),0_0_0_3.5px_var(--gold),0_0_0_6px_color-mix(in_srgb,var(--gold)_35%,transparent)]', 'উলুল আযম রাসূল'],
  ['inline-block size-3 rounded-full bg-gold shadow-[0_0_0_2px_var(--bg),0_0_0_3.5px_var(--gold)]', 'নবী'],
  ['inline-block size-[9px] rounded-full border-[1.6px] border-muted bg-surface', 'পূর্বপুরুষ'],
] as const;
const LEGEND_LINES = [
  ['inline-block h-0 border-t-[2.5px] border-gold', 'কুরআন / সহীহ হাদিস'],
  ['inline-block h-0 border-t-[1.5px] border-gold opacity-60', 'ইতিহাসবিদদের বর্ণনা'],
  ['inline-block h-0 border-t-2 border-dotted border-gold', 'মাঝে প্রজন্ম / মতভেদ'],
] as const;

/** Legend entries (node types, or line types with `lines`), shared by the phone list and the desktop legend card. */
export function LegendEntries({ lines, className, lineWidth = '' }: { lines?: boolean; className: string; lineWidth?: string }) {
  return (lines ? LEGEND_LINES : LEGEND_NODES).map(([cls, label]) => (
    <span key={label} className={className}>
      <i className={lines ? cls + ' ' + lineWidth : cls} />
      {label}
    </span>
  ));
}

const ITEMS = lineageRows();
/** Folded run containing each member id -> the run's key (its first member's id). */
const RUN_OF: Record<string, string> = Object.fromEntries(
  ITEMS.flatMap((it) => ('run' in it ? it.run.map((r) => [r.node.id, it.run[0].node.id]) : [])),
);

/*
 * Columns are 22px wide; column `d` has its centre at d × 22 + 11 px. Depths 0–3 occur in the data,
 * so offsets are literal classes indexed by depth (Tailwind can't see computed class names).
 */
const LEFT = ['left-[11px]', 'left-[33px]', 'left-[55px]', 'left-[77px]'] as const;
const PAD = ['pl-0', 'pl-[22px]', 'pl-[44px]', 'pl-[66px]'] as const;
const V_LINE: Record<LineageLink, string> = {
  q: 'border-l-[2.4px] border-gold',
  h: 'border-l-[1.5px] border-[color-mix(in_srgb,var(--gold)_55%,transparent)]',
  g: 'border-l-2 border-dotted border-gold',
};
const H_LINE: Record<LineageLink, string> = {
  q: 'border-t-[2.4px] border-gold',
  h: 'border-t-[1.5px] border-[color-mix(in_srgb,var(--gold)_55%,transparent)]',
  g: 'border-t-2 border-dotted border-gold',
};
const PIECE = 'pointer-events-none absolute';
const VERT = PIECE + ' -ml-px w-0';
const DOT = {
  n: 'block size-2 rounded-full border-[1.6px] border-muted bg-bg',
  p: 'block size-[13px] rounded-full bg-gold shadow-[0_0_0_3px_var(--bg)]',
  u: 'block size-[15px] rounded-full bg-gold shadow-[0_0_0_2px_var(--bg),0_0_0_3.5px_var(--gold),0_0_0_6px_color-mix(in_srgb,var(--gold)_30%,transparent)]',
} as const;
const BTN = 'relative z-1 flex size-full cursor-pointer items-center gap-2 rounded-lg text-left';
const SEL_BG = ' bg-[color-mix(in_srgb,var(--gold)_12%,transparent)]';

function column(depth: number): 0 | 1 | 2 | 3 {
  if (depth > 3 && import.meta.env.DEV) throw new Error(`LineageList: depth ${depth} has no column classes; extend LEFT/PAD`);
  return Math.min(depth, 3) as 0 | 1 | 2 | 3;
}

/** Connector pieces of one row: ancestor pass-throughs, then an elbow (branch start) or the line up, then the line down. */
function Lines({ row, up, down }: { row: LineageRow; up: LineageLink | null; down: LineageLink | null }) {
  const d = column(row.depth);
  return (
    <>
      {row.open.map((st, lvl) => st && <span key={lvl} aria-hidden="true" className={VERT + ' inset-y-0 ' + LEFT[column(lvl)] + ' ' + V_LINE[st]} />)}
      {row.side && row.node.link ? (
        <span aria-hidden="true" className={PIECE + ' top-1/2 h-0 w-[22px] ' + LEFT[column(d - 1)] + ' ' + H_LINE[row.node.link]} />
      ) : (
        up && <span aria-hidden="true" className={VERT + ' top-0 h-1/2 ' + LEFT[d] + ' ' + V_LINE[up]} />
      )}
      {down && <span aria-hidden="true" className={VERT + ' top-1/2 bottom-0 ' + LEFT[d] + ' ' + V_LINE[down]} />}
    </>
  );
}

function nameClass(prophet: boolean, on: boolean) {
  return (prophet ? 'font-bn-display text-[18px] ' : 'font-bn text-[14px] ') + (on ? 'text-gold' : prophet ? 'text-text' : 'text-text-2') + ' min-w-0 truncate';
}

function Row({ row, chain, selected, onSelect }: { row: LineageRow; chain: Set<string> | null; selected: string | null; onSelect: (id: string) => void }) {
  const n = row.node;
  const prophet = n.kind !== 'n';
  const on = !!chain?.has(n.id);
  return (
    <div
      data-row={n.id}
      className={'relative transition-opacity duration-250 ' + (prophet ? 'h-[46px]' : 'h-[34px]') + (chain && !on ? ' opacity-35' : '')}
    >
      <Lines row={row} up={n.parent && !row.alone ? (n.link ?? null) : null} down={row.down} />
      <button
        type="button"
        aria-pressed={selected === n.id}
        onClick={() => onSelect(n.id)}
        className={BTN + ' ' + PAD[column(row.depth)] + (selected === n.id ? SEL_BG : '')}
      >
        <span className="grid w-[22px] flex-none place-items-center">
          <span className={DOT[n.kind]} />
        </span>
        <span className={nameClass(prophet, on)}>{n.bn}</span>
        {n.book && <span className="flex-none font-bn text-[12.5px] text-gold">{n.book}</span>}
        {n.unknown && (
          <span lang="en" className="font-ui text-[13px] font-semibold text-muted">
            ?
          </span>
        )}
      </button>
    </div>
  );
}

/** A folded run: one "first … last" row with a generation count; tapping it expands the run in place. */
function Fold({ run, chain, onOpen }: { run: LineageRow[]; chain: Set<string> | null; onOpen: () => void }) {
  const a = run[0];
  const z = run[run.length - 1];
  const on = !!chain && run.some((r) => chain.has(r.node.id));
  const summary: LineageRow = { node: a.node, depth: a.depth, open: a.open, side: false, down: z.down };
  return (
    <div
      data-run=""
      data-members={run.map((r) => r.node.id).join(' ')}
      className={'relative h-[34px] transition-opacity duration-250' + (chain && !on ? ' opacity-35' : '')}
    >
      <Lines row={summary} up={a.node.link ?? null} down={z.down} />
      <button type="button" aria-expanded={false} onClick={onOpen} className={BTN + ' ' + PAD[column(a.depth)]}>
        <span className="grid w-[22px] flex-none place-items-center">
          <span className={DOT.n} />
        </span>
        <span className={nameClass(false, on)}>
          {a.node.bn} … {z.node.bn}
        </span>
        <span className="flex-none rounded-full border border-dashed border-line-strong px-2 py-px font-bn text-[12.5px] text-muted">
          {bnDigits(run.length)} প্রজন্ম
        </span>
        <span aria-hidden="true" className="flex-none text-[12px] text-muted">
          ▾
        </span>
      </button>
    </div>
  );
}

export interface LineageListHandle {
  /** Expand the fold holding `id` (if any) and scroll its row into view. */
  reveal: (id: string) => void;
}

/**
 * Phone view of the lineage (spec §10): an inline legend, then one row per person read top to bottom.
 * The line to মুহাম্মদ ﷺ runs down the left column; other children branch one column to the right.
 */
export function LineageList({
  chain,
  selected,
  onSelect,
  ref,
}: {
  chain: Set<string> | null;
  selected: string | null;
  onSelect: (id: string) => void;
  ref?: Ref<LineageListHandle>;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openRuns, setOpenRuns] = useState<ReadonlySet<string>>(() => new Set());
  const openRun = (key: string) => setOpenRuns((s) => (s.has(key) ? s : new Set(s).add(key)));

  useImperativeHandle(ref, () => ({
    reveal: (id: string) => {
      const key = RUN_OF[id];
      // commit the expanded run first so the row exists to scroll to
      if (key) flushSync(() => openRun(key));
      rootRef.current?.querySelector(`[data-row="${id}"]`)?.scrollIntoView({ block: 'center', behavior: scrollBehavior() });
    },
  }));

  return (
    <div id="lin-v" ref={rootRef}>
      <div className="mb-2 flex flex-wrap gap-x-3.5 gap-y-1.5 border-b border-line pt-1 pb-3 font-bn text-[12.5px] text-text-2">
        <LegendEntries className="inline-flex items-center gap-[7px]" />
        <LegendEntries lines lineWidth="w-5" className="inline-flex items-center gap-[7px]" />
      </div>
      <div className="pb-2">
        {ITEMS.map((it) => {
          if (!('run' in it)) return <Row key={it.node.id} row={it} chain={chain} selected={selected} onSelect={onSelect} />;
          const key = it.run[0].node.id;
          if (!openRuns.has(key)) return <Fold key={key} run={it.run} chain={chain} onOpen={() => openRun(key)} />;
          return it.run.map((r) => <Row key={r.node.id} row={r} chain={chain} selected={selected} onSelect={onSelect} />);
        })}
      </div>
    </div>
  );
}
