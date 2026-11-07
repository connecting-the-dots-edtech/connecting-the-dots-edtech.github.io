import { Link } from 'react-router-dom';
import { useTheme } from '../state/ThemeContext';
import { useTimelineApp } from '../state/TimelineAppContext';
import { stars } from '../data/stars';
import { events } from '../data/timeline';
import { Emblem } from './ui/Emblem';

const BTN = 'inline-flex h-12 items-center gap-2.5 rounded-full px-[22px] font-ui text-[15px]';

/** Home title card: bismillah, tagline, headline, lede, CTAs, then the emblem rising over the horizon. */
export function Hero() {
  const { theme } = useTheme();
  const { openQuickLook } = useTimelineApp();

  return (
    <section className="relative overflow-hidden bg-bg bg-[radial-gradient(70%_55%_at_50%_100%,var(--glow),transparent_70%),radial-gradient(55%_45%_at_50%_0%,color-mix(in_srgb,var(--glow)_60%,transparent),transparent_70%)]">
      {theme === 'dark' && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {stars.map((s, i) => (
            <span
              key={i}
              className={'absolute animate-twinkle rounded-full bg-[#F5ECD6] ' + s.left + ' ' + s.top + ' ' + s.size + ' ' + s.timing}
            />
          ))}
        </div>
      )}

      <div className="relative z-2 pr-[max(16px,env(safe-area-inset-right,0px))] pl-[max(16px,env(safe-area-inset-left,0px))]">
        <div className="mx-auto grid max-w-280 justify-items-center pt-16 pb-1 text-center phone:pt-10">
          <div dir="rtl" lang="ar" className="inline-block font-ar text-[40px] leading-[1.4] text-gold phone:text-[32px]">
            بِسْمِ اللَّٰهِ
          </div>
          <div className="mt-3.5 flex items-center gap-3.5 font-bn text-[16px] font-medium text-muted phone:gap-2.5 phone:text-[14.5px]">
            <span aria-hidden="true" className="h-px w-12 flex-none bg-linear-to-r from-transparent to-gold phone:w-[22px]" />
            ইসলামের ইতিহাসের একটি ইন্টারঅ্যাকটিভ প্রামাণ্যচিত্র
            <span aria-hidden="true" className="h-px w-12 flex-none bg-linear-to-r from-gold to-transparent phone:w-[22px]" />
          </div>
          <h1 className="mt-[18px] font-bn-display text-[clamp(36px,6.6vw,88px)] leading-[1.25] text-text">
            সৃষ্টির সূচনা থেকে{' '}
            <span className="block bg-linear-to-r from-gold via-gold-2 via-50% to-gold bg-clip-text pb-[0.06em] text-transparent">
              খিলাফতের যুগ পর্যন্ত
            </span>
          </h1>
          <p className="mt-4 max-w-[32em] font-bn text-[19px] leading-[1.8] text-text-2 phone:text-[17px]">
            সৃষ্টির সূচনা থেকে আদম (আঃ), নবীগণ ও ইসলামের মহাযাত্রা। একটি নিমগ্ন সময়রেখায় ভ্রমণ করুন।
          </p>
          <div lang="en" className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/timeline"
              className={BTN + ' bg-gold-fill font-semibold text-on-gold hover:brightness-[1.06]'}
            >
              Begin the Journey <span aria-hidden="true">→</span>
            </Link>
            <button
              type="button"
              onClick={() => openQuickLook(events[0])}
              className={BTN + ' border border-line-strong font-medium text-text hover:border-gold hover:text-gold'}
            >
              Read the First Event
            </button>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="relative mt-1 h-[250px] before:absolute before:top-0 before:left-1/2 before:-ml-[450px] before:h-[340px] before:w-[900px] before:bg-[radial-gradient(closest-side,var(--glow),transparent)] phone:h-[190px]"
      >
        <div className="absolute top-[170px] left-1/2 z-1 -mt-[170px] -ml-[170px] size-[340px] drop-shadow-[0_0_30px_var(--glow)] phone:top-[130px] phone:-mt-[120px] phone:-ml-[120px] phone:size-[240px]">
          <Emblem spin className="block size-full" />
        </div>
        <div className="absolute top-[170px] left-1/2 z-2 -ml-[1400px] size-[2800px] rounded-full bg-bg shadow-[0_-1px_0_0_color-mix(in_srgb,var(--gold)_75%,transparent),0_-26px_70px_-14px_color-mix(in_srgb,var(--gold)_38%,transparent)] phone:top-[130px] phone:-ml-[800px] phone:size-[1600px]" />
        <div className="absolute top-[170px] bottom-0 left-1/2 z-3 -ml-px w-0.5 bg-linear-to-b from-gold to-[color-mix(in_srgb,var(--gold)_30%,transparent)] after:absolute after:top-0 after:left-1/2 after:-ml-[3px] after:size-1.5 after:animate-travel after:rounded-full after:bg-gold-2 after:shadow-[0_0_10px_var(--gold)] phone:top-[130px]" />
      </div>
    </section>
  );
}
