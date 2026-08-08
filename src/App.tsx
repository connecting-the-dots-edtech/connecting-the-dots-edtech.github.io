import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TimelineExplorer } from './components/TimelineExplorer/TimelineExplorer';
import { EraGrid } from './components/EraGrid';
import { LineageTree } from './components/LineageTree';
import { Footer } from './components/Footer';
import { SearchOverlay } from './components/SearchOverlay';
import { EventModal } from './components/EventModal';
import { TimelineAppProvider, useTimelineApp } from './state/TimelineAppContext';
import { ThemeProvider } from './state/ThemeContext';

function Page() {
  const { openSearch } = useTimelineApp();
  return (
    <div className="relative min-h-screen bg-ink">
      <Header onOpenSearch={openSearch} />
      <Hero />
      <TimelineExplorer />
      <EraGrid />
      <LineageTree />
      <Footer />
      <SearchOverlay />
      <EventModal />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TimelineAppProvider>
        <Page />
      </TimelineAppProvider>
    </ThemeProvider>
  );
}

export default App;
