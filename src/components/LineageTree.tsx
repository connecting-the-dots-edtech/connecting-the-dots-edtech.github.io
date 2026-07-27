import { lineage } from '../data/timeline';

export function LineageTree() {
  return (
    <section
      id="lineage"
      className="border-t border-border-gold bg-[radial-gradient(120%_90%_at_50%_0%,#14101E_0%,#0A0A12_55%,#08090F_100%)] px-5 py-25 sm:px-10"
    >
      <div className="mx-auto max-w-250 text-center">
        <div className="mb-3 text-xs tracking-[0.34em] text-gold uppercase">◆ The Sacred Lineage</div>
        <h2 className="mb-2.5 font-serif text-[clamp(30px,4vw,48px)] font-normal text-cream">From Adam (AS) onward</h2>
        <p className="mx-auto mb-12.5 max-w-140 text-[15px] leading-[1.6] text-mute">
          A branching tree that grows as you scroll — tracing prophethood through the generations.
        </p>

        <div className="flex flex-col items-center">
          {lineage.map((n, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`inline-flex items-center gap-3.5 rounded-full border bg-panel/70 px-6.5 py-3 whitespace-nowrap backdrop-blur-sm ${n.borderClass}`}>
                <span className={`h-2 w-2 flex-none rotate-45 ${n.dotClass}`} />
                <span className={`font-bn text-cream ${n.sizeClass}`}>{n.bn}</span>
                <span className="text-xs tracking-wide text-faint">{n.en}</span>
              </div>

              {n.hasBranch && n.branches && (
                <>
                  <span className="h-6.5 w-px bg-[rgba(201,162,90,0.4)]" />
                  <div className="relative flex gap-15">
                    <span className="absolute inset-x-1/4 top-0 h-px bg-[rgba(201,162,90,0.4)]" />
                    {n.branches.map((b, bi) => (
                      <div key={bi} className="flex flex-col items-center">
                        <span className="h-6.5 w-px bg-[rgba(201,162,90,0.4)]" />
                        <div className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(95,168,160,0.35)] bg-[rgba(20,16,30,0.7)] px-5 py-2.5 whitespace-nowrap">
                          <span className="font-bn text-[17px] text-gold-pale">{b.bn}</span>
                          <span className="text-[11px] text-[#7E9C96]">{b.en}</span>
                        </div>
                        <span className="mt-2 text-[10px] tracking-wide text-ghost uppercase">{b.note}</span>
                      </div>
                    ))}
                  </div>
                  <span className="h-6.5 w-px bg-[rgba(201,162,90,0.25)]" />
                </>
              )}

              {n.connector && (
                <span className="relative h-6.5 w-px bg-[rgba(201,162,90,0.4)]">
                  <span className="absolute top-1/2 left-1/2 h-1.25 w-1.25 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gold" />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
