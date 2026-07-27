const MARKERS = [
  { pos: 'top-[40%] left-[44%]', size: 'h-3.5 w-3.5', color: 'bg-gold', timing: '[animation-duration:2.5s]' },
  { pos: 'top-[52%] left-[58%]', size: 'h-3 w-3', color: 'bg-teal', timing: '[animation-duration:3s]' },
  { pos: 'top-[34%] left-[66%]', size: 'h-2.5 w-2.5', color: 'bg-gold', timing: '[animation-duration:3.4s]' },
];

export function MapView() {
  return (
    <div className="mx-auto mt-8.5 max-w-290 px-5 sm:px-10">
      <div className="relative h-115 overflow-hidden rounded-2xl border border-border-gold bg-[radial-gradient(120%_120%_at_30%_20%,#12253A_0%,#0C1622_60%,#0A0E16_100%)]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[34px_34px]"
        />
        <div className="absolute top-1/2 left-1/2 max-w-[70%] -translate-x-1/2 -translate-y-1/2 text-center font-mono text-xs tracking-wide text-[#6E7C86]">
          Schematic overview — the spread of Islamic civilisation across regions and centuries.
          <br />
          A fully geo-accurate historical map is on the roadmap.
        </div>
        {MARKERS.map((m, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`absolute animate-pulse-ring rounded-full ${m.pos} ${m.size} ${m.color} ${m.timing}`}
          />
        ))}
        <div className="absolute bottom-5 left-5 max-w-[80%] rounded-[10px] border border-border bg-ink/70 px-4 py-3 text-xs text-[#B8B09C] sm:max-w-80">
          <div className="mb-1.5 text-[10px] tracking-[0.14em] text-gold uppercase">Timeline scrubber ↔</div>
          রশিদুন যুগ · ৬৩২–৬৬১ খ্রি. · সাম্রাজ্যের বিস্তার
        </div>
      </div>
    </div>
  );
}
