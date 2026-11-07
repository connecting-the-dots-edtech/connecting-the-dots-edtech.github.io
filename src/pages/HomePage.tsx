import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { EraJourney } from '../components/EraJourney';
import { EventCard } from '../components/ui/EventCard';
import { SectionHeading } from '../components/ui/SectionHeading';
import { events } from '../data/timeline';
import { useTimelineApp } from '../state/TimelineAppContext';

export function HomePage() {
  const { setSelectedEra } = useTimelineApp();
  const navigate = useNavigate();

  return (
    <>
      <Hero />
      <div className="pr-[max(16px,env(safe-area-inset-right,0px))] pl-[max(16px,env(safe-area-inset-left,0px))]">
        <div className="mx-auto max-w-280">
          <section aria-labelledby="jr-h" className="pt-1.5">
            <SectionHeading id="jr-h" title="আটটি যুগ, একটি ধারাবাহিক গল্প" />
            <EraJourney
              onSelect={(id) => {
                setSelectedEra(id);
                navigate('/eras');
              }}
            />
          </section>
          <section aria-labelledby="st-h" className="pt-10 pb-14">
            <SectionHeading id="st-h" title="যেখান থেকে শুরু" />
            <div className="mt-7 grid grid-cols-3 gap-4 tablet:mx-auto tablet:max-w-[560px] tablet:grid-cols-1">
              {events.slice(0, 3).map((ev) => (
                <EventCard key={ev.id} ev={ev} variant="feature" />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
