import { lineage } from '../data/lineage';
import type { LineageLink, LineageNode } from '../data/types';

export const lineageById: Record<string, LineageNode> = Object.fromEntries(lineage.map((n) => [n.id, n]));

/** The 26 prophets, in tree order (used for the chips row). */
export const lineageProphets: LineageNode[] = lineage.filter((n) => n.kind !== 'n');

/** A node and all its ancestors up to the root (আদম). */
export function ancestorChain(id: string): Set<string> {
  const out = new Set<string>();
  let n: LineageNode | undefined = lineageById[id];
  while (n) {
    out.add(n.id);
    n = n.parent ? lineageById[n.parent] : undefined;
  }
  return out;
}

/** Nodes on the আদম → মুহাম্মদ ﷺ chain (test hook `data-lineage="main"`). */
export const mainLine: Set<string> = ancestorChain('muhammad');

export function childrenOf(id: string): LineageNode[] {
  return lineage.filter((c) => c.parent === id);
}

/** Straight when aligned; otherwise down to mid-height, across, and down (parent centre → child centre). */
export function edgePath(a: LineageNode, b: LineageNode): string {
  if (Math.abs(a.y - b.y) < 2) return `M${a.x},${a.y} H${b.x}`;
  if (Math.abs(a.x - b.x) < 2) return `M${a.x},${a.y} V${b.y}`;
  const my = a.y + (b.y - a.y) / 2;
  return `M${a.x},${a.y} V${my} H${b.x} V${b.y}`;
}

export function nodeRadius(n: LineageNode): number {
  return n.kind === 'u' ? 18 : n.kind === 'p' ? 14 : 6;
}

/** Name label position relative to the dot centre (prototype `linNode`). */
export function labelPlacement(n: LineageNode): { x: number; y: number; anchor: 'start' | 'middle' | 'end' } {
  const r = nodeRadius(n);
  switch (n.label ?? 'b') {
    case 't':
      return { x: 0, y: -r - 10, anchor: 'middle' };
    case 'l':
      return { x: -r - 9, y: 7, anchor: 'end' };
    case 'r':
      return { x: r + 9, y: 7, anchor: 'start' };
    default:
      return { x: 0, y: r + (n.kind === 'n' ? 19 : 25), anchor: 'middle' };
  }
}

/* ---- Phone: the same tree as a vertical list (prototype linCont / linRows) ---- */

/** One row of the phone list. `open[i]` is the link style of an ancestor column `i` that passes through this row. */
export type LineageRow = { node: LineageNode; depth: number; open: (LineageLink | null)[]; side: boolean; down: LineageLink | null; alone?: boolean };
/** A row, or a folded run of 4+ plain ancestors shown as one "first … last" row. */
export type LineageListItem = LineageRow | { run: LineageRow[] };

const subtreeSize = (id: string): number => 1 + childrenOf(id).reduce((t, c) => t + subtreeSize(c.id), 0);

/** The child that continues the line in the same column: the one on the main line, else the largest subtree (ties to the later child). */
export function continuationOf(id: string): LineageNode | null {
  const kids = childrenOf(id);
  if (!kids.length) return null;
  const main = kids.find((k) => mainLine.has(k.id));
  if (main) return main;
  let best = kids[0];
  for (const k of kids) if (subtreeSize(k.id) >= subtreeSize(best.id)) best = k;
  return best;
}

/**
 * Depth-first rows: each node, then its side children one column to the right (data order), then its
 * continuation in the same column. Standalone roots (no parent) come last with `alone`. Straight runs of
 * 4+ persons without branches or articles fold into one `{ run }` item.
 */
export function lineageRows(): LineageListItem[] {
  const rows: LineageRow[] = [];
  const emit = (id: string, depth: number, open: (LineageLink | null)[], side: boolean) => {
    const node = lineageById[id];
    const cont = continuationOf(id);
    const down = cont?.link ?? null;
    rows.push({ node, depth, open: open.slice(0, depth), side, down });
    for (const s of childrenOf(id)) if (s !== cont) emit(s.id, depth + 1, [...open.slice(0, depth), down], true);
    if (cont) emit(cont.id, depth, open, false);
  };
  emit('adam', 0, [], false);
  for (const n of lineage) if (!n.parent && n.id !== 'adam') rows.push({ node: n, depth: 0, open: [], side: false, down: null, alone: true });

  const foldable = (r: LineageRow | undefined): r is LineageRow =>
    !!r && r.node.kind === 'n' && !r.side && !r.alone && !(r.node.events ?? []).length && childrenOf(r.node.id).length <= 1;
  /** `b` is `a`'s continuation in the same column. */
  const continues = (a: LineageRow, b: LineageRow | undefined) =>
    foldable(b) && b.depth === a.depth && b.node.parent === a.node.id && a.down === b.node.link;
  const out: LineageListItem[] = [];
  for (let i = 0; i < rows.length; i++) {
    let j = i;
    while (foldable(rows[j]) && continues(rows[j], rows[j + 1])) j++;
    if (foldable(rows[i]) && j - i + 1 >= 4) {
      out.push({ run: rows.slice(i, j + 1) });
      i = j;
    } else out.push(rows[i]);
  }
  return out;
}
