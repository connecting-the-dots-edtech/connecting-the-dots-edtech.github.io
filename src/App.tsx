import { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { TimelinePage } from './pages/TimelinePage';
import { ErasPage } from './pages/ErasPage';
import { LineagePage } from './pages/LineagePage';
import { Footer } from './components/Footer';
import { SearchOverlay } from './components/SearchOverlay';
import { EventModal } from './components/EventModal';
import { TimelineAppProvider, useTimelineApp } from './state/TimelineAppContext';
import { ThemeProvider } from './state/ThemeContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout() {
  const { openSearch } = useTimelineApp();
  return (
    <div className="relative min-h-screen bg-ink">
      <ScrollToTop />
      <Header onOpenSearch={openSearch} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/eras" element={<ErasPage />} />
        <Route path="/lineage" element={<LineagePage />} />
      </Routes>
      <Footer />
      <SearchOverlay />
      <EventModal />
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <TimelineAppProvider>
          <Layout />
        </TimelineAppProvider>
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;
