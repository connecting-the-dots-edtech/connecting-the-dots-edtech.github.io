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
