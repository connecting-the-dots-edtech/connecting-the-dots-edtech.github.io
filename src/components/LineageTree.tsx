import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode, Ref } from 'react';
import { LINEAGE_W, lineage } from '../data/lineage';
import type { LineageNode } from '../data/types';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { usePanZoom } from '../hooks/usePanZoom';
import type { ViewBox } from '../hooks/usePanZoom';
import { ancestorChain, edgePath, labelPlacement, lineageById, lineageProphets, mainLine, nodeRadius } from '../lib/lineage';
import { useTimelineApp } from '../state/TimelineAppContext';
import { LineageInfo } from './LineageInfo';
import { LegendEntries, LineageList } from './LineageList';
import type { LineageListHandle } from './LineageList';

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

/** The whole tree: edges behind nodes. The viewBox is driven by `usePanZoom` on desktop. */
function TreeSvg({
  svgRef,
  chain,
  selected,
  onActivate,
}: {
  svgRef?: Ref<SVGSVGElement>;
  chain: Set<string> | null;
  selected: string | null;
  onActivate: (id: string) => void;
}) {
  return (
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
        <TreeNode key={n.id} n={n} dim={!!chain && !chain.has(n.id)} selected={selected === n.id} onActivate={onActivate} />
      ))}
    </svg>
  );
}

function Chips({ selected, onPick }: { selected: string | null; onPick: (id: string) => void }) {
  return (
    <div className={PAD_X}>
      <div className="mx-auto flex max-w-280 items-center gap-4 pt-3.5 pb-3">
        <div aria-label="Prophets" className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto py-0.5 [scrollbar-width:thin]">
          {lineageProphets.map((p) => (
            <button
              key={p.id}
              type="button"
              data-lin={p.id}
              aria-pressed={selected === p.id}
              onClick={() => onPick(p.id)}
              className="h-8 flex-none cursor-pointer rounded-full border border-line-strong bg-surface px-3 font-bn text-sm whitespace-nowrap text-text-2 hover:border-gold hover:text-text aria-pressed:border-gold-fill aria-pressed:bg-gold-fill aria-pressed:text-on-gold"
            >
              {p.bn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** The bar under the tree: `Sources:` on the left, taking the free width; `tools` (desktop zoom buttons) on the right. */
function BottomBar({ tools }: { tools?: ReactNode }) {
  return (
    <div className={PAD_X}>
      <div className="mx-auto flex max-w-280 items-start gap-4 pt-3 pb-7">
        <div className="flex min-w-0 flex-1 flex-wrap gap-x-2.5 gap-y-1 text-[13px] text-muted">
          <b lang="en" className="font-ui font-semibold text-text-2">
            Sources:
          </b>
          <span className="font-bn">
            আল-কুরআন · সহীহ বুখারী · ইবনে কাসীর (কাসাসুল আম্বিয়া, তাফসীর, আল-বিদায়া ওয়ান নিহায়া) · ইবনে ইসহাক (ইবনে হিশামের বর্ণনায়) · ইবনুল জাওযী (আল-মুনতাযাম) ·
            আল-হাকিম (আল-মুসতাদরাক)
          </span>
        </div>
        {tools}
      </div>
    </div>
  );
}

interface ViewProps {
  selected: string | null;
  chain: Set<string> | null;
  setSelected: (id: string | null) => void;
}

/** Desktop and tablet: the pan/zoom canvas, legend card, details panel and zoom buttons under the stage. */
function DesktopLineage({ selected, chain, setSelected }: ViewProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { animateTo, zoomBy, centerOn } = usePanZoom(stageRef, svgRef, {
    maxW: LINEAGE_W + 300,
    ignore: '#lin-info, #lin-key',
    initial: () => FIT,
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
    [centerOn, setSelected],
  );

  const node = selected ? lineageById[selected] : undefined;

  return (
    <>
      <Chips selected={selected} onPick={focusNode} />

      <div
        id="lineage-tree"
        ref={stageRef}
        className="relative h-[min(76vh,880px)] min-h-[480px] cursor-grab touch-none overflow-hidden border-y border-line bg-linear-to-b from-[color-mix(in_srgb,var(--raised)_55%,var(--surface))] to-surface select-none data-[dragging=true]:cursor-grabbing"
      >
        <TreeSvg svgRef={svgRef} chain={chain} selected={selected} onActivate={focusNode} />

        {!node && (
          <div
            id="lin-key"
            aria-label="Legend"
            className="absolute top-3 right-3 z-2 grid cursor-auto grid-cols-[auto_auto] gap-4 rounded-xl border border-line bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-3.5 py-2.5 font-bn text-[12.5px] text-text-2 backdrop-blur-[6px]"
          >
            <div className="grid gap-[5px]">
              <LegendEntries className="inline-flex items-center gap-2 whitespace-nowrap" />
            </div>
            <div className="grid gap-[5px]">
              <LegendEntries lines lineWidth="w-[22px]" className="inline-flex items-center gap-2 whitespace-nowrap" />
            </div>
          </div>
        )}
        {node && (
          <aside
            id="lin-info"
            aria-label={node.bn}
            className="absolute top-3.5 right-3.5 z-3 max-h-[calc(100%-28px)] w-[min(340px,calc(100%-28px))] cursor-auto overflow-auto rounded-[14px] border border-line-strong bg-surface px-[18px] pt-4 pb-3.5 shadow-(--shadow) select-text"
          >
            <LineageInfo n={node} onSelect={focusNode} onClose={() => setSelected(null)} />
          </aside>
        )}
      </div>

      <BottomBar
        tools={
          <div lang="en" className="flex flex-none gap-1.5">
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
        }
      />
    </>
  );
}

/**
 * Phones (≤ 760px, spec §10): a vertical list instead of the canvas, and the details in a fixed bottom
 * sheet above the tab bar. `#lineage-tree` stays in the DOM, hidden, with the static tree for test hooks;
 * pan/zoom is never attached to it.
 */
function PhoneLineage({ selected, chain, setSelected }: ViewProps) {
  const listRef = useRef<LineageListHandle>(null);
  /** Select, expand its fold and scroll its row into view (chips, Parent/Children links). */
  const focusNode = useCallback(
    (id: string) => {
      if (!lineageById[id]) return;
      setSelected(id);
      listRef.current?.reveal(id);
    },
    [setSelected],
  );
  const node = selected ? lineageById[selected] : undefined;

  return (
    <>
      <Chips selected={selected} onPick={focusNode} />
      <div id="lineage-tree" hidden>
        <TreeSvg chain={chain} selected={selected} onActivate={focusNode} />
      </div>
      <div className={PAD_X}>
        <div className="mx-auto max-w-280">
          <LineageList ref={listRef} chain={chain} selected={selected} onSelect={setSelected} />
        </div>
      </div>
      {node && (
        <aside
          id="lin-sheet"
          aria-label={node.bn}
          className="fixed right-2 bottom-[calc(76px+env(safe-area-inset-bottom,0px))] left-2 z-46 max-h-[60vh] overflow-auto rounded-[14px] border border-line-strong bg-surface px-4 pt-3.5 pb-3 shadow-(--shadow)"
        >
          <LineageInfo n={node} onSelect={focusNode} onClose={() => setSelected(null)} />
        </aside>
      )}
      <BottomBar />
    </>
  );
}

export function LineageTree() {
  const { quickLookEvent, searchOpen } = useTimelineApp();
  const phone = useMediaQuery('(max-width: 760px)');
  const [selected, setSelected] = useState<string | null>(null);
  const chain = useMemo(() => (selected ? ancestorChain(selected) : null), [selected]);

  // Escape clears the selection, but not while the reader or search is open (each owns Escape while open)
  useEffect(() => {
    if (!selected || quickLookEvent || searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, quickLookEvent, searchOpen]);

  const View = phone ? PhoneLineage : DesktopLineage;
  return (
    <>
      <h1 className="sr-only">নবীগণের বংশধারা</h1>
      <View selected={selected} chain={chain} setSelected={setSelected} />
    </>
  );
}
