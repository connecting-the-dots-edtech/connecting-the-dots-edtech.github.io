/**
 * Literal Tailwind utility strings per era, keyed by era id.
 *
 * Era accent/tint colors are content data (fixed at build time in
 * timeline.ts), not ad-hoc runtime values, so instead of inline `style`
 * attributes we precompute every Tailwind arbitrary-value class the UI
 * needs. Because these are literal strings living in a scanned source
 * file, Tailwind's content scanner picks them up like any other class.
 * (Never derive one of these via string concatenation/replace at runtime —
 * Tailwind only sees literal tokens, not values computed in JS.)
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
    tintBg: 'bg-[#181C2E]',
    accentText: 'text-[#8FB4E6]',
    accentBg: 'bg-[#8FB4E6]',
    accentBorder: 'border-[#8FB4E6]',
    accentBorderTop3: 'border-t-[3px] border-t-[#8FB4E6]',
    accentBorderBottom3: 'border-b-[3px] border-b-[#8FB4E6]',
    accentBorderLeft3: 'border-l-[3px] border-l-[#8FB4E6]',
    stemDown: 'bg-linear-to-b from-[#8FB4E6] to-[rgba(201,162,90,0.15)]',
    stemUp: 'bg-linear-to-b from-[rgba(201,162,90,0.15)] to-[#8FB4E6]',
    minimapFlex: 'flex-[560]',
  },
  prophets: {
    tintBg: 'bg-[#1E1A32]',
    accentText: 'text-[#C1A6EC]',
    accentBg: 'bg-[#C1A6EC]',
    accentBorder: 'border-[#C1A6EC]',
    accentBorderTop3: 'border-t-[3px] border-t-[#C1A6EC]',
    accentBorderBottom3: 'border-b-[3px] border-b-[#C1A6EC]',
    accentBorderLeft3: 'border-l-[3px] border-l-[#C1A6EC]',
    stemDown: 'bg-linear-to-b from-[#C1A6EC] to-[rgba(201,162,90,0.15)]',
    stemUp: 'bg-linear-to-b from-[rgba(201,162,90,0.15)] to-[#C1A6EC]',
    minimapFlex: 'flex-[1220]',
  },
  jahiliyya: {
    tintBg: 'bg-[#241E14]',
    accentText: 'text-[#E6BE85]',
    accentBg: 'bg-[#E6BE85]',
    accentBorder: 'border-[#E6BE85]',
    accentBorderTop3: 'border-t-[3px] border-t-[#E6BE85]',
    accentBorderBottom3: 'border-b-[3px] border-b-[#E6BE85]',
    accentBorderLeft3: 'border-l-[3px] border-l-[#E6BE85]',
    stemDown: 'bg-linear-to-b from-[#E6BE85] to-[rgba(201,162,90,0.15)]',
    stemUp: 'bg-linear-to-b from-[rgba(201,162,90,0.15)] to-[#E6BE85]',
    minimapFlex: 'flex-[360]',
  },
  seerah: {
    tintBg: 'bg-[#16221D]',
    accentText: 'text-[#6FBEB4]',
    accentBg: 'bg-[#6FBEB4]',
    accentBorder: 'border-[#6FBEB4]',
    accentBorderTop3: 'border-t-[3px] border-t-[#6FBEB4]',
    accentBorderBottom3: 'border-b-[3px] border-b-[#6FBEB4]',
    accentBorderLeft3: 'border-l-[3px] border-l-[#6FBEB4]',
    stemDown: 'bg-linear-to-b from-[#6FBEB4] to-[rgba(201,162,90,0.15)]',
    stemUp: 'bg-linear-to-b from-[rgba(201,162,90,0.15)] to-[#6FBEB4]',
    minimapFlex: 'flex-[2040]',
  },
  rashidun: {
    tintBg: 'bg-[#221E12]',
    accentText: 'text-[#D6AE64]',
    accentBg: 'bg-[#D6AE64]',
    accentBorder: 'border-[#D6AE64]',
    accentBorderTop3: 'border-t-[3px] border-t-[#D6AE64]',
    accentBorderBottom3: 'border-b-[3px] border-b-[#D6AE64]',
    accentBorderLeft3: 'border-l-[3px] border-l-[#D6AE64]',
    stemDown: 'bg-linear-to-b from-[#D6AE64] to-[rgba(201,162,90,0.15)]',
    stemUp: 'bg-linear-to-b from-[rgba(201,162,90,0.15)] to-[#D6AE64]',
    minimapFlex: 'flex-[860]',
  },
  umayyad: {
    tintBg: 'bg-[#161C26]',
    accentText: 'text-[#9CBEDA]',
    accentBg: 'bg-[#9CBEDA]',
    accentBorder: 'border-[#9CBEDA]',
    accentBorderTop3: 'border-t-[3px] border-t-[#9CBEDA]',
    accentBorderBottom3: 'border-b-[3px] border-b-[#9CBEDA]',
    accentBorderLeft3: 'border-l-[3px] border-l-[#9CBEDA]',
    stemDown: 'bg-linear-to-b from-[#9CBEDA] to-[rgba(201,162,90,0.15)]',
    stemUp: 'bg-linear-to-b from-[rgba(201,162,90,0.15)] to-[#9CBEDA]',
    minimapFlex: 'flex-[560]',
  },
  abbasid: {
    tintBg: 'bg-[#241D10]',
    accentText: 'text-[#EDC985]',
    accentBg: 'bg-[#EDC985]',
    accentBorder: 'border-[#EDC985]',
    accentBorderTop3: 'border-t-[3px] border-t-[#EDC985]',
    accentBorderBottom3: 'border-b-[3px] border-b-[#EDC985]',
    accentBorderLeft3: 'border-l-[3px] border-l-[#EDC985]',
    stemDown: 'bg-linear-to-b from-[#EDC985] to-[rgba(201,162,90,0.15)]',
    stemUp: 'bg-linear-to-b from-[rgba(201,162,90,0.15)] to-[#EDC985]',
    minimapFlex: 'flex-[560]',
  },
  later: {
    tintBg: 'bg-[#141E22]',
    accentText: 'text-[#93D2C6]',
    accentBg: 'bg-[#93D2C6]',
    accentBorder: 'border-[#93D2C6]',
    accentBorderTop3: 'border-t-[3px] border-t-[#93D2C6]',
    accentBorderBottom3: 'border-b-[3px] border-b-[#93D2C6]',
    accentBorderLeft3: 'border-l-[3px] border-l-[#93D2C6]',
    stemDown: 'bg-linear-to-b from-[#93D2C6] to-[rgba(201,162,90,0.15)]',
    stemUp: 'bg-linear-to-b from-[rgba(201,162,90,0.15)] to-[#93D2C6]',
    minimapFlex: 'flex-[860]',
  },
};

/** era id -> [width @ zoom 0, 1, 2, 3] as literal `min-w-[Npx]` classes */
export const eraWidthClasses: Record<string, [string, string, string, string]> = {
  cosmos: ['min-w-[392px]', 'min-w-[560px]', 'min-w-[840px]', 'min-w-[1232px]'],
  prophets: ['min-w-[854px]', 'min-w-[1220px]', 'min-w-[1830px]', 'min-w-[2684px]'],
  jahiliyya: ['min-w-[252px]', 'min-w-[360px]', 'min-w-[540px]', 'min-w-[792px]'],
  seerah: ['min-w-[1428px]', 'min-w-[2040px]', 'min-w-[3060px]', 'min-w-[4488px]'],
  rashidun: ['min-w-[602px]', 'min-w-[860px]', 'min-w-[1290px]', 'min-w-[1892px]'],
  umayyad: ['min-w-[392px]', 'min-w-[560px]', 'min-w-[840px]', 'min-w-[1232px]'],
  abbasid: ['min-w-[392px]', 'min-w-[560px]', 'min-w-[840px]', 'min-w-[1232px]'],
  later: ['min-w-[602px]', 'min-w-[860px]', 'min-w-[1290px]', 'min-w-[1892px]'],
};
