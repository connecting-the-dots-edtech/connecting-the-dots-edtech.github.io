import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { events } from '../data/timeline';
import { DEFAULT_SOURCE, LINEAGE_W, LINK_TEXT, lineage } from '../data/lineage';
import type { LineageNode } from '../data/types';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { usePanZoom } from '../hooks/usePanZoom';
import type { ViewBox } from '../hooks/usePanZoom';
import { ancestorChain, childrenOf, edgePath, labelPlacement, lineageById, lineageProphets, mainLine, nodeRadius } from '../lib/lineage';
import { useTimelineApp } from '../state/TimelineAppContext';
import { CloseIcon } from './ui/icons';

/** Fitted view: framed to the drawn content (labels included), so names stay readable at 1440×900. */
const FIT: ViewBox = { x: 10, y: 34, w: 2080, h: 1000 };
const PAD_X = 'pr-[max(16px,env(safe-area-inset-right,0px))] pl-[max(16px,env(safe-area-inset-left,0px))]';
const TOOL_BTN =
  'inline-grid size-9 flex-none cursor-pointer place-items-center rounded-full border border-line-strong text-text-2 hover:border-gold hover:text-gold';

const EDGE_CLASS = {
  q: 'fill-none stroke-gold [stroke-width:2.4] [stroke-linecap:round]',
  h: 'fill-none stroke-gold [stroke-width:1.4] [stroke-opacity:0.55] [stroke-linecap:round]',
  g: 'fill-none stroke-gold [stroke-width:1.9] [stroke-dasharray:1_6] [stroke-linecap:round]',
} as const;

function ZoomIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-4" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function TreeNode({ n, dim, selected, onActivate }: { n: LineageNode; dim: boolean; selected: boolean; onActivate: (id: string) => void }) {
  const r = nodeRadius(n);
  const big = n.kind === 'u';
  const person = n.kind === 'n';
  const lp = labelPlacement(n);
  return (
    <g
      data-node={n.id}
      data-lineage={mainLine.has(n.id) ? 'main' : 'branch'}
      transform={`translate(${n.x} ${n.y})`}
      tabIndex={0}
      role="button"
      aria-label={n.bn}
      aria-pressed={selected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate(n.id);
        }
      }}
      className={'group cursor-pointer outline-none transition-opacity duration-250 ' + (dim ? 'opacity-20' : '')}
    >
      {big && (
        <>
          <circle r={r + 7} className="fill-none stroke-[color-mix(in_srgb,var(--gold)_35%,transparent)] [stroke-width:3]" />
          <circle r={r + 4} className="fill-none stroke-gold [stroke-width:1.4]" />
        </>
      )}
      <circle
        r={r}
        className={
          (person ? 'fill-surface stroke-muted [stroke-width:1.6]' : 'fill-gold stroke-surface [stroke-width:3]') +
          ' group-focus-visible:stroke-gold-2 group-focus-visible:[stroke-width:4]' +
          (selected ? ' drop-shadow-[0_0_7px_var(--gold)]' : '')
        }
      />
      <text
        x={lp.x}
        y={lp.y}
        textAnchor={lp.anchor}
        className={
          (person ? 'fill-text-2 font-bn text-[17px]' : 'fill-text font-bn-display text-[22px]') +
          ' group-hover:fill-gold group-focus-visible:fill-gold'
        }
      >
        {n.bn}
      </text>
      {n.book && (
        <text x={lp.x} y={n.label === 't' ? lp.y - 21 : lp.y + 21} textAnchor={lp.anchor} className="fill-gold font-bn text-[15px]">
          {n.book}
        </text>
      )}
      {n.unknown && (
        <text x={r + 8} y={-r} className="fill-muted font-ui text-[13px] font-semibold">
          ?
        </text>
      )}
    </g>
  );
}

function LegendItems() {
  const dot = 'inline-block size-3 rounded-full bg-gold shadow-[0_0_0_2px_var(--bg),0_0_0_3.5px_var(--gold)]';
  return (
    <>
      <div className="grid gap-[5px]">
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <i className="inline-block size-[15px] rounded-full bg-gold shadow-[0_0_0_2px_var(--bg),0_0_0_3.5px_var(--gold),0_0_0_6px_color-mix(in_srgb,var(--gold)_35%,transparent)]" />
          উলুল আযম রাসূল
        </span>
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <i className={dot} />
          নবী
        </span>
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <i className="inline-block size-[9px] rounded-full border-[1.6px] border-muted bg-surface" />
          পূর্বপুরুষ
        </span>
      </div>
      <div className="grid gap-[5px]">
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <i className="inline-block h-0 w-[22px] border-t-[2.5px] border-gold" />
          কুরআন / সহীহ হাদিস
        </span>
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <i className="inline-block h-0 w-[22px] border-t-[1.5px] border-gold opacity-60" />
          ইতিহাসবিদদের বর্ণনা
        </span>
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <i className="inline-block h-0 w-[22px] border-t-2 border-dotted border-gold" />
          মাঝে প্রজন্ম / মতভেদ
        </span>
      </div>
    </>
  );
}

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

function InfoPanel({ n, onSelect, onClose }: { n: LineageNode; onSelect: (id: string) => void; onClose: () => void }) {
  const { openQuickLook } = useTimelineApp();
  const parent = n.parent ? lineageById[n.parent] : undefined;
  const kids = childrenOf(n.id);
  const tags = [n.kind === 'u' ? 'উলুল আযম রাসূল' : '', n.kind !== 'n' ? 'নবী' : '', n.book ? `কিতাব: ${n.book}` : ''].filter(Boolean);
  const evs = (n.events ?? []).map((id) => events.find((e) => e.id === id)).filter((e) => e !== undefined);
  const link =
    'cursor-pointer font-bn text-[15px] text-gold underline decoration-[color-mix(in_srgb,var(--gold)_45%,transparent)] underline-offset-[3px]';
  return (
    <aside
      id="lin-info"
      aria-label={n.bn}
      className="absolute top-3.5 right-3.5 z-3 max-h-[calc(100%-28px)] w-[min(340px,calc(100%-28px))] cursor-auto overflow-auto rounded-[14px] border border-line-strong bg-surface px-[18px] pt-4 pb-3.5 shadow-(--shadow) select-text phone:top-auto phone:right-2.5 phone:bottom-2.5 phone:left-2.5 phone:max-h-[56%] phone:w-auto"
    >
      <div className="mb-1 flex min-h-[34px] items-center justify-between gap-2.5">
        <button type="button" aria-label="Close" onClick={onClose} className="grid size-8 flex-none cursor-pointer place-items-center rounded-lg text-text-2 hover:bg-raised">
          <CloseIcon className="size-4" />
        </button>
        {n.ar && (
          <div lang="ar" dir="rtl" className="font-ar text-[26px] leading-normal text-gold">
            {n.ar}
          </div>
        )}
      </div>
      <div className="font-bn-display text-[25px] leading-[1.3] text-text">{n.bn}</div>
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
          <button type="button" className={link} onClick={() => onSelect(parent.id)}>
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
              <button key={c.id} type="button" className={link} onClick={() => onSelect(c.id)}>
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
    </aside>
  );
}

export function LineageTree() {
  const { quickLookEvent } = useTimelineApp();
  const phone = useMediaQuery('(max-width: 760px)');
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [keyOpen, setKeyOpen] = useState(false);
  const chain = useMemo(() => (selected ? ancestorChain(selected) : null), [selected]);

  const { animateTo, zoomBy, centerOn } = usePanZoom(stageRef, svgRef, {
    maxW: LINEAGE_W + 300,
    ignore: '#lin-info, #lin-key, #lin-key-btn',
    // phones start on আদম, 560 units wide, filling the tall stage; desktop shows the whole tree
    initial: (st) =>
      window.matchMedia('(max-width: 760px)').matches ? { x: 10, y: 10, w: 560, h: (560 * st.clientHeight) / st.clientWidth } : FIT,
    onTap: (target) => {
      const id = target.closest<SVGGElement>('[data-node]')?.dataset.node;
      setSelected(id ?? null);
    },
  });

  /** Select and bring into view (chips, Parent/Children links, keyboard). */
  const focusNode = useCallback(
    (id: string) => {
      const n = lineageById[id];
      if (!n) return;
      setSelected(id);
      centerOn(n.x, n.y, 1000);
    },
    [centerOn],
  );

  useEffect(() => {
    if (!selected || quickLookEvent) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, quickLookEvent]);

  const node = selected ? lineageById[selected] : undefined;

  return (
    <>
      <h1 className="sr-only">নবীগণের বংশধারা</h1>
      <div className={PAD_X}>
        <div className="mx-auto flex max-w-280 items-center gap-4 pt-3.5 pb-3">
          <div aria-label="Prophets" className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto py-0.5 [scrollbar-width:thin]">
            {lineageProphets.map((p) => (
              <button
                key={p.id}
                type="button"
                data-lin={p.id}
                aria-pressed={selected === p.id}
                onClick={() => focusNode(p.id)}
                className="h-8 flex-none cursor-pointer rounded-full border border-line-strong bg-surface px-3 font-bn text-sm whitespace-nowrap text-text-2 hover:border-gold hover:text-text aria-pressed:border-gold-fill aria-pressed:bg-gold-fill aria-pressed:text-on-gold"
              >
                {p.bn}
              </button>
            ))}
          </div>
          <div lang="en" className="ml-auto flex flex-none gap-1.5">
            <button type="button" aria-label="Zoom out" className={TOOL_BTN} onClick={() => zoomBy(1.4)}>
              <ZoomIcon d="M5 12h14" />
            </button>
            <button type="button" aria-label="Zoom in" className={TOOL_BTN} onClick={() => zoomBy(0.7)}>
              <ZoomIcon d="M12 5v14M5 12h14" />
            </button>
            <button type="button" aria-label="Show the whole tree" className={TOOL_BTN} onClick={() => animateTo(FIT)}>
              <ZoomIcon d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        id="lineage-tree"
        ref={stageRef}
        className="relative h-[min(76vh,880px)] min-h-[480px] cursor-grab touch-none overflow-hidden border-y border-line bg-linear-to-b from-[color-mix(in_srgb,var(--raised)_55%,var(--surface))] to-surface select-none data-[dragging=true]:cursor-grabbing phone:h-[70vh]"
      >
        <svg
          id="lin-svg"
          ref={svgRef}
          viewBox={`${FIT.x} ${FIT.y} ${FIT.w} ${FIT.h}`}
          preserveAspectRatio="xMidYMid meet"
          aria-label="নবীগণের বংশধারা"
          className="block size-full"
        >
          {lineage
            .filter((n) => n.parent && n.link)
            .map((n) => (
              <path
                key={n.id}
                data-edge={n.id}
                d={edgePath(lineageById[n.parent!], n)}
                className={EDGE_CLASS[n.link!] + ' transition-opacity duration-250' + (chain && !chain.has(n.id) ? ' opacity-20' : '')}
              />
            ))}
          {lineage.map((n) => (
            <TreeNode key={n.id} n={n} dim={!!chain && !chain.has(n.id)} selected={selected === n.id} onActivate={focusNode} />
          ))}
        </svg>

        {phone && !node && (
          <button
            id="lin-key-btn"
            type="button"
            lang="en"
            aria-expanded={keyOpen}
            onClick={() => setKeyOpen((o) => !o)}
            className="absolute top-2 right-2 z-2 inline-flex h-8 cursor-pointer items-center rounded-full border border-line-strong bg-surface px-3 font-ui text-[13px] font-semibold text-text-2 aria-expanded:border-gold aria-expanded:text-gold"
          >
            Legend
          </button>
        )}
        {!node && (!phone || keyOpen) && (
          <div
            id="lin-key"
            aria-label="Legend"
            className="absolute top-3 right-3 z-2 grid cursor-auto grid-cols-[auto_auto] gap-4 rounded-xl border border-line bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-3.5 py-2.5 font-bn text-[12.5px] text-text-2 backdrop-blur-[6px] phone:top-12 phone:right-2 phone:grid-cols-[auto] phone:gap-[5px] phone:px-3 phone:py-2"
          >
            <LegendItems />
          </div>
        )}
        {node && <InfoPanel n={node} onSelect={focusNode} onClose={() => setSelected(null)} />}
      </div>

      <div className={PAD_X}>
        <div className="mx-auto flex max-w-280 flex-wrap gap-x-2.5 gap-y-1 pt-3 pb-7 text-[13px] text-muted">
          <b lang="en" className="font-ui font-semibold text-text-2">
            Sources:
          </b>
          <span className="font-bn">
            আল-কুরআন · সহীহ বুখারী · ইবনে কাসীর (কাসাসুল আম্বিয়া, তাফসীর, আল-বিদায়া ওয়ান নিহায়া) · ইবনে ইসহাক (ইবনে হিশামের বর্ণনায়) · ইবনুল জাওযী (আল-মুনতাযাম) ·
            আল-হাকিম (আল-মুসতাদরাক)
          </span>
        </div>
      </div>
    </>
  );
}
