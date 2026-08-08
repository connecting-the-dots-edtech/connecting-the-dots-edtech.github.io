import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onOpenSearch: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-90 flex items-center justify-between gap-4 px-6 py-4 backdrop-blur-md bg-linear-to-b from-ink/92 via-ink/65 to-transparent sm:px-10">
      <a href="#home" className="flex items-center gap-3">
        <span className="flex h-[30px] w-[30px] rotate-45 items-center justify-center border border-border-gold">
          <span className="h-2.5 w-2.5 bg-gold" />
        </span>
        <span className="font-serif text-[19px] tracking-[0.06em] text-cream-text">
          Connecting the <span className="text-gold">Dots</span>
        </span>
      </a>
      <nav className="flex items-center gap-5 sm:gap-7">
        <a href="#timeline" className="hidden text-[13px] tracking-[0.14em] text-dim uppercase hover:text-gold-light sm:inline">
          Timeline
        </a>
        <a href="#eras" className="hidden text-[13px] tracking-[0.14em] text-dim uppercase hover:text-gold-light sm:inline">
          Eras
        </a>
        <a href="#lineage" className="hidden text-[13px] tracking-[0.14em] text-dim uppercase hover:text-gold-light sm:inline">
          Lineage
        </a>
        <button
          type="button"
          onClick={onOpenSearch}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border-gold bg-(--surface-2) px-3.5 py-2 text-[13px] text-dim hover:border-gold hover:text-cream-text"
        >
          <span className="inline-block h-3 w-3 rounded-full border-[1.5px] border-gold" />
          Search
        </button>
        <ThemeToggle />
      </nav>
    </header>
  );
}
