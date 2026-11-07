import type { CategoryKey, Era, EraId, TimelineEvent } from './types';
import { events } from '../content/events';

export { events };

export const eras: Era[] = [
  { id: 'cosmos', bn: 'সৃষ্টির সূচনা', en: 'Creation', short: 'সৃষ্টি', span: 'সময়ের পূর্বে' },
  { id: 'prophets', bn: 'নবীগণের যুগ', en: 'Age of Prophets', short: 'নবীগণ', span: 'আদম (আঃ) থেকে ঈসা (আঃ)' },
  { id: 'jahiliyya', bn: 'জাহিলিয়া যুগ', en: 'Pre-Islamic Arabia', short: 'জাহিলিয়া', span: 'আনু. ৪০০–৫৭০ খ্রি.' },
  { id: 'seerah', bn: 'নবী মুহাম্মদ ﷺ', en: 'The Prophet', short: 'সীরাহ', span: '৫৭০–৬৩২ খ্রি.' },
  { id: 'rashidun', bn: 'খুলাফায়ে রাশেদীন', en: 'Rashidun', short: 'রাশেদীন', span: '৬৩২–৬৬১ খ্রি.' },
  { id: 'umayyad', bn: 'উমাইয়া খিলাফত', en: 'Umayyad', short: 'উমাইয়া', span: '৬৬১–৭৫০ খ্রি.' },
  { id: 'abbasid', bn: 'আব্বাসীয় খিলাফত', en: 'Abbasid Golden Age', short: 'আব্বাসীয়', span: '৭৫০–১২৫৮ খ্রি.' },
  { id: 'later', bn: 'পরবর্তী সাম্রাজ্য', en: 'Later Empires', short: 'পরবর্তী', span: 'আন্দালুস · উসমানীয়' },
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
