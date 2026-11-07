export type EraId = 'cosmos' | 'prophets' | 'jahiliyya' | 'seerah' | 'rashidun' | 'umayyad' | 'abbasid' | 'later';

export interface Era {
  id: EraId;
  bn: string;
  en: string;
  short: string;
  span: string;
}

export interface TimelineEvent {
  id: number;
  era: EraId;
  year: string;
  title: string;
  titleEn: string;
  /** whether the card renders above the axis (alternating layout) */
  up: boolean;
  thumb: string;
  body: string;
  /** Qur'anic verse directly tied to this event, where one genuinely applies */
  arabic?: string;
  /** the specific source cited for this event's content, e.g. a book + volume */
  source?: string;
}

export type CategoryKey = 'All' | 'Creation' | 'Prophets' | 'Revelation' | 'Caliphates';

export type ViewMode = 'timeline' | 'list';

/** Lineage tree (src/data/lineage.ts). kind: u = ulul azm rasul, p = prophet, n = person (not a prophet). */
export type LineageKind = 'u' | 'p' | 'n';
/** How a link to the parent is known: q = Qur'an / sahih hadith, h = historians' accounts, g = generations skipped or disputed. */
export type LineageLink = 'q' | 'h' | 'g';

export interface LineageNode {
  id: string;
  /** Bangla name as shown on the tree */
  bn: string;
  /** Arabic name, shown only in the details panel */
  ar?: string;
  kind: LineageKind;
  /** position on the LINEAGE_W × LINEAGE_H canvas */
  x: number;
  y: number;
  /** label side relative to the dot; default 'b' (below) */
  label?: 'b' | 't' | 'l' | 'r';
  parent?: string;
  link?: LineageLink;
  /** scripture revealed to this prophet (Bangla) */
  book?: string;
  /** who the prophet was sent to, with the Qur'an reference (Bangla) */
  sent?: string;
  /** ids of events (articles) about this person */
  events?: number[];
  note?: string;
  source?: string;
  /** lineage not known (no parent link, shows a "?") */
  unknown?: boolean;
}
