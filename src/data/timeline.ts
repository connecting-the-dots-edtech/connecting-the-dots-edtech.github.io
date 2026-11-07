import type { CategoryKey, Era, EraId, LineageNode, TimelineEvent } from './types';
import { events } from '../content/events';

export { events };

export const eras: Era[] = [
  { id: 'cosmos', bn: 'সৃষ্টির সূচনা', en: 'Creation', short: 'সৃষ্টি', span: 'সময়ের পূর্বে', tint: '#181C2E', accent: '#8FB4E6', glyph: '✧' },
  { id: 'prophets', bn: 'নবীগণের যুগ', en: 'Age of Prophets', short: 'নবীগণ', span: 'আদম (আঃ) থেকে ঈসা (আঃ)', tint: '#1E1A32', accent: '#C1A6EC', glyph: '❖' },
  { id: 'jahiliyya', bn: 'জাহিলিয়া যুগ', en: 'Pre-Islamic Arabia', short: 'জাহিলিয়া', span: 'আনু. ৪০০–৫৭০ খ্রি.', tint: '#241E14', accent: '#E6BE85', glyph: '◈' },
  { id: 'seerah', bn: 'নবী মুহাম্মদ ﷺ', en: 'The Prophet', short: 'সীরাহ', span: '৫৭০–৬৩২ খ্রি.', tint: '#16221D', accent: '#6FBEB4', glyph: '✦' },
  { id: 'rashidun', bn: 'খুলাফায়ে রাশেদীন', en: 'Rashidun', short: 'রাশেদীন', span: '৬৩২–৬৬১ খ্রি.', tint: '#221E12', accent: '#D6AE64', glyph: '◆' },
  { id: 'umayyad', bn: 'উমাইয়া খিলাফত', en: 'Umayyad', short: 'উমাইয়া', span: '৬৬১–৭৫০ খ্রি.', tint: '#161C26', accent: '#9CBEDA', glyph: '◇' },
  { id: 'abbasid', bn: 'আব্বাসীয় খিলাফত', en: 'Abbasid Golden Age', short: 'আব্বাসীয়', span: '৭৫০–১২৫৮ খ্রি.', tint: '#241D10', accent: '#EDC985', glyph: '❈' },
  { id: 'later', bn: 'পরবর্তী সাম্রাজ্য', en: 'Later Empires', short: 'পরবর্তী', span: 'আন্দালুস · উসমানীয়', tint: '#141E22', accent: '#93D2C6', glyph: '✥' },
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

export const categories: CategoryKey[] = ['All', 'Creation', 'Prophets', 'Revelation', 'Caliphates'];

export function eventMatchesCategory(ev: TimelineEvent, category: CategoryKey): boolean {
  switch (category) {
    case 'Creation':
      return ev.era === 'cosmos';
    case 'Prophets':
      return ev.era === 'prophets';
    case 'Revelation':
      return ev.era === 'seerah';
    case 'Caliphates':
      return ['rashidun', 'umayyad', 'abbasid', 'later'].includes(ev.era);
    default:
      return true;
  }
}

export const eraById = Object.fromEntries(eras.map((e) => [e.id, e])) as Record<EraId, Era>;

export function eventsForEra(id: EraId): TimelineEvent[] {
  return events.filter((ev) => ev.era === id);
}

/** 1-based position of the era in the timeline */
export function eraNumber(id: EraId): number {
  return eras.findIndex((e) => e.id === id) + 1;
}
