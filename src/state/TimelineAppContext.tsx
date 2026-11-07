import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import { events as allEvents, categories, eventMatchesCategory } from '../data/timeline';
import type { CategoryKey, EraId, TimelineEvent, ViewMode } from '../data/types';

const ZOOM_SCALES = [0.7, 1, 1.5, 2.2];
const ZOOM_NAMES = ['Eras', 'Decades', 'Years', 'Detail'];

interface TimelineAppValue {
  view: ViewMode;
  setView: (v: ViewMode) => void;

  zoom: number;
  zoomScale: number;
  zoomLabel: string;
  zoomIn: () => void;
  zoomOut: () => void;

  trackRef: RefObject<HTMLDivElement | null>;
  scrollToEra: (eraId: EraId) => void;

  selectedEra: EraId;
  setSelectedEra: (id: EraId) => void;

  quickLookEvent: TimelineEvent | null;
  openQuickLook: (ev: TimelineEvent) => void;
  closeQuickLook: () => void;

  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  query: string;
  setQuery: (q: string) => void;
  category: CategoryKey;
  setCategory: (c: CategoryKey) => void;
  categories: CategoryKey[];
  searchResults: TimelineEvent[];
}

const TimelineAppContext = createContext<TimelineAppValue | null>(null);

export function TimelineAppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewMode>('timeline');
  const [zoom, setZoom] = useState(1);
  const [selectedEra, setSelectedEra] = useState<EraId>('cosmos');
  const [quickLookEvent, setQuickLookEvent] = useState<TimelineEvent | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryKey>('All');

  const trackRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const zoomIn = useCallback(() => setZoom((z) => Math.min(ZOOM_SCALES.length - 1, z + 1)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(0, z - 1)), []);

  const scrollToEra = useCallback(
    (eraId: EraId) => {
      setView('timeline');
      navigate('/timeline');
      // the Timeline page mounts on the next tick after navigating
      setTimeout(() => {
        const band = document.querySelector<HTMLElement>(`[data-era="${eraId}"]`);
        const scroller = document.getElementById('tl-scroller');
        if (!band || !scroller) return;
        if (window.matchMedia('(max-width: 760px)').matches) {
          band.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          scroller.scrollTo({ left: band.offsetLeft - 16 });
          scroller.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 80);
    },
    [navigate],
  );

  const openQuickLook = useCallback((ev: TimelineEvent) => setQuickLookEvent(ev), []);
  const closeQuickLook = useCallback(() => setQuickLookEvent(null), []);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allEvents.filter(
      (ev) => eventMatchesCategory(ev, category) && (q === '' || (ev.title + ev.titleEn).toLowerCase().includes(q)),
    );
  }, [query, category]);

  const value: TimelineAppValue = {
    view,
    setView,
    zoom,
    zoomScale: ZOOM_SCALES[zoom],
    zoomLabel: ZOOM_NAMES[zoom],
    zoomIn,
    zoomOut,
    trackRef,
    scrollToEra,
    selectedEra,
    setSelectedEra,
    quickLookEvent,
    openQuickLook,
    closeQuickLook,
    searchOpen,
    openSearch,
    closeSearch,
    query,
    setQuery,
    category,
    setCategory,
    categories,
    searchResults,
  };

  return <TimelineAppContext.Provider value={value}>{children}</TimelineAppContext.Provider>;
}

export function useTimelineApp(): TimelineAppValue {
  const ctx = useContext(TimelineAppContext);
  if (!ctx) throw new Error('useTimelineApp must be used within a TimelineAppProvider');
  return ctx;
}
