import type { CategoryKey, Era, LineageNode, TimelineEvent } from './types';
import { events } from '../content/events';

export { events };

export const eras: Era[] = [
  { id: 'cosmos', bn: 'সৃষ্টির সূচনা', en: 'Creation', short: 'Creation', span: 'Before Time', tint: '#181C2E', accent: '#8FB4E6', glyph: '✧', baseW: 560 },
  { id: 'prophets', bn: 'নবীগণের যুগ', en: 'Age of Prophets', short: 'Prophets', span: 'Adam → Isa (AS)', tint: '#1E1A32', accent: '#C1A6EC', glyph: '❖', baseW: 1220 },
  { id: 'jahiliyya', bn: 'জাহিলিয়া যুগ', en: 'Pre-Islamic Arabia', short: 'Jahiliyya', span: '~400–570 CE', tint: '#241E14', accent: '#E6BE85', glyph: '◈', baseW: 360 },
  { id: 'seerah', bn: 'নবী মুহাম্মদ ﷺ', en: 'The Prophet', short: 'Seerah', span: '570–632 CE', tint: '#16221D', accent: '#6FBEB4', glyph: '✦', baseW: 2040 },
  { id: 'rashidun', bn: 'খুলাফায়ে রাশেদীন', en: 'Rashidun', short: 'Rashidun', span: '632–661 CE', tint: '#221E12', accent: '#D6AE64', glyph: '◆', baseW: 860 },
  { id: 'umayyad', bn: 'উমাইয়া খিলাফত', en: 'Umayyad', short: 'Umayyad', span: '661–750 CE', tint: '#161C26', accent: '#9CBEDA', glyph: '◇', baseW: 560 },
  { id: 'abbasid', bn: 'আব্বাসীয় খিলাফত', en: 'Abbasid Golden Age', short: 'Abbasid', span: '750–1258 CE', tint: '#241D10', accent: '#EDC985', glyph: '❈', baseW: 560 },
  { id: 'later', bn: 'পরবর্তী সাম্রাজ্য', en: 'Later Empires', short: 'Later', span: 'Andalus · Ottoman', tint: '#141E22', accent: '#93D2C6', glyph: '✥', baseW: 860 },
];

export const lineage: LineageNode[] = [
  { bn: 'আদম (আঃ)', en: 'Adam', sizeClass: 'text-2xl', dotClass: 'bg-gold', borderClass: 'border-[rgba(201,162,90,0.5)]', connector: true },
  { bn: 'শীষ (আঃ)', en: 'Shith', sizeClass: 'text-xl', dotClass: 'bg-gold', borderClass: 'border-[rgba(201,162,90,0.3)]', connector: true },
  { bn: 'নূহ (আঃ)', en: 'Nuh', sizeClass: 'text-xl', dotClass: 'bg-gold', borderClass: 'border-[rgba(201,162,90,0.3)]', connector: true },
  {
    bn: 'ইব্রাহিম (আঃ)', en: 'Ibrahim', sizeClass: 'text-[22px]', dotClass: 'bg-gold-light', borderClass: 'border-[rgba(228,192,120,0.5)]', hasBranch: true,
    branches: [
      { bn: 'ইসমাইল (আঃ)', en: 'Ismail', note: 'Arab line → Muhammad ﷺ' },
      { bn: 'ইসহাক (আঃ)', en: 'Ishaq', note: 'Israelite line' },
    ],
  },
  { bn: 'আদনান', en: 'Adnan', sizeClass: 'text-lg', dotClass: 'bg-teal', borderClass: 'border-[rgba(95,168,160,0.4)]', connector: true },
  { bn: 'আব্দুল্লাহ', en: 'Abdullah', sizeClass: 'text-lg', dotClass: 'bg-teal', borderClass: 'border-[rgba(95,168,160,0.4)]', connector: true },
  { bn: 'মুহাম্মদ ﷺ', en: 'The Prophet', sizeClass: 'text-[26px]', dotClass: 'bg-gold', borderClass: 'border-[rgba(201,162,90,0.7)]', connector: false },
];

export const categories: CategoryKey[] = ['All', 'Prophets', 'Revelation', 'Battles', 'Caliphates', 'Science'];

export function eventMatchesCategory(ev: TimelineEvent, category: CategoryKey): boolean {
  if (category === 'All') return true;
  if (category === 'Prophets') return ev.era === 'prophets' || ev.era === 'cosmos';
  if (category === 'Revelation') return ev.era === 'seerah';
  if (category === 'Battles') return /যুদ্ধ|বিজয়|Badr|Conquest/i.test(ev.title + ev.titleEn);
  if (category === 'Caliphates') return ['rashidun', 'umayyad', 'abbasid', 'later'].includes(ev.era);
  if (category === 'Science') return false;
  return true;
}

export const eraById: Record<string, Era> = Object.fromEntries(eras.map((e) => [e.id, e]));

/** The event featured by default in the Event Detail section before a visitor picks one. */
export const defaultEventId = 1;
