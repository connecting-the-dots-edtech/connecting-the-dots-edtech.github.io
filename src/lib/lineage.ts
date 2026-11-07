import { lineage } from '../data/lineage';
import type { LineageNode } from '../data/types';

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
