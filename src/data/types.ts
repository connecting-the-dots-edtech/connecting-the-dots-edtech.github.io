export type EraId = 'cosmos' | 'prophets' | 'jahiliyya' | 'seerah' | 'rashidun' | 'umayyad' | 'abbasid' | 'later';

export interface Era {
  id: EraId;
  bn: string;
  en: string;
  short: string;
  span: string;
  /** legacy, removed in Task 11 (era colour now comes from `eraVar`) */
  tint?: string;
  /** legacy, removed in Task 11 */
  accent?: string;
  /** legacy, removed in Task 11 */
  glyph?: string;
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

export interface LineageBranch {
  bn: string;
  en: string;
  note: string;
}

export interface LineageNode {
  bn: string;
  en: string;
  /** literal Tailwind text-size class, e.g. 'text-2xl' */
  sizeClass: string;
  /** literal Tailwind bg-[...] class for the pill's diamond dot */
  dotClass: string;
  /** literal Tailwind border-[...] class for the pill's ring */
  borderClass: string;
  connector?: boolean;
  hasBranch?: boolean;
  branches?: LineageBranch[];
}

export type CategoryKey = 'All' | 'Creation' | 'Prophets' | 'Revelation' | 'Caliphates';

export type ViewMode = 'timeline' | 'list';
