import { Link } from 'react-router-dom';
import { useParallax } from '../hooks/useParallax';
import { useTheme } from '../state/ThemeContext';
import { stars } from '../data/stars';

export function Hero() {
  const starfieldRef = useParallax<HTMLDivElement>(0.18);
  const haloRef = useParallax<HTMLDivElement>(0.05);
  const { theme } = useTheme();

  return (
    <section
      id="home"
      className="hero-backdrop relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {theme === 'dark' && (
        <>
          <div
            ref={starfieldRef}
            aria-hidden="true"
            className="absolute inset-x-0 top-[-10%] bottom-0 bg-[radial-gradient(1px_1px_at_20%_30%,rgba(255,255,255,0.7),transparent),radial-gradient(1px_1px_at_70%_20%,rgba(255,255,255,0.5),transparent),radial-gradient(1px_1px_at_40%_70%,rgba(255,255,255,0.6),transparent),radial-gradient(1.5px_1.5px_at_85%_60%,rgba(255,255,255,0.5),transparent),radial-gradient(1px_1px_at_12%_82%,rgba(255,255,255,0.5),transparent),radial-gradient(1px_1px_at_58%_48%,rgba(255,255,255,0.45),transparent),radial-gradient(1.5px_1.5px_at_90%_33%,rgba(255,255,255,0.55),transparent)]"
          />
          {stars.map((s, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`absolute rounded-full bg-gold-pale animate-twinkle ${s.left} ${s.top} ${s.size} ${s.timing}`}
            />
          ))}
        </>
      )}
      <div ref={haloRef} aria-hidden="true" className="absolute top-[14%] h-[340px] w-[340px] opacity-50">
        <span className="absolute inset-0 animate-spin-slow border border-[rgba(201,162,90,0.22)]" />
        <span className="absolute inset-[30px] rotate-45 animate-spin-slow-reverse border border-[rgba(201,162,90,0.16)]" />
        <span className="absolute inset-[90px] rounded-full border border-[rgba(95,168,160,0.22)]" />
      </div>

      <div className="relative z-2 animate-rise-in px-6">
        <div dir="rtl" className="mb-2 font-ar text-[clamp(28px,4vw,46px)] text-gold">
          بِسْمِ اللَّٰهِ
        </div>
        <div className="mb-6 text-xs tracking-[0.42em] text-faint uppercase">
          An Interactive Documentary of Islamic History
        </div>
        <h1 className="font-serif text-[clamp(44px,8vw,104px)] leading-[1.02] font-normal tracking-[-0.01em] text-cream">
          From the Cosmos
          <br />
          <span className="text-gold italic">to the Caliphates</span>
        </h1>
        <p className="mx-auto mt-6 max-w-[620px] font-bn text-[clamp(16px,2vw,21px)] leading-[1.7] text-dim">
          সৃষ্টির সূচনা থেকে আদম (আঃ), নবীগণ ও ইসলামের মহাযাত্রা — একটি নিমগ্ন সময়রেখায় ভ্রমণ করুন।
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/timeline"
            className="inline-flex items-center gap-2.5 rounded-full bg-gold px-7.5 py-4 text-[15px] font-semibold tracking-[0.02em] text-ink shadow-[0_12px_40px_rgba(201,162,90,0.28)] hover:brightness-105"
          >
            Begin the Journey <span aria-hidden="true">→</span>
          </Link>
          <Link
            to="/lineage"
            className="inline-flex items-center gap-2.5 rounded-full border border-border-strong px-7.5 py-4 text-[15px] text-cream-text hover:border-border-gold hover:text-gold-light"
          >
            Explore the Lineage
          </Link>
        </div>
      </div>
    </section>
  );
}
