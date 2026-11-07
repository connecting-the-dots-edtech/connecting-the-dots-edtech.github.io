/** Sura-header cap: the same path on both sides, the right one mirrored (prototype CAP). */
function Cap({ flip }: { flip?: boolean }) {
  return (
    <span className={'w-[42px] flex-none phone:w-[30px]' + (flip ? ' -scale-x-100' : '')}>
      <svg viewBox="0 0 42 84" preserveAspectRatio="none" aria-hidden="true" className="block size-full overflow-visible">
        <path
          d="M42 0.75 H26 L2 42 L26 83.25 H42 Z"
          className="fill-[color-mix(in_srgb,var(--gold)_8%,var(--bg))] stroke-none"
        />
        <path
          vectorEffect="non-scaling-stroke"
          strokeWidth="1.5"
          d="M42 0.75 H26 L2 42 L26 83.25 H42"
          className="fill-none stroke-gold"
        />
        <path
          vectorEffect="non-scaling-stroke"
          strokeWidth="1"
          d="M42 6.5 H29.5 L9.5 42 L29.5 77.5 H42"
          className="fill-none stroke-gold [stroke-opacity:0.7]"
        />
        <rect x="-1" y="39" width="6" height="6" transform="rotate(45 2 42)" className="fill-gold" />
      </svg>
    </span>
  );
}

const MASK = '[mask-image:radial-gradient(55%_95%_at_50%_45%,#000,transparent_78%)]';
const WEBKIT_MASK = '[-webkit-mask-image:radial-gradient(55%_95%_at_50%_45%,#000,transparent_78%)]';

/** Shared page title band (Eras, Lineage): sky gradient, gold glow, girih lattice, cartouche title, horizon arc. */
export function PageHeader({ title }: { title: string }) {
  return (
    <div className="relative overflow-hidden bg-linear-to-b from-[color-mix(in_srgb,var(--raised)_75%,var(--bg))] to-bg before:pointer-events-none before:absolute before:top-[-80px] before:left-1/2 before:-ml-[340px] before:h-[280px] before:w-[680px] before:rounded-full before:bg-(--glow) before:blur-[48px]">
      <svg
        aria-hidden="true"
        className={'pointer-events-none absolute inset-0 size-full opacity-5 blur-[0.6px] ' + MASK + ' ' + WEBKIT_MASK}
      >
        <defs>
          <pattern id="girih-p" width="56" height="56" patternUnits="userSpaceOnUse">
            <g fill="none" strokeWidth="0.8" className="stroke-gold">
              <rect x="19" y="19" width="18" height="18" />
              <rect x="19" y="19" width="18" height="18" transform="rotate(45 28 28)" />
              <path d="M28 0V15.3M28 40.7V56M0 28H15.3M40.7 28H56" />
              <path d="M0 -6L6 0L0 6L-6 0Z M56 -6L62 0L56 6L50 0Z M0 50L6 56L0 62L-6 56Z M56 50L62 56L56 62L50 56Z" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#girih-p)" />
      </svg>
      <div className="relative z-1 pr-[max(16px,env(safe-area-inset-right,0px))] pl-[max(16px,env(safe-area-inset-left,0px))]">
        <div className="mx-auto grid max-w-280 justify-items-center gap-4 pt-10 pb-1 text-center phone:pt-8">
          <div className="inline-flex h-[84px] max-w-full items-stretch phone:h-auto phone:min-h-16">
            <Cap />
            <h1 className="relative m-0 flex min-w-0 items-center justify-center border-y-[1.5px] border-gold bg-[color-mix(in_srgb,var(--gold)_8%,var(--bg))] px-[22px] font-bn-display text-[38px] leading-[1.2] whitespace-nowrap text-text before:pointer-events-none before:absolute before:inset-x-0 before:inset-y-[5px] before:border-y before:border-[color-mix(in_srgb,var(--gold)_70%,transparent)] phone:px-3 phone:py-3 phone:text-center phone:text-[clamp(22px,6.4vw,28px)] phone:whitespace-normal phone:before:inset-y-1">
              {title}
            </h1>
            <Cap flip />
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="relative h-[46px] overflow-hidden before:absolute before:top-6 before:left-1/2 before:-ml-[1400px] before:size-[2800px] before:rounded-full before:bg-bg before:shadow-[0_-1px_0_0_color-mix(in_srgb,var(--gold)_60%,transparent),0_-18px_50px_-16px_color-mix(in_srgb,var(--gold)_34%,transparent)]"
      />
    </div>
  );
}
