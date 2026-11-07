import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { TimelinePage } from './pages/TimelinePage';
import { ErasPage } from './pages/ErasPage';
import { LineagePage } from './pages/LineagePage';
import { Footer } from './components/Footer';
import { TabBar } from './components/TabBar';
import { SearchOverlay } from './components/SearchOverlay';
import { EventModal } from './components/EventModal';
import { TimelineAppProvider, useTimelineApp } from './state/TimelineAppContext';
import { ThemeProvider } from './state/ThemeContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // instant: html has scroll-behavior: smooth, which would animate the jump
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function Layout() {
  const { openSearch } = useTimelineApp();
  return (
    <div className="min-h-screen bg-bg phone:pb-[72px]">
      <ScrollToTop />
      <Header onOpenSearch={openSearch} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/eras" element={<ErasPage />} />
        <Route path="/lineage" element={<LineagePage />} />
      </Routes>
      <Footer />
      <TabBar />
      <SearchOverlay />
      <EventModal />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <TimelineAppProvider>
          <Layout />
        </TimelineAppProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
