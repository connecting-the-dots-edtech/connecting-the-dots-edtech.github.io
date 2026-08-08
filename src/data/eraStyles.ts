/**
 * Literal Tailwind utility strings per era, keyed by era id.
 *
 * The era colors themselves live in `--era-<id>-tint` / `--era-<id>-accent`
 * CSS custom properties (src/index.css), so a single value swap under
 * `:root[data-theme="light"]` re-themes every era across the whole site —
 * nothing here needs to know which theme is active.
 *
 * Why this can't be a generated loop: Tailwind's build-time scanner only
 * picks up class names that appear as complete, literal, contiguous text
 * in a source file — it does not execute JS. A factory like
 * `` `bg-[var(--era-${id}-tint)]` `` would never produce a literal string
 * Tailwind can see, so no CSS would be generated for it. Each entry below
 * has to be spelled out in full for exactly that reason (same rule as
 * never building a class via string concatenation at runtime).
 */
export interface EraStyle {
  tintBg: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  accentBorderTop3: string;
  accentBorderBottom3: string;
  accentBorderLeft3: string;
  stemDown: string;
  stemUp: string;
  minimapFlex: string;
}

export const eraStyles: Record<string, EraStyle> = {
  cosmos: {
    tintBg: 'bg-(--era-cosmos-tint)',
    accentText: 'text-(--era-cosmos-accent)',
    accentBg: 'bg-(--era-cosmos-accent)',
    accentBorder: 'border-(--era-cosmos-accent)',
    accentBorderTop3: 'border-t-[3px] border-t-(--era-cosmos-accent)',
    accentBorderBottom3: 'border-b-[3px] border-b-(--era-cosmos-accent)',
    accentBorderLeft3: 'border-l-[3px] border-l-(--era-cosmos-accent)',
    stemDown: 'bg-linear-to-b from-(--era-cosmos-accent) to-[rgba(201,162,90,0.15)]',
    stemUp: 'bg-linear-to-b from-[rgba(201,162,90,0.15)] to-(--era-cosmos-accent)',
    minimapFlex: 'flex-[1850]',
  },
  prophets: {
    tintBg: 'bg-(--era-prophets-tint)',
    accentText: 'text-(--era-prophets-accent)',
    accentBg: 'bg-(--era-prophets-accent)',
    accentBorder: 'border-(--era-prophets-accent)',
    accentBorderTop3: 'border-t-[3px] border-t-(--era-prophets-accent)',
    accentBorderBottom3: 'border-b-[3px] border-b-(--era-prophets-accent)',
    accentBorderLeft3: 'border-l-[3px] border-l-(--era-prophets-accent)',
    stemDown: 'bg-linear-to-b from-(--era-prophets-accent) to-[rgba(201,162,90,0.15)]',
    stemUp: 'bg-linear-to-b from-[rgba(201,162,90,0.15)] to-(--era-prophets-accent)',
    minimapFlex: 'flex-[1220]',
  },
  jahiliyya: {
    tintBg: 'bg-(--era-jahiliyya-tint)',
    accentText: 'text-(--era-jahiliyya-accent)',
    accentBg: 'bg-(--era-jahiliyya-accent)',
    accentBorder: 'border-(--era-jahiliyya-accent)',
    accentBorderTop3: 'border-t-[3px] border-t-(--era-jahiliyya-accent)',
    accentBorderBottom3: 'border-b-[3px] border-b-(--era-jahiliyya-accent)',
    accentBorderLeft3: 'border-l-[3px] border-l-(--era-jahiliyya-accent)',
    stemDown: 'bg-linear-to-b from-(--era-jahiliyya-accent) to-[rgba(201,162,90,0.15)]',
    stemUp: 'bg-linear-to-b from-[rgba(201,162,90,0.15)] to-(--era-jahiliyya-accent)',
    minimapFlex: 'flex-[360]',
  },
  seerah: {
    tintBg: 'bg-(--era-seerah-tint)',
    accentText: 'text-(--era-seerah-accent)',
    accentBg: 'bg-(--era-seerah-accent)',
    accentBorder: 'border-(--era-seerah-accent)',
    accentBorderTop3: 'border-t-[3px] border-t-(--era-seerah-accent)',
    accentBorderBottom3: 'border-b-[3px] border-b-(--era-seerah-accent)',
    accentBorderLeft3: 'border-l-[3px] border-l-(--era-seerah-accent)',
    stemDown: 'bg-linear-to-b from-(--era-seerah-accent) to-[rgba(201,162,90,0.15)]',
    stemUp: 'bg-linear-to-b from-[rgba(201,162,90,0.15)] to-(--era-seerah-accent)',
    minimapFlex: 'flex-[2040]',
  },
  rashidun: {
    tintBg: 'bg-(--era-rashidun-tint)',
    accentText: 'text-(--era-rashidun-accent)',
    accentBg: 'bg-(--era-rashidun-accent)',
    accentBorder: 'border-(--era-rashidun-accent)',
    accentBorderTop3: 'border-t-[3px] border-t-(--era-rashidun-accent)',
    accentBorderBottom3: 'border-b-[3px] border-b-(--era-rashidun-accent)',
    accentBorderLeft3: 'border-l-[3px] border-l-(--era-rashidun-accent)',
    stemDown: 'bg-linear-to-b from-(--era-rashidun-accent) to-[rgba(201,162,90,0.15)]',
    stemUp: 'bg-linear-to-b from-[rgba(201,162,90,0.15)] to-(--era-rashidun-accent)',
    minimapFlex: 'flex-[860]',
  },
  umayyad: {
    tintBg: 'bg-(--era-umayyad-tint)',
    accentText: 'text-(--era-umayyad-accent)',
    accentBg: 'bg-(--era-umayyad-accent)',
    accentBorder: 'border-(--era-umayyad-accent)',
    accentBorderTop3: 'border-t-[3px] border-t-(--era-umayyad-accent)',
    accentBorderBottom3: 'border-b-[3px] border-b-(--era-umayyad-accent)',
    accentBorderLeft3: 'border-l-[3px] border-l-(--era-umayyad-accent)',
    stemDown: 'bg-linear-to-b from-(--era-umayyad-accent) to-[rgba(201,162,90,0.15)]',
    stemUp: 'bg-linear-to-b from-[rgba(201,162,90,0.15)] to-(--era-umayyad-accent)',
    minimapFlex: 'flex-[560]',
  },
  abbasid: {
    tintBg: 'bg-(--era-abbasid-tint)',
    accentText: 'text-(--era-abbasid-accent)',
    accentBg: 'bg-(--era-abbasid-accent)',
    accentBorder: 'border-(--era-abbasid-accent)',
    accentBorderTop3: 'border-t-[3px] border-t-(--era-abbasid-accent)',
    accentBorderBottom3: 'border-b-[3px] border-b-(--era-abbasid-accent)',
    accentBorderLeft3: 'border-l-[3px] border-l-(--era-abbasid-accent)',
    stemDown: 'bg-linear-to-b from-(--era-abbasid-accent) to-[rgba(201,162,90,0.15)]',
    stemUp: 'bg-linear-to-b from-[rgba(201,162,90,0.15)] to-(--era-abbasid-accent)',
    minimapFlex: 'flex-[560]',
  },
  later: {
    tintBg: 'bg-(--era-later-tint)',
    accentText: 'text-(--era-later-accent)',
    accentBg: 'bg-(--era-later-accent)',
    accentBorder: 'border-(--era-later-accent)',
    accentBorderTop3: 'border-t-[3px] border-t-(--era-later-accent)',
    accentBorderBottom3: 'border-b-[3px] border-b-(--era-later-accent)',
    accentBorderLeft3: 'border-l-[3px] border-l-(--era-later-accent)',
    stemDown: 'bg-linear-to-b from-(--era-later-accent) to-[rgba(201,162,90,0.15)]',
    stemUp: 'bg-linear-to-b from-[rgba(201,162,90,0.15)] to-(--era-later-accent)',
    minimapFlex: 'flex-[860]',
  },
};

/**
 * era id -> [width @ zoom 0, 1, 2, 3] as literal `min-w-[Npx]` classes.
 *
 * Each era band uses `overflow-hidden`, so a band narrower than
 * `eventsInThatEra.length * 256px` (event cards are `w-64`) silently
 * clips cards off-screen instead of erroring — that's what happened when
 * cosmos grew from 1 dummy event to 6 real ones but kept its old width.
 * Whenever an event's `era` changes or a new event is added, re-check
 * that era's width here: at minimum, width - 44px (the row's padding)
 * must exceed eventCount * ~290px so cards have breathing room via
 * `justify-around`. Where the nominal `baseW * scale` would dip below
 * that floor at low zoom, the entry is clamped to the floor instead
 * (noted inline) rather than letting it shrink and clip.
 */
export const eraWidthClasses: Record<string, [string, string, string, string]> = {
  cosmos: ['min-w-[1850px]', 'min-w-[1850px]', 'min-w-[2775px]', 'min-w-[4070px]'], // 6 events; zoom 0 floored to zoom 1
  prophets: ['min-w-[1000px]', 'min-w-[1220px]', 'min-w-[1830px]', 'min-w-[2684px]'], // 3 events; zoom 0 floored up from 854px
  jahiliyya: ['min-w-[252px]', 'min-w-[360px]', 'min-w-[540px]', 'min-w-[792px]'],
  seerah: ['min-w-[1428px]', 'min-w-[2040px]', 'min-w-[3060px]', 'min-w-[4488px]'],
  rashidun: ['min-w-[602px]', 'min-w-[860px]', 'min-w-[1290px]', 'min-w-[1892px]'],
  umayyad: ['min-w-[392px]', 'min-w-[560px]', 'min-w-[840px]', 'min-w-[1232px]'],
  abbasid: ['min-w-[392px]', 'min-w-[560px]', 'min-w-[840px]', 'min-w-[1232px]'],
  later: ['min-w-[602px]', 'min-w-[860px]', 'min-w-[1290px]', 'min-w-[1892px]'],
};
