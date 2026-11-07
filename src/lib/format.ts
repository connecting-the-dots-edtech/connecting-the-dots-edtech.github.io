/** Pure formatting helpers for Bangla content. No runtime imports. */

const BN = '০১২৩৪৫৬৭৮৯';

/** Latin digits -> Bengali digits: `bnDigits(570)` -> `'৫৭০'`. */
export function bnDigits(n: number | string): string {
  return String(n).replace(/\d/g, (d) => BN[Number(d)]);
}

/** Zero-padded two-digit Bengali number: `pad2(7)` -> `'০৭'`. */
export function pad2(n: number): string {
  return bnDigits(String(n).padStart(2, '0'));
}

/** Estimated reading time in minutes (min 1) at ~160 words per minute. */
export function readMinutes(body: string): number {
  return Math.max(1, Math.round(body.split(/\s+/).length / 160));
}

/** Whitespace-collapsed preview of `body`, cut at a word boundary with an ellipsis. */
export function excerpt(body: string, n = 115): string {
  const t = body.replace(/\s+/g, ' ');
  if (t.length <= n) return t;
  const cut = t.lastIndexOf(' ', n);
  return t.slice(0, cut > 60 ? cut : n) + '…';
}

/** Split `'Book, ১ম খণ্ড'` into book and volume; volume is omitted when absent. */
export function splitSource(source: string): { book: string; volume?: string } {
  const parts = source.split(/[,\-–]\s*(?=\S*\s*খণ্ড)/);
  if (parts.length < 2) return { book: source };
  const volume = parts[parts.length - 1].trim();
  const book = parts.slice(0, -1).join(', ').trim();
  return { book, volume };
}
